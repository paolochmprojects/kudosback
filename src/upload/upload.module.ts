import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [AuthModule],
})
export class UploadModule {}
