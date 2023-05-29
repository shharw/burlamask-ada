import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiService } from './api.service';

@ApiTags('Api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: 'Generate images with swapped faces' })
  @ApiResponse({ status: 201 })
  @Post('generate')
  @UseInterceptors(FilesInterceptor('photo'))
  generateImages(@UploadedFiles() photos: Array<Express.Multer.File>) {
    return this.apiService.generateImages(photos);
  }
}
