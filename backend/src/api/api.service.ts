import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {ImageLinkEntity} from "./entities/imageLink.entity";

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ImageLinkEntity)
    private imageLinkEntityRepository: Repository<ImageLinkEntity>,
  ) {}

  async generateImages(){
    return 0
  }
}
