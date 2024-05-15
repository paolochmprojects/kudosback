import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadUsersCSV(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');

    if (file.mimetype !== 'text/csv')
      throw new BadRequestException('Invalid file type');

    return {};
  }
}
