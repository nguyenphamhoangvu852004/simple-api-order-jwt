import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entity/products';
import { Repository } from 'typeorm';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products) public productRepo: Repository<Products>,
  ) {}

  // Phương thức lấy danh sách sản phẩm cơ bản
  async getAllProductsList(): Promise<ProductDTO[]> {
    const products = await this.productRepo.find({
      relations: ['ProductSizes'], // Liên kết với ProductSizes để lấy thông tin chi tiết
    });

    return products.map((product) => ({
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      Description: product.Description,
      ImageURL: product.ImageURL,
      ProductSizes: product.ProductSizes.map((size) => ({
        ProductSizeID: size.ProductSizeID,
        Size: size.Size,
        Price: size.Price,
      })),
    }));
  }
}
