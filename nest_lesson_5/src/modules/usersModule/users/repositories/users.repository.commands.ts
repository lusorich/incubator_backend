import { Injectable } from '@nestjs/common';
import { CreateUserInputDto } from '../models/users.dto';
import { Database, User } from 'src/modules/databaseModule/database';
import { sql } from 'kysely';

@Injectable()
export class UsersCommandsRepository {
  constructor(private database: Database) {}

  async create(createUserInput: CreateUserInputDto): Promise<User> {
    return await this.database
      .insertInto('users')
      .values(createUserInput)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateUserIsConfirmed(user, isConfirmed) {
    return await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', isConfirmed)
      .where('id', '=', user.id)
      .executeTakeFirst();
  }

  async updateUserEmailConfirmation(user, emailConfirmation) {
    return await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', emailConfirmation.isConfirmed)
      .set('email_confirmation_code', emailConfirmation.code)
      .set('email_confirmation_expire', emailConfirmation.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async updatePasswordRecovery(user, passwordRecovery) {
    return await this.database
      .updateTable('users')
      .set('password_recovery_is_used', passwordRecovery.isUsed)
      .set('password_recovery_code', passwordRecovery.recoveryCode)
      .set('password_recovery_expire', passwordRecovery.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async updatePassword(user, newPassword) {
    return await this.database
      .updateTable('users')
      .set('password', newPassword)
      .where('login', '=', user.login)
      .executeTakeFirst();
  }

  async delete(id: string) {
    return await this.database
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async deleteAll() {
    return await sql`TRUNCATE TABLE users CASCADE`.execute(this.database);
  }
}
