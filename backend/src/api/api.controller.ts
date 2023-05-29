import { Controller, Post } from '@nestjs/common';
import { ApiService } from './api.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';


@ApiTags('Api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({ summary: "Generate images with swapped faces" })
  @ApiResponse({ status: 201 })
  @Post()
  generateImages(): Promise<any> {
    return this.apiService.generateImages();
  }
}
