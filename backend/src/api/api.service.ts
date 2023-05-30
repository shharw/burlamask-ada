import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { GoogleDriveService } from './google-drive.service';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios/';
import * as FormData from 'form-data';
import { Readable } from 'stream';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
    private readonly googleDriveService: GoogleDriveService,
    private readonly httpService: HttpService,
  ) {}
  async generateImages(images: Array<Express.Multer.File>) {
    // const swappedImages = await this.sendImagesForSwap(images);
    const response = [];
    for (const image of images) {
      const imageContent = Readable.from(image.buffer);
      const imageLink = await this.googleDriveService.uploadImageToDrive(
        imageContent,
        image.originalname,
      );
      const imageEntity: ImageEntity = await this.imageEntityRepository.create({
        description: '',
        name: image.originalname,
        link: imageLink,
      });
      await this.imageEntityRepository.save(imageEntity);
      response.push({ id: imageEntity.id, photo: image });
    }
    return response;
  }

  async sendImagesForSwap(images: Express.Multer.File[]): Promise<any> {
    const formData = new FormData();
    for (const image of images) {
      formData.append('image', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });
    }
    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      this.httpService
        .post('https://localhost:8000/uploadfiles', formData, requestConfig)
        .subscribe((response) => console.log(response.data));
    } catch (error) {
      throw error;
    }
  }
}
