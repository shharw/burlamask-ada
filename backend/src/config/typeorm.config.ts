import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({ path: `.${process.env.NODE_ENV}.env` });

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: '172.18.0.2',
  port: +5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  logging: true,
  ssl: false,
  entities: [__dirname + '/../api/entities/*.entity{.js,.ts}'],
  migrations: [__dirname + '/../migrations/*{.js,.ts}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
};

export default new DataSource(typeOrmConfig);
