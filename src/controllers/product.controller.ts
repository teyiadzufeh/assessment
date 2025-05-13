import { Controller, HttpException, Post, Req} from '@nestjs/common';
import { ProductRequest, ProductType } from 'src/db/product.schema';
import { ProductService } from 'src/services/product.service';
import { Request } from 'express';

@Controller('api/v1/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @Post('create')
    async createProduct(@Req() req: Request): Promise<ProductType> {
        try {
        const request: ProductRequest = req.body;
        const response = await this.productService.createProduct(request);
        return response;
        } catch (error) {
        throw new HttpException({
            status: error.status ?? 500,
            message: error.message,
            error: 'Error creating product'
        }, error.status ?? 500, {
            cause: error,
            description: error.message ?? 'Something went wrong'
        });
        }
    }
}
