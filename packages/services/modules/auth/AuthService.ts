import { AxiosResponse } from 'axios';
import Cookies, { CookieAttributes } from 'js-cookie';
import { addDays } from 'date-fns';

import { ServiceError, createServiceError } from '../../common';
import { Config, ApiEndpoints } from '../../config';

import { TOKEN_KEY, AuthTokenPersistence } from './config';
import {
  JWT,
  Session,
  SignInByCredentialsDto,
  RestorePasswordDto,
} from './types';

import {
  ApiTokensService,
  UsersService,
  UsersRolesService,
  UsersGroupsService,
} from './submodules';

export interface SignInReturn {
  session: Session | null;
  error: ServiceError | null;
}

export interface MeReturn {
  me: JWT | null;
  error: ServiceError | null;
}

export interface SendRestorePasswordEmailReturn {
  error: ServiceError | null;
}

export class AuthService {
  persistence: AuthTokenPersistence = AuthTokenPersistence.NONE;

  apiTokens: ApiTokensService;
  users: UsersService;
  roles: UsersRolesService;
  groups: UsersGroupsService;

  constructor(private config: Config) {
    this.apiTokens = new ApiTokensService(config);
    this.users = new UsersService(config);
    this.roles = new UsersRolesService(config);
    this.groups = new UsersGroupsService(config);
  }

  setPersistence(persistence: AuthTokenPersistence): void {
    this.persistence = persistence;
  }

  static getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  static setToken(token: string, options?: CookieAttributes): void {
    Cookies.set(TOKEN_KEY, token, options);
  }

  async signInByCredentials(
    username: string,
    password: string
  ): Promise<SignInReturn> {
    try {
      const response = await this.config.axios.post<
        Session,
        AxiosResponse<Session, SignInByCredentialsDto>,
        SignInByCredentialsDto
      >(ApiEndpoints.SIGN_IN, { username, password });

      if (this.persistence === AuthTokenPersistence.SESSION) {
        AuthService.setToken(response.data.access_token, {
          path: '/',
        });
      }

      if (this.persistence === AuthTokenPersistence.LOCAL) {
        AuthService.setToken(response.data.access_token, {
          path: '/',
          expires: addDays(new Date(response.data.issued_at), 7),
        });
      }

      return {
        session: response.data,
        error: null,
      };
    } catch (error) {
      return {
        session: null,
        error: createServiceError(error),
      };
    }
  }

  async signOut(): Promise<void> {
    Cookies.remove(TOKEN_KEY);
  }

  async me(): Promise<MeReturn> {
    try {
      const response = await this.config.axios.get<JWT>(ApiEndpoints.ME);

      return {
        me: response.data,
        error: null,
      };
    } catch (error) {
      return {
        me: null,
        error: createServiceError(error),
      };
    }
  }

  async sendRestorePasswordEmail(
    email: string,
    redirectUrl: string
  ): Promise<SendRestorePasswordEmailReturn> {
    try {
      await this.config.axios.post<
        void,
        AxiosResponse<Session, RestorePasswordDto>,
        RestorePasswordDto
      >(ApiEndpoints.RESTORE_PASSWORD, { email, redirectUrl });

      return {
        error: null,
      };
    } catch (error) {
      return {
        error: createServiceError(error),
      };
    }
  }
}

export default AuthService;
