import { Kysely, Generated, ColumnType, Selectable, Insertable } from 'kysely';

export interface UserTable {
  id: Generated<string>;
  login: string;
  email: string;
  password: string;
  created_at: ColumnType<Date, string | undefined, string>;
  // emailConfirmation: {
  //   code: string;
  //   expire: ColumnType<Date, string | undefined, string>;
  //   isConfirmed: boolean;
  // };
}

export interface DB {
  users: UserTable;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<Exclude<UserTable, 'created_at' | 'id'>>;

export class Database extends Kysely<DB> {}
