import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, ILike } from "typeorm";

// IMPORT BRANDS
import { Brand } from "./entities/brand.entity";
import { FilterBrandInput } from "./dto/filter-brand.input";
import { CreateBrandInput } from "./dto/create-brand.input";
import { UpdateBrandInput } from "./dto/update-brand.input";

// IMPORT PAGINATE
import { PageInfo } from "../paginations/entities/pagination.entity";
import { PaginationArgs } from "../filters/PaginationArgs";
import Paginate from "../../utils/Paginate";

// IMPORT ERROR
import { NotFoundError } from "src/common/errors/types/NotFoundError";

// IMPORT PRODUCTS
import { Product } from "../products/entities/product.entity";
import { ProductsService } from "../products/products.service";

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    @Inject(forwardRef(() => ProductsService))
    public brandsRepository: Repository<Brand>,
    private productsRepository: ProductsService,
  ) {}

  async findOne(id: number): Promise<Brand> {
    const brandId = await this.brandsRepository.findOne({ where: { id } });

    if (!brandId) {
      throw new NotFoundError("Marca não existe!");
    }

    return brandId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterBrandInput): Promise<any> {
    const [items, count]: any = await this.brandsRepository.findAndCount({
      skip: perPage * (currentPage - 1),
      take: perPage,
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.description && { description: ILike(`%${filters.description}%`) }),
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

  async create(data: CreateBrandInput): Promise<Brand> {
    const { description, createdAt, ...rest } = data; //eslint-disable-line

    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const createdBrand = {
      ...rest,
      description: description.trim(),
      createdAt: new Date(),
    };

    const brand = await this.brandsRepository.create(createdBrand);
    return this.brandsRepository.save(brand);
  }

  async update(id: number, data: UpdateBrandInput): Promise<Brand> {
    const { description, updatedAt, ...rest } = data; //eslint-disable-line

    const brand = await this.brandsRepository.findOne({ where: { id } });
    const checkedDescription = await this.verifyDuplicityDescription(description);

    if (!brand) {
      throw new NotFoundError("Marca não existe!");
    }

    if (description == checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const updatedBrand = {
      ...rest,
      description: description.trim(),
      updatedAt: new Date(),
    };

    return this.brandsRepository.save({ ...brand, ...updatedBrand });
  }

  async delete(id: number): Promise<Brand> {
    const brandId = await this.brandsRepository.findOne({ where: { id } });
    const productId = await this.verifyIfProductHasRelationWithBrand(id);
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!brandId) {
      throw new NotFoundError("Marca não existe!");
    }

    if (productId) {
      throw new NotFoundError("Não pode remover marca, pois está vinculado a um produto!");
    }

    return this.brandsRepository.save({ ...brandId, ...data });
  }

  async verifyDuplicityDescription(description: string): Promise<any> {
    const checkedDescription = await this.brandsRepository.findOne({
      where: {
        description,
      },
    });

    return checkedDescription;
  }

  async verifyIfProductHasRelationWithBrand(id: number): Promise<Product> {
    const product = await this.productsRepository.productsRepository.findOne({
      where: {
        brand_id: Number(id),
        active: true,
      },
    });

    return product;
  }
}
