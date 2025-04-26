import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { Database } from './database';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';

interface DatabaseOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: databaseOptions.host,
            port: databaseOptions.port,
            user: databaseOptions.user,
            password: databaseOptions.password,
            database: databaseOptions.database,
          }),
        });

        return new Database({
          dialect,
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
