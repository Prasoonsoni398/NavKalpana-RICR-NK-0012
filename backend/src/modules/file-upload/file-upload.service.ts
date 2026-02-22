import { Injectable, BadRequestException } from '@nestjs/common';
import { imagekit } from '../../common/config/imageKit.config';
import * as multer from 'multer';

@Injectable()
export class FileUploadService {

  // 🔥 Upload File to ImageKit
  async uploadFile(file: Express.Multer.File): Promise<string> {

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const response = await imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: file.originalname,
      folder: 'assignments',
    });

    return response.url;
  }

  // 🔥 Optional: Delete File from ImageKit
  async deleteFile(fileId: string): Promise<void> {
    await imagekit.deleteFile(fileId);
  }
}