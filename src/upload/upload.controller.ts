import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Files')
@ApiSecurity('bearer')
@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
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
  uploadUsersCSV(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File not found');

    if (file.mimetype !== 'text/csv')
      throw new BadRequestException('Invalid file type');

    return {};
  }
}
