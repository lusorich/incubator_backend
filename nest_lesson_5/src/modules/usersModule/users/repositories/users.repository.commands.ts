import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '../models/users.dto';
import { Database } from 'src/modules/databaseModule/database';
import { sql } from 'kysely';
import { User } from '../domain/user.entity';
import { EmailConfirmation } from '../domain/email-confirmation';
import { PasswordConfirmation } from '../domain/password-confirmation';
import { UsersCommandsRepository } from '../domain/user/UsersCommandsRepository';

@Injectable()
export class KyselyUsersCommandsRepository implements UsersCommandsRepository {
  constructor(private database: Database) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    return await this.database
      .insertInto('users')
      .values(createUserInput)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateUserIsConfirmed(user: User, isConfirmed: boolean) {
    const updateResult = await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', isConfirmed)
      .where('id', '=', user.id)
      .executeTakeFirst();

    return updateResult.numUpdatedRows > 0n;
  }

  async updateUserEmailConfirmation(
    user: User,
    emailConfirmation: EmailConfirmation,
  ) {
    const updateResult = await this.database
      .updateTable('users')
      .set('email_confirmation_is_confirmed', emailConfirmation.isConfirmed)
      .set('email_confirmation_code', emailConfirmation.code)
      .set('email_confirmation_expire', emailConfirmation.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();

    return updateResult.numUpdatedRows > 0n;
  }

  async updatePasswordRecovery(
    user: User,
    passwordRecovery: PasswordConfirmation,
  ) {
    const updateResult = await this.database
      .updateTable('users')
      .set('password_recovery_is_used', passwordRecovery.isUsed)
      .set('password_recovery_code', passwordRecovery.recoveryCode)
      .set('password_recovery_expire', passwordRecovery.expire)
      .where('login', '=', user.login)
      .executeTakeFirst();

    return updateResult.numUpdatedRows > 0n;
  }

  async updatePassword(user: User, newPassword: string) {
    const updateResult = await this.database
      .updateTable('users')
      .set('password', newPassword)
      .where('login', '=', user.login)
      .executeTakeFirst();

    return updateResult.numUpdatedRows > 0n;
  }

  async delete(id: string) {
    const updateResult = await this.database
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();

    return updateResult.numDeletedRows > 0n;
  }

  async deleteAll() {
    return await sql`TRUNCATE TABLE users CASCADE`.execute(this.database);
  }
}
