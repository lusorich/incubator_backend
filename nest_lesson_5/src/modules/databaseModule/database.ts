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
}

export interface DB {
  users: UserTable;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<Exclude<UserTable, 'created_at' | 'id'>>;

export class Database extends Kysely<DB> {}
