import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private readonly drive;
  private readonly folderId;

  constructor() {
    this.drive = google.drive({
      version: 'v3',
      auth: new google.auth.GoogleAuth({
        keyFile: __dirname + process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      }),
    });
    this.folderId = process.env.GOOGLE_FOLDER_ID;
  }

  async uploadImageToDrive(
    photo: Readable,
    photoName: string,
    mimetype: string,
  ): Promise<string> {
    const media = {
      mimeType: mimetype,
      body: photo,
    };
    const res = await this.drive.files.create({
      requestBody: {
        name: photoName,
        parents: [this.folderId],
      },
      media: media,
    });
    return await this.getFileLink(res.data.id);
  }

  async getFileLink(fileId: string) {
    const response = await this.drive.files.get({
      fileId,
      fields: 'webViewLink',
    });
    return response.data.webViewLink;
  }
}
