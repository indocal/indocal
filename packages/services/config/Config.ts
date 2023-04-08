import axios, { AxiosInstance } from 'axios';

import { AuthService } from '../modules/auth';

export type ConfigOptions = {
  baseURL: string;
  token?: string;
};

export class Config {
  axios: AxiosInstance;

  constructor(options: ConfigOptions) {
    this.axios = axios.create({
      baseURL: options.baseURL,
    });

    this.axios.interceptors.request.use((config) => {
      const token = AuthService.getToken();

      if (token || options.token) {
        config.headers.Authorization = token
          ? (config.headers.Authorization = `Bearer ${token}`)
          : (config.headers.Authorization = `Bearer ${options.token}`);
      }

      return config;
    });
  }
}

export default Config;
