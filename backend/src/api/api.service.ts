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
import * as fs from 'fs';

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

  async findImagePairs(imageArray): Promise<Express.Multer.File[][]>{
    const pairs: Express.Multer.File[][] = [];
    for (let i = 0; i < imageArray.length; i++) {
      for (let j = i + 1; j < imageArray.length; j++) {
        pairs.push([imageArray[i], imageArray[j]]);
        pairs.push([imageArray[j], imageArray[i]]);
      }
    }
    return pairs;
  }

  async generateImages(images: Array<Express.Multer.File>): Promise<any> {
    const imagePairs = await this.findImagePairs(images);
    const response = [];git
    for (const imagePair of imagePairs) {
      const res = await this.sendImagesForSwap(imagePair);
      const swappedImage = res[0];
      const imageContent = Readable.from(swappedImage.data);
      const imageName = Math.floor(100000 + Math.random() * 900000).toString();
      const imageEntity: ImageEntity = await this.imageEntityRepository.create({
        description: '',
        name: imageName,
      });
      await this.googleDriveService
          .uploadImageToDrive(imageContent, imageName, swappedImage.header)
          .then((resp) => {
            imageEntity.link = resp.link;
            imageEntity.googleDriveId = resp.id;
          });
      await this.imageEntityRepository.save(imageEntity);
      response.push({
        id: imageEntity.id,
        link: `https://drive.google.com/uc?export=view&id=${imageEntity.googleDriveId}`
      });
    }
    console.log(response)
    return response;
  }

  async sendImagesForSwap(images: Array<Express.Multer.File>): Promise<any> {
    const formData = new FormData();
    for (const image of images) {
      formData.append('files', image.buffer, {
        filename: image.originalname,
        contentType: image.mimetype,
      });
    }
    try {
      const requestConfig: AxiosRequestConfig = {
        responseType: 'arraybuffer',
      };
      const response = await lastValueFrom(
        this.httpService
          .post('http://python:4000/uploadfiles', formData, requestConfig)
          .pipe(
            map((res) => {
              return [{ data: res.data, headers: res.headers['content-type'] }];
            }),
          ),
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}