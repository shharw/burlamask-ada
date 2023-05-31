import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { GoogleDriveService } from './google-drive.service';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios/';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { map, tap } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
    private readonly googleDriveService: GoogleDriveService,
    private readonly httpService: HttpService,
  ) {}
  async generateImages(images: Array<Express.Multer.File>) {
    const swappedImages = await this.sendImagesForSwap(images);
    const response = [];
    swappedImages.forEach((val) => console.log(val));
    // const imageContent = Readable.from(swappedImages.data);
    // const imageLink = await this.googleDriveService.uploadImageToDrive(
    //   imageContent,
    //   images[0].originalname,
    //   images[0].mimetype,
    // );
    // response.push(imageLink);
    //
    // for (const image of swappedImages) {
    //   const imageContent = Readable.from(image.buffer);
    //   const imageLingitk = await this.googleDriveService.uploadImageToDrive(
    //     imageContent,
    //     image.originalname,
    //     image.mimetype,
    //   );
    //   const imageEntity: ImageEntity = await this.imageEntityRepository.create({
    //     description: '',
    //     name: image.originalname,
    //     link: imageLink,
    //   });
    //   await this.imageEntityRepository.save(imageEntity);
    //   response.push({ id: imageEntity.id, photo: image });
    // }
    return response;
  }

  async sendImagesForSwap(images: Express.Multer.File[]): Promise<any> {
    const formData = new FormData();
    for (const image of images) {
      formData.append('files', image.buffer, {
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
      const response = await this.httpService
        .post('http://python:4000/uploadfiles', formData, requestConfig)
        .pipe(
          tap((resp) => console.log(resp)),
          map((resp) => resp.data),
          tap((data) => {
            return data;
          }),
        );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
