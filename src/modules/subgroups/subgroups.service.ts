import { Injectable } from "@nestjs/common";
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

@Injectable()
export class SubgroupsService {
  constructor(
    @InjectRepository(Subgroup)
    public subgroupsRepository: Repository<Subgroup>,
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
    const { createdAt, ...rest } = data; //eslint-disable-line

    const createdSubgroup = {
      ...rest,
      createdAt: new Date(),
    };

    const brand = await this.subgroupsRepository.create(createdSubgroup);
    return this.subgroupsRepository.save(brand);
  }

  async update(id: number, data: UpdateSubgroupInput): Promise<Subgroup> {
    const { updatedAt, ...rest } = data; //eslint-disable-line

    const subgroup = await this.subgroupsRepository.findOne({ where: { id } });

    if (!subgroup) {
      throw new NotFoundError("Marca não existe!");
    }

    const updatedSubgroup = {
      ...rest,
      updatedAt: new Date(),
    };

    return this.subgroupsRepository.save({ ...subgroup, ...updatedSubgroup });
  }

  async delete(id: number): Promise<Subgroup> {
    const subgroupId = await this.subgroupsRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!subgroupId) {
      throw new NotFoundError("Cidade não existe!");
    }

    return this.subgroupsRepository.save({ ...subgroupId, ...data });
  }
}
