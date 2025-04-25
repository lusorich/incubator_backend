import { config } from 'dotenv';

config();

export type EnvironmentVariable = { [key: string]: string | undefined };
export type EnvironmentsTypes = 'DEVELOPMENT' | 'PRODUCTION' | 'TESTING';
export const Environments = ['DEVELOPMENT', 'PRODUCTION', 'TESTING'];

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env;
  }

  isProduction() {
    return this.env === 'PRODUCTION';
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT';
  }

  isTesting() {
    return this.env === 'TESTING';
  }
}

export class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings,
  ) {}
}

class APISettings {
  // Application
  public readonly APP_PORT: number;
  public readonly HASH_ROUNDS: number;
  public readonly ADMIN_LOGIN: string;
  public readonly ADMIN_PASSWORD: string;

  // Database
  public readonly MONGO_CONNECTION_URI: string;
  public readonly MONGO_CONNECTION_URI_FOR_TESTS: string;

  // Mail
  public readonly MAIL_USER: string;
  public readonly MAIL_PASSWORD: string;

  // JWT
  public readonly SECRET_ACCESS_TOKEN: string;
  public readonly SECRET_REFRESH_TOKEN: string;

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.APP_PORT = this.getNumberOrDefault(
      envVariables.APP_PORT as string,
      7840,
    );
    this.HASH_ROUNDS = this.getNumberOrDefault(envVariables.HASH_ROUNDS, 10);
    this.ADMIN_LOGIN = envVariables.ADMIN_PASSWORD ?? 'admin';
    this.ADMIN_PASSWORD = envVariables.ADMIN_PASSWORD ?? 'qwerty';

    // Database
    this.MONGO_CONNECTION_URI =
      envVariables.MONGO_CONNECTION_URI ?? 'mongodb://localhost:27017';
    this.MONGO_CONNECTION_URI_FOR_TESTS =
      envVariables.MONGO_CONNECTION_URI_FOR_TESTS ??
      'mongodb://localhost:27017';

    // Mail
    this.MAIL_USER = envVariables.MAIL_USER;
    this.MAIL_PASSWORD = envVariables.MAIL_PASSWORD;

    // JWT
    this.SECRET_ACCESS_TOKEN = envVariables.SECRET_ACCESS_TOKEN;
    this.SECRET_REFRESH_TOKEN = envVariables.SECRET_REFRESH_TOKEN;
  }

  private getNumberOrDefault(value: any, defaultValue: number): number {
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      return defaultValue;
    }

    return parsedValue;
  }
}

const env = new EnvironmentSettings(
  (Environments.includes((process.env.ENV as string)?.trim())
    ? (process.env.ENV as string).trim()
    : 'DEVELOPMENT') as EnvironmentsTypes,
);

const api = new APISettings(process.env);
export const appSettings = new AppSettings(env, api);
