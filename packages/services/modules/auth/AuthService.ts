import { AxiosResponse } from 'axios';
import Cookies, { CookieAttributes } from 'js-cookie';
import { addDays } from 'date-fns';

import { ServiceError, createServiceError } from '../../common';
import { Config, ApiEndpoints } from '../../config';

import { TOKEN_KEY, AuthTokenPersistence } from './config';
import {
  Session,
  AuthenticatedUser,
  SignInByCredentialsDto,
  SendRestorePasswordDto,
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
  me: AuthenticatedUser | null;
  error: ServiceError | null;
}

export interface SendRestorePasswordEmailReturn {
  error: ServiceError | null;
}

export class AuthService {
  apiTokens: ApiTokensService;
  users: UsersService;
  roles: UsersRolesService;
  groups: UsersGroupsService;

  persistence: AuthTokenPersistence = AuthTokenPersistence.NONE;

  constructor(private config: Config) {
    this.apiTokens = new ApiTokensService(config);
    this.users = new UsersService(config);
    this.roles = new UsersRolesService(config);
    this.groups = new UsersGroupsService(config);
  }

  static getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  static setToken(token: string, options?: CookieAttributes): void {
    Cookies.set(TOKEN_KEY, token, options);
  }

  async setPersistence(persistence: AuthTokenPersistence): Promise<void> {
    this.persistence = persistence;
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
      const response = await this.config.axios.get<AuthenticatedUser>(
        ApiEndpoints.ME
      );

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
    email: string
  ): Promise<SendRestorePasswordEmailReturn> {
    try {
      await this.config.axios.post<
        AuthenticatedUser,
        AxiosResponse<Session, SendRestorePasswordDto>,
        SendRestorePasswordDto
      >(ApiEndpoints.RESTORE_PASSWORD, { email });

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
