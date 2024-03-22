import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { IResponse } from './interfaces/response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File):
    | {
        MRR: IResponse[];
        Churn: IResponse[];
      }
    | string {
    if (!file) {
      return 'A file is needed';
    }
    const lines = file.buffer.toString().split('\r\n');
    const response = this.appService.getMetrics(lines);
    return response;
  }
}
