import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import * as multer from 'multer';
import type { Multer } from 'multer';


@ApiTags('File Upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  // 🔥 Upload File
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileUrl = await this.fileUploadService.uploadFile(file);

    return {
      message: 'File uploaded successfully',
      url: fileUrl,
    };
  }

  // 🔥 Optional: Delete File (if you store fileId)
  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    await this.fileUploadService.deleteFile(fileId);

    return {
      message: 'File deleted successfully',
    };
  }
}