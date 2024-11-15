import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entity/products';
import { Repository } from 'typeorm';
import { ProductDTO } from './dto/create.product.dto';
import { ProductSizes } from '../entity/productSizes';
import {
  ModifyProductByAdminInputDto,
  ModifyProductByAdminOutputDto,
} from './dto/modify.product.by.admin';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products) public productRepo: Repository<Products>,
    @InjectRepository(ProductSizes)
    public productSizesRepo: Repository<ProductSizes>,
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

  async createProduct(productDto: ProductDTO) {
    // 1. Tạo Product từ productDto
    const newProduct = this.productRepo.create({
      ProductName: productDto.ProductName,
      Description: productDto.Description,
      ImageURL: productDto.ImageURL,
    });

    // 2. Lưu Product vào cơ sở dữ liệu
    await this.productRepo.save(newProduct);

    // 3. Tạo ProductSize từ ProductSizes DTO
    const productSizes = productDto.ProductSizes.map((sizeDto) => {
      const productSize = this.productSizesRepo.create({
        ProductID: newProduct, // Liên kết với sản phẩm mới
        Size: sizeDto.Size,
        Price: sizeDto.Price,
      });

      return productSize;
    });

    // 4. Lưu các ProductSize vào cơ sở dữ liệu
    await this.productSizesRepo.save(productSizes);

    // 5. Trả về thông tin sản phẩm cùng với các kích thước
    return {
      ProductID: newProduct.ProductID,
      ProductName: newProduct.ProductName,
      Description: newProduct.Description,
      ImageURL: newProduct.ImageURL,
      ProductSizes: productSizes.map((size) => ({
        ProductSizeID: size.ProductSizeID,
        Size: size.Size,
        Price: size.Price,
      })),
    };
  }

  async modifyProductByAdmin(
    productDto: ModifyProductByAdminInputDto,
  ): Promise<ModifyProductByAdminOutputDto> {
    // Tìm sản phẩm theo ID
    const product = await this.productRepo.findOne({
      where: { ProductID: productDto.productID },
      relations: ['ProductSizes'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Cập nhật thông tin sản phẩm
    if (productDto.productName) {
      product.ProductName = productDto.productName;
    }
    if (productDto.description) {
      product.Description = productDto.description;
    }
    if (productDto.imageURL) {
      product.ImageURL = productDto.imageURL;
    }
    if (productDto.isActive !== undefined) {
      product.IsActive = productDto.isActive;
    }

    // Cập nhật giá cho từng kích thước nếu có
    if (productDto.priceSmall !== undefined) {
      const smallSize = product.ProductSizes.find(
        (size) => size.Size === 'Small',
      );
      if (smallSize) {
        smallSize.Price = productDto.priceSmall;
      }
    }

    if (productDto.priceMedium !== undefined) {
      const mediumSize = product.ProductSizes.find(
        (size) => size.Size === 'Medium',
      );
      if (mediumSize) {
        mediumSize.Price = productDto.priceMedium;
      }
    }

    if (productDto.priceLarge !== undefined) {
      const largeSize = product.ProductSizes.find(
        (size) => size.Size === 'Large',
      );
      if (largeSize) {
        largeSize.Price = productDto.priceLarge;
      }
    }

    // Lưu lại sản phẩm sau khi chỉnh sửa
    await this.productRepo.save(product);

    return this.mapProductToDto(product);
  }

  // Phương thức map dữ liệu từ entity sang DTO
  private mapProductToDto(product: Products): ModifyProductByAdminOutputDto {
    return {
      productID: product.ProductID,
      productName: product.ProductName,
      description: product.Description,
      imageURL: product.ImageURL,
      isActive: product.IsActive,
      productSizes: product.ProductSizes.map((size) => ({
        productSizeID: size.ProductSizeID,
        size: size.Size,
        price: size.Price,
      })),
    };
  }
}
