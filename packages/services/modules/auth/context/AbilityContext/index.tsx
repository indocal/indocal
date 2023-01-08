import { useRef, useEffect, createContext } from 'react';
import useSWR from 'swr/immutable';
import { createMongoAbility, MongoAbility } from '@casl/ability';
import { useAbility as useCASLAbility } from '@casl/react';
import qs from 'qs';

import { MultipleEntitiesResponse } from '../../../../common';
import { AuthenticatedUser, UserRole } from '../../../../modules';
import { ApiEndpoints } from '../../../../config';

export const AbilityContext = createContext(createMongoAbility());

export const AbilityProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data: me } = useSWR<AuthenticatedUser | null>(ApiEndpoints.ME);

  const { data: roles } = useSWR<MultipleEntitiesResponse<UserRole>>(() =>
    me
      ? `${ApiEndpoints.USERS_ROLES}?${qs.stringify({
          filters: { users: { some: { id: me.id } } },
        })}`
      : null
  );

  const ability = useRef(createMongoAbility());

  useEffect(() => {
    if (roles?.entities) {
      ability.current.update(
        roles.entities
          .map((role) =>
            role.permissions.map((permission) => {
              const [scope, action] = permission.action.split('::');

              return { action, subject: scope };
            })
          )
          .flat()
      );
    }
  }, [roles?.entities]);

  return (
    <AbilityContext.Provider value={ability.current}>
      {children}
    </AbilityContext.Provider>
  );
};

export function useAbility(): MongoAbility {
  return useCASLAbility(AbilityContext);
}

export default AbilityProvider;
