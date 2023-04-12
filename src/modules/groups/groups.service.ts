import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, ILike } from "typeorm";

// IMPORT GROUP
import { Group } from "./entities/group.entity";
import { FilterGroupInput } from "./dto/filter-group.input";
import { CreateGroupInput } from "./dto/create-group.input";
import { UpdateGroupInput } from "./dto/update-group.input";

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
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    @Inject(forwardRef(() => ProductsService))
    public groupsRepository: Repository<Group>,
    private productsRepository: ProductsService,
  ) {}

  async findOne(id: number): Promise<Group> {
    const groupId = await this.groupsRepository.findOne({ where: { id } });

    if (!groupId) {
      throw new NotFoundError("Grupo não existe!");
    }

    return groupId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterGroupInput): Promise<any> {
    const [items, count]: any = await this.groupsRepository.findAndCount({
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

  async create(data: CreateGroupInput): Promise<Group> {
    const { description, createdAt, ...rest } = data; //eslint-disable-line

    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const createdGroup = {
      ...rest,
      description: description.trim(),
      createdAt: new Date(),
    };

    const group = await this.groupsRepository.create(createdGroup);
    return this.groupsRepository.save(group);
  }

  async update(id: number, data: UpdateGroupInput): Promise<Group> {
    const { description, updatedAt, ...rest } = data; //eslint-disable-line

    const group = await this.groupsRepository.findOne({ where: { id } });
    const checkedDescription = await this.verifyDuplicityDescription(description.trim());

    if (!group) {
      throw new NotFoundError("Grupo não existe!");
    }

    if (description == checkedDescription) {
      throw new NotFoundError("Descrição já existente na base de dados!");
    }

    const updatedGroup = {
      ...rest,
      description: description.trim(),
      updatedAt: new Date(),
    };

    return this.groupsRepository.save({ ...group, ...updatedGroup });
  }

  async delete(id: number): Promise<Group> {
    const groupId = await this.groupsRepository.findOne({ where: { id } });
    const productId = await this.verifyIfProductHasRelationWithGroup(id);
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!groupId) {
      throw new NotFoundError("Grupo não existe!");
    }

    if (productId) {
      throw new NotFoundError("Não pode remover grupo, pois está vinculado a um produto!");
    }

    return this.groupsRepository.save({ ...groupId, ...data });
  }

  async verifyDuplicityDescription(description: string): Promise<any> {
    const checkedDescription = await this.groupsRepository.findOne({
      where: {
        description,
      },
    });
    return checkedDescription;
  }

  async verifyIfProductHasRelationWithGroup(id: number): Promise<Product> {
    const product = await this.productsRepository.productsRepository.findOne({
      where: {
        group_id: Number(id),
        active: true,
      },
    });

    return product;
  }
}
