import {
  Controller,
  Get,
  Param,
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
  @UseInterceptors(FilesInterceptor('files'))
  generateImages(
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<any> {
    return this.apiService.generateImages(images);
  }

  @ApiOperation({ summary: 'Get image link' })
  @ApiResponse({ status: 200, type: String })
  @Get('image-link/:id')
  getLink(@Param('id') id: string): Promise<any> {
    return this.apiService.getLink(id);
  }
}
