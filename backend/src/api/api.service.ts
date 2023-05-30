import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { GoogleDriveService } from './google-drive.service';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios/';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageEntityRepository: Repository<ImageEntity>,
    private readonly googleDriveService: GoogleDriveService,
    private readonly httpService: HttpService,
  ) {}

  async getLink(id: string): Promise<any> {
    const image: ImageEntity = await this.imageEntityRepository.findOne({
      where: { id },
    });
    return image.link;
  }

  async generateImages(images: Array<Express.Multer.File>): Promise<any> {
    const swappedImages = await this.sendImagesForSwap(images);
    // const response = [{}];
    // const formData = new FormData();
    // for (const image of swappedImages) {
    //   const imageContent = Readable.from(image.data);
    //   const imageName = Math.floor(100000 + Math.random() * 900000).toString();
    //   const imageEntity: ImageEntity = await this.imageEntityRepository.create({
    //     description: '',
    //     name: imageName,
    //   });
    //   this.googleDriveService
    //     .uploadImageToDrive(imageContent, imageName, image.header)
    //     .then((resp) => {
    //       imageEntity.link = resp.link;
    //       imageEntity.googleDriveId = resp.id;
    //       this.imageEntityRepository.save(imageEntity);
    //     });
    //   await this.imageEntityRepository.save(imageEntity);
    //   formData.append('files', imageContent, {
    //     filename: imageName,
    //     contentType: image.header,
    //   });
    //   response.push({
    //     id: imageEntity.id,
    //     image: imageContent,
    //   });
    // }
    // return response;
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
        responseType: 'arraybuffer',
      };
      const response = await lastValueFrom(
        this.httpService
          .post('http://python:4000/uploadfiles', formData, requestConfig)
          .pipe(
            map((res) => {
              console.log(res.data);
              // return [{ data: res.data, headers: res.headers['content-type'] }];
            }),
          ),
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
