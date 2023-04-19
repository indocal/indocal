import { useMemo, createContext } from 'react';
import useSWR from 'swr/immutable';
import {
  createMongoAbility,
  MongoAbility,
  AbilityTuple,
  MongoQuery,
} from '@casl/ability';
import { useAbility } from '@casl/react';
import qs from 'qs';

import { MultipleEntitiesResponse } from '../../../../common';
import { JWT, UserRole } from '../../../../modules';
import { ApiEndpoints } from '../../../../config';

import { TOKEN_KEY } from '../../config';

export type AppAbility = MongoAbility<AbilityTuple, MongoQuery>;

export const AbilityContext = createContext(createMongoAbility<AppAbility>());

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

  const ability = useMemo(
    () =>
      createMongoAbility<AppAbility>(
        roles?.entities
          .map((role) =>
            role.permissions.map((permission) => {
              const [scope, action] = permission.action.split('::');

              return { action, subject: scope };
            })
          )
          .flat()
      ),
    [roles?.entities]
  );

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export function useAppAbility(): AppAbility {
  return useAbility(AbilityContext);
}

export default AbilityProvider;
