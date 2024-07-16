import { Controller, Get, HttpException, Param, Post, Put, Req} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { LoginRequest, UpdateUserType, UserRequest, UserType } from 'src/db/user.schema';
import { UserService } from 'src/services/user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Req() req: Request ): Promise<UserType> {
    try {
      const request:UserRequest = req.body;
      const response = await this.userService.createUser(request);
      return response;
    } catch (error) {
      throw new HttpException({
        status: error.status || 500,
        message: error.message,
        error: 'Error creating user'
      }, error.status || 500, {
        cause: error,
        description: error.message || 'Something went wrong'
      });
    }
  }

  @Post('login')
  async loginUser(@Req() req:Request) {
    try {
      const request:LoginRequest = req.body;
      const response = await this.userService.login(request);
      return response;
    } catch (error) {
      throw new HttpException({
        status: error.status || 500,
        message: error.message,
        error: 'Error logging in'
      }, error.status || 500, {
        cause: error,
        description: error.message || 'Something went wrong'
      });
    }
  }

  @Get('all')
  async getAllUsers(@Param() params) : Promise<UserType[]> {
    try {
      return await this.userService.getAllUsers(params);
    } catch (error) {
      throw new HttpException({
        status: error.status || 400,
        message: error.message,
        error: 'Error fetching users'
      }, error.status || 500, {
        cause: error,
        description: error.message || 'Something went wrong'
      });
    }
  }

  @Get(':id')
  async getUser(@Param('id') id:number) : Promise<UserType> {
    try {
      return await this.userService.getUser(Number(id)); 
    } catch (error) {
      throw new HttpException({
        status: error.status || 400,
        message: error.message,
        error: 'Error fetching user'
      }, error.status || 500, {
        cause: error,
        description: error.message || 'Something went wrong'
      });
    }
  }

  @Put('update/:id')
  async updateUser(@Req() req:Request, @Param('id') id:number) : Promise<UserType> {
    try{
      const request:UpdateUserType = req.body;
      const response = await this.userService.updateUser(request, Number(id), req['user']);
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException({
        status: error.status || 400,
        message: error.message,
        error: 'Error updating user'
      }, error.status || 500, {
        cause: error,
        description: error.message || 'Something went wrong'
      });
    }
  }
}
