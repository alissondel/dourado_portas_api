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

// IMPORT USERS
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    public citiesRepository: Repository<City>,
    private usersInject: UsersService,
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

  async create(data: CreateCityInput): Promise<City> {
    const { name, createdAt, ...rest } = data; //eslint-disable-line

    const checkedName = await this.verifyDuplicityName(name.trim());

    if (checkedName) {
      throw new NotFoundError("Nome já existente na base de dados!");
    }

    const createdCity = {
      ...rest,
      name: name.trim(),
      createdAt: new Date(),
    };

    const city = await this.citiesRepository.create(createdCity);
    return this.citiesRepository.save(city);
  }

  async update(id: number, data: UpdateCityInput): Promise<City> {
    const { name, updatedAt, ...rest } = data; //eslint-disable-line

    const city = await this.citiesRepository.findOne({ where: { id } });
    const checkedName = await this.verifyDuplicityName(name.trim());

    if (!city) {
      throw new NotFoundError("Cidade não existe!");
    }

    if (name == checkedName) {
      throw new NotFoundError("Nome já existente na base de dados!");
    }

    const updatedCity = {
      ...rest,
      name: name.trim(),
      updatedAt: new Date(),
    };

    return this.citiesRepository.save({ ...city, ...updatedCity });
  }

  async delete(id: number): Promise<City> {
    const user = await this.verifyIfCityHasRelationWithUser(id);
    const cityId = await this.citiesRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!cityId) {
      throw new NotFoundError("Cidade não existe!");
    }

    if (user) {
      throw new NotFoundError("Não pode remover cidade, pois está vinculado ao usuário!");
    }

    return this.citiesRepository.save({ ...cityId, ...data });
  }

  async verifyDuplicityName(name: string): Promise<any> {
    const checkedName = await this.citiesRepository.findOne({
      where: {
        name,
      },
    });
    return checkedName;
  }

  async verifyIfCityHasRelationWithUser(id: number): Promise<User> {
    const user = await this.usersInject.usersRepository.findOne({
      where: { city_id: Number(id) },
    });
    return user;
  }
}
