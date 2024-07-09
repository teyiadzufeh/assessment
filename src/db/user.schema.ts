import { Decimal } from "@prisma/client/runtime/library"
import { z } from 'zod';

export const LoginSchema = z.object({
    password: z.string().min(8),
    email: z.string().email(),
})

export const UpdateUserSchema = z.object({
    num_of_users: z.number(),
    num_of_products: z.number()
})


export const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    num_of_users: z.number(),
    num_of_products: z.number(),
    company_name: z.string()
})
    .superRefine(({ password }, checkPassComplexity) => {
        const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
        const containsLowercase = (ch: string) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch: string) =>
            /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;
        for (let i = 0; i < password.length; i++) {
            let ch = password.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }
        if (
            countOfLowerCase < 1 ||
            countOfUpperCase < 1 ||
            countOfSpecialChar < 1 ||
            countOfNumbers < 1
        ) {
            checkPassComplexity.addIssue({
                code: "custom",
                message: "password does not meet complexity requirements",
            });
        }
    });

export type UserRequest = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;

export type UserType = {
    id?: number,
    uuid?: string,
    email?: string,
    email_verified?: boolean,
    status?: string,
    password?: string,
    user_type?: string,
    company_name?: string,
    num_of_users?: number,
    num_of_products?: number,
    percentage?: Decimal,
    image?: string | null,
    refresh_token?: string | null,
    createdAt?: Date,
    updatedAt?: Date
}

export type UpdateUserType = {
    num_of_users?: number,
    num_of_products?: number
}