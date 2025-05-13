import { HttpException, Injectable } from "@nestjs/common";
import { prisma } from "src/db/prisma";
import { ProductRequest, ProductType } from "src/db/product.schema";
import { v4 as uuidv4} from "uuid";

@Injectable()
export class ProductService {
    async createProduct(params: ProductRequest): Promise<ProductType> {
        const { name, description, price, image_url } = params;

        // Check if product already exists
        const productExists = await prisma.product.findFirst({
            where: {
                name,
            },
        });

        if (productExists) throw new HttpException('Product already exists with this name', 400);

        // Create new product
        const newProduct = await prisma.product.create({
            data: {
                uuid: uuidv4(),
                name,
                description,
                price: Number(price),
                image: image_url,
            },
        });

        return newProduct;
    }
}