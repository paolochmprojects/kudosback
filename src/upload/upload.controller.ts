import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UploadService } from './upload.service';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guard/role.guard';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('upload')
@Roles('ADMIN')
@UseGuards(AuthGuard, RolesGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadUsers(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');

    if (file.mimetype !== 'text/csv')
      throw new BadRequestException('Invalid file type');

    return await this.uploadService.saveDataFromFile(file);
  }
}
