import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'mysql'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'app_db'),
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  autoLoadEntities: true,
  logging: configService.get<boolean>('DB_LOGGING', false),
  timezone: 'Z',
});

export const databaseConfig = {
  type: 'mysql',
  host: process.env.DB_HOST || 'mysql',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_db',
  entities: ['src/**/*.orm-entity.ts'],   // ← same convention as ormconfig.ts
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  autoLoadEntities: true,
  logging: process.env.DB_LOGGING === 'true',
};
