import { useState, useEffect, createContext } from 'react';
import useSWR from 'swr/immutable';
import { createMongoAbility, MongoAbility } from '@casl/ability';
import { useAbility as useCASLAbility } from '@casl/react';
import qs from 'qs';

import { MultipleEntitiesResponse } from '../../../../common';
import { JWT, UserRole } from '../../../../modules';
import { ApiEndpoints } from '../../../../config';

import { TOKEN_KEY } from '../../config';

export const AbilityContext = createContext(createMongoAbility());

export const AbilityProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data: me } = useSWR<JWT | null>(
    typeof document !== 'undefined' && document.cookie.includes(TOKEN_KEY)
      ? ApiEndpoints.ME
      : null
  );

  const { data: roles } = useSWR<MultipleEntitiesResponse<UserRole>>(() =>
    me && me.type === 'user'
      ? `${ApiEndpoints.USERS_ROLES}?${qs.stringify({
          filters: { users: { some: { id: me.user.id } } },
        })}`
      : null
  );

  const [ability, setAbility] = useState(createMongoAbility());

  useEffect(() => {
    if (roles?.entities) {
      setAbility(
        createMongoAbility(
          roles.entities
            .map((role) =>
              role.permissions.map((permission) => {
                const [scope, action] = permission.action.split('::');

                return { action, subject: scope };
              })
            )
            .flat()
        )
      );
    }
  }, [roles?.entities]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export function useAbility(): MongoAbility {
  return useCASLAbility(AbilityContext);
}

export default AbilityProvider;
