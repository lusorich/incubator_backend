import { Kysely, Generated, ColumnType, Selectable, Insertable } from 'kysely';

export interface UserTable {
  id: Generated<string>;
  login: string;
  email: string;
  password: string;
  created_at: ColumnType<Date, string | undefined, string>;
  email_confirmation_code: string | null;
  email_confirmation_expire: Date | null;
  email_confirmation_is_confirmed: boolean | null;
  password_recovery_code: string | null;
  password_recovery_is_used: boolean | null;
  password_recovery_expire: Date | null;
}

export interface SecurityDevicesTable {
  id: Generated<string>;
  user_id: string;
  device_id: string;
  device_name: string;
  iat: number | string;
  exp: ColumnType<Date, Date | undefined, string | Date>;
  ip: string;
}

export interface DB {
  users: UserTable;
  security_devices: SecurityDevicesTable;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<Exclude<UserTable, 'created_at' | 'id'>>;

export class Database extends Kysely<DB> {}
