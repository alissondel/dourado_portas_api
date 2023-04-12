import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like, ILike } from "typeorm";

// IMPORT PRODUCTS
import { Product } from "./entities/product.entity";
import { FilterProductInput } from "./dto/filter-product.input";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";

// IMPORT PAGINATE
import { PageInfo } from "../paginations/entities/pagination.entity";
import { PaginationArgs } from "../filters/PaginationArgs";
import Paginate from "../../utils/Paginate";

// IMPORT ERROR
import { NotFoundError } from "src/common/errors/types/NotFoundError";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    public productsRepository: Repository<Product>,
  ) {}

  async findOne(id: number): Promise<Product> {
    const productId = await this.productsRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!productId) {
      throw new NotFoundError("Cidade não existe!");
    }

    return productId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterProductInput): Promise<any> {
    const [items, count]: any = await this.productsRepository.findAndCount({
      skip: perPage * (currentPage - 1),
      take: perPage,
      relations: {
        brand: true,
        subgroup: true,
        group: true,
      },
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.code && { code: ILike(`%${filters.code}%`) }),
        ...(filters.description && { description: ILike(`%${filters.description}%`) }),
        ...(filters.color && { color: ILike(`%${filters.color}%`) }),
        ...(filters.unity && { unity: filters.unity }),
        ...(filters.price && { price: filters.price }),
        ...(filters.height && { height: filters.height }),
        ...(filters.length && { length: filters.length }),
        ...(filters.width && { width: filters.width }),
        ...(filters.thickness && { thickness: filters.thickness }),
        ...(filters.weight && { weight: filters.weight }),
        ...(filters.warranty && { warranty: Like(`%${filters.warranty}%`) }),
        ...(filters.typeWood && { typeWood: Like(`%${filters.typeWood}%`) }),
        ...(filters.frameWidth && { frameWidth: filters.frameWidth }),
        ...(filters.id_brand && { id_brand: filters.id_brand }),
        ...(filters.id_subgroup && { id_subgroup: filters.id_subgroup }),
        ...(filters.id_group && { id_group: filters.id_group }),
        ...(filters.createdAt &&
          filters.updatedAt && {
            createdAt: Between(filters.createdAt, new Date(filters.updatedAt.getTime() + (1000 * 3600 * 24 - 1))),
          }),
        active: filters.active,
      },
      order: {
        [filters.order.key]: filters.order.value,
      },
    });

    const pagination: PageInfo = await Paginate(count, perPage, currentPage);

    return {
      items,
      pagination,
    };
  }

  async create(data: CreateProductInput): Promise<Product> {
    const { description, createdAt, ...rest } = data; //eslint-disable-line

    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const createdProduct = {
      ...rest,
      description: description.trim(),
      createdAt: new Date(),
    };

    const product = await this.productsRepository.create(createdProduct);
    return this.productsRepository.save(product);
  }

  async update(id: number, data: UpdateProductInput): Promise<Product> {
    const { description, updatedAt, ...rest } = data; //eslint-disable-line

    const product = await this.productsRepository.findOne({ where: { id } });
    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (!product) {
      throw new NotFoundError("Cidade não existe!");
    }

    if (description == checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const updatedDescription = {
      ...rest,
      description: description.trim(),
      updatedAt: new Date(),
    };

    return this.productsRepository.save({ ...product, ...updatedDescription });
  }

  async delete(id: number): Promise<Product> {
    const productId = await this.productsRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!productId) {
      throw new NotFoundError("Cidade não existe!");
    }

    return this.productsRepository.save({ ...productId, ...data });
  }

  async verifyDuplicityDescription(description: string): Promise<any> {
    const checkedDescription = await this.productsRepository.findOne({
      where: {
        description,
      },
    });
    return checkedDescription;
  }
}
