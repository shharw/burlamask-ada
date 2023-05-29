import { DataSource, DataSourceOptions } from 'typeorm';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'burlamask',
  logging: true,
  ssl: false,
  entities: [__dirname + '/../api/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../migrations/*{.js,.ts}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};

export default new DataSource(typeOrmConfig);
