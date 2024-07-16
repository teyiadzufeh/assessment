import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { FirebaseAuthController } from '../controllers/firebase.controller';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      type: configService.get<string>('FIREBASE_TYPE'),
      project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
      private_key_id: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      private_key: configService.get<string>('FIREBASE_PRIVATE_KEY'),
      client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      client_id: configService.get<string>('FIREBASE_CLIENT_ID'),
      auth_uri: configService.get<string>('FIREBASE_AUTH_URI'),
      token_uri: configService.get<string>('FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url: configService.get<string>('FIREBASE_AUTH_CERT_URL'),
      client_x509_cert_url: configService.get<string>('FIREBASE_CLIENT_CERT_URL'),
      universe_domain: configService.get<string>('FIREBASE_UNIVERSAL_DOMAIN'),
    } as admin.ServiceAccount;

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
    });
  },
};

const firebaseClientProvider = {
  provide: 'FIREBASE_CLIENT_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseClientConfig = {
      apiKey: configService.get<string>('FIREBASE_API_KEY'),
      authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
      appId: configService.get<string>('FIREBASE_APP_ID'),
      measurementId: configService.get<string>('FIREBASE_MEASUREMENT_ID')
    };
    const app = initializeClientApp(firebaseClientConfig);
    return getAuth(app);
  }
}


@Module({
  imports: [ConfigModule],
  controllers: [FirebaseAuthController],
  providers: [firebaseAdminProvider, firebaseClientProvider, FirebaseAuthService],
  exports: [FirebaseAuthService],
})
export class FirebaseModule {}