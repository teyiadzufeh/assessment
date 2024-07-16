import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { authMiddleware, validationMiddleware } from 'src/middleware/middleware';
import { LoginSchema, UpdateUserSchema, UserSchema } from 'src/db/user.schema';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), FirebaseModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validationMiddleware(UserSchema, 'body'))
      .forRoutes({ path: 'api/v1/user/create', method: RequestMethod.POST});
    
    consumer
      .apply(validationMiddleware(LoginSchema, 'body'))
      .forRoutes({ path: 'api/v1/user/login', method: RequestMethod.POST});

    consumer
    .apply(authMiddleware, validationMiddleware(UpdateUserSchema, 'body'))
    .forRoutes({ path: 'api/v1/user/update/:id', method: RequestMethod.PUT});

    consumer
    .apply(authMiddleware)
    .forRoutes({ path: 'api/v1/user/*', method: RequestMethod.GET});
  }
}
