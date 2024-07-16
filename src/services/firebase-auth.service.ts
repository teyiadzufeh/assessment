import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {Auth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable()
export class FirebaseAuthService {
  private auth: admin.auth.Auth;
  private clientAuth: Auth;

  constructor(
    @Inject('FIREBASE_ADMIN_APP') private firebaseApp: admin.app.App,
    @Inject('FIREBASE_CLIENT_APP') private firebaseClientAuth: Auth,
) {
    this.auth = firebaseApp.auth();
    this.clientAuth = firebaseClientAuth;
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.auth.verifyIdToken(idToken);
  }

  async getUser(email?: string, uid?: string): Promise<admin.auth.UserRecord> {
    let newUser = await this.auth.getUserByEmail(email)
    return newUser;
  }

  async createUser(email: string, password: string): Promise<admin.auth.UserRecord> {
    return this.auth.createUser({ email, password });
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.clientAuth, email, password)
    return userCredential.user
  }

  async deleteUser(uid: string): Promise<void> {
    return this.auth.deleteUser(uid);
  }

  async verifyEmail(uid: string) : Promise<admin.auth.UserRecord> {
    return this.auth.updateUser(uid, {
        emailVerified: true
    })
  }
}