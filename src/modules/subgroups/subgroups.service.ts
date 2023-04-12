import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, ILike } from "typeorm";

// IMPORT SUBGROUP
import { Subgroup } from "./entities/subgroup.entity";
import { FilterSubgroupInput } from "./dto/filter-subgroup.input";
import { CreateSubgroupInput } from "./dto/create-subgroup.input";
import { UpdateSubgroupInput } from "./dto/update-subgroup.input";

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
export class SubgroupsService {
  constructor(
    @InjectRepository(Subgroup)
    @Inject(forwardRef(() => ProductsService))
    public subgroupsRepository: Repository<Subgroup>,
    private productsRepository: ProductsService,
  ) {}

  async findOne(id: number): Promise<Subgroup> {
    const subgroupId = await this.subgroupsRepository.findOne({ where: { id } });

    if (!subgroupId) {
      throw new NotFoundError("Sub Grupo não existe!");
    }

    return subgroupId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterSubgroupInput): Promise<any> {
    const [items, count]: any = await this.subgroupsRepository.findAndCount({
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

  async create(data: CreateSubgroupInput): Promise<Subgroup> {
    const { description, createdAt, ...rest } = data; //eslint-disable-line

    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const createdSubgroup = {
      ...rest,
      description: description.trim(),
      createdAt: new Date(),
    };

    const subgroup = await this.subgroupsRepository.create(createdSubgroup);
    return this.subgroupsRepository.save(subgroup);
  }

  async update(id: number, data: UpdateSubgroupInput): Promise<Subgroup> {
    const { description, updatedAt, ...rest } = data; //eslint-disable-line

    const subgroup = await this.subgroupsRepository.findOne({ where: { id } });
    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (!subgroup) {
      throw new NotFoundError("Sub Grupo não existe!");
    }

    if (description == checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const updatedSubgroup = {
      ...rest,
      description: description.trim(),
      updatedAt: new Date(),
    };

    return this.subgroupsRepository.save({ ...subgroup, ...updatedSubgroup });
  }

  async delete(id: number): Promise<Subgroup> {
    const subgroupId = await this.subgroupsRepository.findOne({ where: { id } });
    const productId = await this.verifyIfProductHasRelationWithsubgroup(id);
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!subgroupId) {
      throw new NotFoundError("Sub grupo não existe!");
    }

    if (productId) {
      throw new NotFoundError("Não pode remover subgroup, pois está vinculado a um produto");
    }

    return this.subgroupsRepository.save({ ...subgroupId, ...data });
  }

  async verifyDuplicityDescription(description: string): Promise<any> {
    const checkedDescription = await this.subgroupsRepository.findOne({
      where: {
        description,
      },
    });
    return checkedDescription;
  }

  async verifyIfProductHasRelationWithsubgroup(id: number): Promise<Product> {
    const product = await this.productsRepository.productsRepository.findOne({
      where: {
        subgroup_id: Number(id),
        active: true,
      },
    });

    return product;
  }
}
