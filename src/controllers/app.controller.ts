import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { NextFunction, Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health(@Res() res: Response) {
    const timestamp = new Date().toUTCString();
    res.status(200).send(`{"status": "OK", "Date": "${timestamp}"}`);
  }
}
