import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
