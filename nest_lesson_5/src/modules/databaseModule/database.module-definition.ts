import { ConfigurableModuleBuilder } from '@nestjs/common';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<any>().setClassMethodName('forRoot').build();
