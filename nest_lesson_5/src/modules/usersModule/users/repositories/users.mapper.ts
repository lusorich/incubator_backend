import { UserRow } from 'src/modules/databaseModule/database';
import { User } from '../domain/user.entity';

export function toUser(row: UserRow): User {
  return {
    ...row,
  };
}
