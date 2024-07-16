import { HttpException, Injectable } from '@nestjs/common';
import { Prisma} from '@prisma/client';
import { prisma } from 'src/db/prisma';
import { v4 as uuidv4} from "uuid";
import { compare, hash } from 'bcrypt';
import { LoginRequest, UpdateUserType, UserRequest, UserType } from 'src/db/user.schema';
import { FirebaseAuthService } from './firebase-auth.service';
import * as admin from 'firebase-admin';


@Injectable()
export class UserService {
   constructor(private readonly firebaseAuthService: FirebaseAuthService) {}
   async getAllUsers(params: {
       skip?: number;
       take?: number;
       where?: Prisma.UserWhereInput;
       orderBy?: Prisma.UserOrderByWithRelationInput;
     }): Promise<UserType[]> {
       const { skip, take, where, orderBy } = params;
       const allUsers = await prisma.user.findMany({
        omit: {
          password: true
        },
         skip,
         take,
         where,
         orderBy,
       });

       if (!allUsers) throw new HttpException('Error fetching users',500);
       return allUsers;
     }

   async getUser(id: number): Promise<UserType> {
     let foundUser = await prisma.user.findUnique({
      omit: {
        password: true
      },
       where: {
        id
       },
     });

     if (!foundUser) throw new HttpException('User not found', 404);
     return foundUser;
   }

  async createUser(params: UserRequest) : Promise<UserType> {
    let {email, password, num_of_users, num_of_products, company_name} = params
    const userExists = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (userExists) throw new HttpException('User already exists with this email', 400);

    let hashedPassword = await hash(password, 10);
    let percentage = (num_of_products/num_of_users)*100;
    let newUser = await prisma.user.create({
      data: {
        uuid: uuidv4(),      
        email, 
        password: hashedPassword,
        user_type: 'company',
        num_of_users,
        num_of_products,
        percentage,
        company_name
      }
    })
    const firebaseUser = await this.firebaseAuthService.getUser(email);
    if (!firebaseUser) await this.firebaseAuthService.createUser(email, password);

    delete newUser.password;
    return newUser;
  }

  async login(params: LoginRequest): Promise<UserType> {
    let {email, password} = params;
    // check user
    let user = await prisma.user.findUnique({ where: { email } });

    // not email 
    if (!user) {
        throw new HttpException('This email does not exist', 404);
    }
    // user account not active
    if (user.status == "inactive") {
        throw new HttpException('This account is not active', 400);
    }
    // user email not verified
    if (user.email_verified == false) {
      const firebaseUser = await this.firebaseAuthService.getUser(email);
      if (firebaseUser.emailVerified == true) {
        await prisma.user.update({
          where: {
            email
          },
          data: {
            email_verified: true
          }
        })
      } else {
        throw new HttpException('This account is not verified', 400);
      }
    }

    // compare password 
    let validPassword = await compare(password, user.password);

    // when password is not validated
    if (!validPassword) {
        throw new HttpException('Incorrect password', 403);
    }

    delete user.password;

    const loggedInUser = await this.firebaseAuthService.login(email, password);
    let accessToken = await loggedInUser.getIdToken()

    return {
      ...user,
      accessToken
    }; 
  }

  async updateUser(params: UpdateUserType, userId:number, user:admin.auth.DecodedIdToken) : Promise<UserType> {
    const foundUser = await this.getUser(userId);
    if (foundUser.email != user.email) throw new HttpException(`Cannout update another user's details. Please pass the right user's token`,400);
    
    let {num_of_users, num_of_products} = params;
    if (!num_of_users || !num_of_products) throw new HttpException('num_of_users and num_of_products are required',400);
    let updatedUser = await prisma.user.update({
      omit: {
        password: true
      },
      where: {
        id: userId
      },
      data: {
        num_of_users,
        num_of_products,
        percentage: (num_of_products/num_of_users)*100
      }
    })

    return updatedUser;
  }

  async deleteAll() {
    let deletedUsers = await prisma.user.deleteMany({});
    return deletedUsers;
  }

}