import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entity/products';
import { Repository } from 'typeorm';
import { ProductDTO } from './dto/create.product.dto';
import { ProductSizes } from '../entity/productSizes';
import { ModifyProductByAdminInputDto } from './dto/modify.product.by.admin';

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

  async updateProduct(
    productID: number,
    updateProductDto: ModifyProductByAdminInputDto,
  ): Promise<Products> {
    const {
      productName,
      description,
      imageURL,
      isActive,
      priceSmall,
      priceMedium,
      priceLarge,
    } = updateProductDto;

    // Tìm sản phẩm theo ID
    const product = await this.productRepo.findOne({
      where: { ProductID: productID },
      select: ['ProductID'],
      // relations: ['ProductSizes'], // Tải kèm ProductSizes
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Cập nhật thông tin cơ bản của sản phẩm
    product.ProductName = productName || product.ProductName;
    product.Description = description || product.Description;
    product.ImageURL = imageURL || product.ImageURL;
    product.IsActive = isActive !== undefined ? isActive : product.IsActive;

    await this.productRepo.save(product);

    // Cập nhật giá theo kích thước
    const sizePriceMap = [
      { size: 'Small', price: priceSmall },
      { size: 'Medium', price: priceMedium },
      { size: 'Large', price: priceLarge },
    ];

    for (const { size, price } of sizePriceMap) {
      if (price !== undefined) {
        let productSize = await this.productSizesRepo.findOne({
          where: {
            // @ts-ignore
            ProductID: product.ProductID, // Dùng đúng khóa chính
            Size: size as 'Small' | 'Medium' | 'Large', // Xác định loại rõ ràng
          },
        });

        // Nếu chưa tồn tại ProductSize, tạo mới
        if (!productSize) {
          productSize = new ProductSizes();
          productSize.ProductID = product;
          productSize.Size = size as 'Small' | 'Medium' | 'Large';
        }

        // Cập nhật giá
        productSize.Price = price;

        await this.productSizesRepo.save(productSize);
      }
    }

    return product;
  }

  async getProductById(id: string): Promise<{
    Description: string;
    ProductName: string;
    ProductSizes: {
      ProductSizeID: number;
      Price: number;
      Size: 'Small' | 'Medium' | 'Large';
    }[];
    ImageURL: string;
    ProductID: number;
  }> {
    const product = await this.productRepo.findOne({
      where: { ProductID: parseInt(id, 10) },
      relations: ['ProductSizes'], // Lấy liên kết với bảng ProductSizes
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Chuyển đổi từ entity sang DTO
    return {
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      Description: product.Description,
      ImageURL: product.ImageURL,
      ProductSizes: product.ProductSizes.map((size) => ({
        ProductSizeID: size.ProductSizeID,
        Size: size.Size,
        Price: size.Price,
      })),
    };
  }

  // Phương thức xóa sản phẩm theo id
  async deleteProductByAdmin(id: number): Promise<string> {
    const product = await this.productRepo.findOne({
      where: { ProductID: id },
    });

    if (!product) {
      throw new Error('Sản phẩm không tồn tại!');
    }

    // Xóa sản phẩm (và các liên kết nếu có do Cascade)
    await this.productRepo.remove(product);
    return `Sản phẩm với id ${id} đã được xóa`;
  }
}
