import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { GoogleDriveService } from './google-drive.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ApiController],
  providers: [ApiService, GoogleDriveService],
  imports: [TypeOrmModule.forFeature([ImageEntity]), HttpModule],
})
export class ApiModule {}
