import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { validationMiddleware } from 'src/middleware/middleware';
import { LoginSchema, UpdateUserSchema, UserSchema } from 'src/db/user.schema';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validationMiddleware(UserSchema, 'body'))
      .forRoutes({ path: 'user/create', method: RequestMethod.POST});
    
    consumer
      .apply(validationMiddleware(LoginSchema, 'body'))
      .forRoutes({ path: 'user/login', method: RequestMethod.POST});

    consumer
    .apply(validationMiddleware(UpdateUserSchema, 'body'))
    .forRoutes({ path: 'user/update/:id', method: RequestMethod.PUT});
  }
}
