import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like, ILike } from "typeorm";

// IMPORT CITIES
import { City } from "./entities/city.entity";
import { FilterCityInput } from "./dto/filter-city.input";
import { CreateCityInput } from "./dto/create-city.input";
import { UpdateCityInput } from "./dto/update-city.input";

// IMPORT PAGINATE
import { PageInfo } from "../paginations/entities/pagination.entity";
import { PaginationArgs } from "../filters/PaginationArgs";
import Paginate from "../../utils/Paginate";

// IMPORT ERROR
import { NotFoundError } from "src/common/errors/types/NotFoundError";

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    public citiesRepository: Repository<City>,
  ) {}

  async findOne(id: number): Promise<City> {
    const cityId = await this.citiesRepository.findOne({ where: { id } });

    if (!cityId) {
      throw new NotFoundError("Cidade não existe!");
    }

    return cityId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterCityInput): Promise<any> {
    const [items, count]: any = await this.citiesRepository.findAndCount({
      skip: perPage * (currentPage - 1),
      take: perPage,
      relations: {
        state: true,
      },
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.name && { name: Like(`%${filters.name}%`) }),
        ...(filters.state && {
          state: { name: ILike(`%${filters.state}%`) },
        }),
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

  async create(data: CreateCityInput) {
    const { createdAt, ...rest } = data; //eslint-disable-line

    const createdCity = {
      ...rest,
      createdAt: new Date(),
    };

    const city = await this.citiesRepository.create(createdCity);
    return this.citiesRepository.save(city);
  }

  async update(id: number, data: UpdateCityInput): Promise<City> {
    const { updatedAt, ...rest } = data; //eslint-disable-line

    const city = await this.citiesRepository.findOne({ where: { id } });

    if (!city) {
      throw new NotFoundError("Cidade não existe!");
    }

    const updatedState = {
      ...rest,
      updatedAt: new Date(),
    };

    return this.citiesRepository.save({ ...city, ...updatedState });
  }

  async delete(id: number): Promise<City> {
    const cityId = await this.citiesRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!cityId) {
      throw new NotFoundError("Cidade não existe!");
    }

    return this.citiesRepository.save({ ...cityId, ...data });
  }
}
