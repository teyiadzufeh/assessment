import { Controller, Get, Query, Post, Body, Delete, Param, Put, Req } from '@nestjs/common';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { Request } from 'express';

@Controller('auth')
export class FirebaseAuthController {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  @Post('create')
  async createUser(@Req() req:Request) {
    return this.firebaseAuthService.createUser(req.body.email, req.body.password);
  }

  @Post('login')
  async login(@Req() req:Request) {
    return this.firebaseAuthService.login(req.body.email, req.body.password);
  }

  @Post('verify-token')
  async verifyToken(@Body('idToken') idToken: string) {
    return this.firebaseAuthService.verifyIdToken(idToken);
  }

  @Get('user/:uid')
  async getUser(@Param('uid') uid: string) {
    return this.firebaseAuthService.getUser(uid);
  }

  @Put('verify-email')
  async verifyEmail() {
    let uid = 'qlKPDCCN58RUnTuMY7zoXvpq5YD3';
    return this.firebaseAuthService.verifyEmail(uid);
  }
}