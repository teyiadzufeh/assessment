import { z } from 'zod';

export const ProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().min(0),
    image_url: z.string().url().optional(),
});

export type ProductRequest = z.infer<typeof ProductSchema>;

export type ProductType = {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    created_at?: Date;
    updated_at?: Date;
};