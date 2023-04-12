import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like } from "typeorm";

// IMPORT STATES
import { State } from "./entities/state.entity";
import { FilterStateInput } from "./dto/filter-state.input";
import { CreateStateInput } from "./dto/create-state.input";
import { UpdateStateInput } from "./dto/update-state.input";

// IMPORT PAGINATE
import { PageInfo } from "../paginations/entities/pagination.entity";
import { PaginationArgs } from "../filters/PaginationArgs";
import Paginate from "../../utils/Paginate";

// IMPORT ERROR
import { NotFoundError } from "src/common/errors/types/NotFoundError";

// IMPORT CITY
import { City } from "../cities/entities/city.entity";
import { CitiesService } from "../cities/cities.service";

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(State)
    public statesRepository: Repository<State>,
    private citiesRepository: CitiesService,
  ) {}

  async findOne(id: number): Promise<State> {
    const stateId = await this.statesRepository.findOne({ where: { id } });

    if (!stateId) {
      throw new NotFoundError("Estado não existe!");
    }

    return stateId;
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterStateInput): Promise<any> {
    const [items, count]: any = await this.statesRepository.findAndCount({
      skip: perPage * (currentPage - 1),
      take: perPage,
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.name && { name: Like(`%${filters.name}%`) }),
        ...(filters.uf && { uf: Like(`%${filters.uf}%`) }),
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

  async create(data: CreateStateInput): Promise<State> {
    const { name, createdAt, ...rest } = data; //eslint-disable-line

    const checkedName = await this.verifyDuplicityName(name.trim());

    if (checkedName) {
      throw new NotFoundError("Nome já existente na base de dados!");
    }

    const createdState = {
      ...rest,
      name: name.trim(),
      createdAt: new Date(),
    };

    const state = await this.statesRepository.create(createdState);
    return this.statesRepository.save(state);
  }

  async update(id: number, data: UpdateStateInput): Promise<State> {
    const { name, updatedAt, ...rest } = data; //eslint-disable-line

    const state = await this.statesRepository.findOne({ where: { id } });
    const checkedName = await this.verifyDuplicityName(name.trim());

    if (!state) {
      throw new NotFoundError("Estado não existe!");
    }

    if (name == checkedName) {
      throw new NotFoundError("Nome já existente na base de dados!");
    }

    const updatedState = {
      ...rest,
      name: name.trim(),
      updatedAt: new Date(),
    };

    return this.statesRepository.save({ ...state, ...updatedState });
  }

  async delete(id: number): Promise<State> {
    const cityId = await this.verifyIfStateHasRelationWithCity(Number(id));
    const stateId = await this.statesRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!stateId) {
      throw new NotFoundError("Estado não existe!");
    }

    if (cityId) {
      throw new NotFoundError("Não pode remover cidade, pois está vinculado ao estado!");
    }

    return this.statesRepository.save({ ...stateId, ...data });
  }

  async verifyDuplicityName(name: string): Promise<any> {
    const checkedName = await this.statesRepository.findOne({
      where: {
        name,
      },
    });
    return checkedName;
  }

  async verifyIfStateHasRelationWithCity(id: number): Promise<City> {
    const city = await this.citiesRepository.citiesRepository.findOne({
      where: { state_id: Number(id) },
    });
    return city;
  }
}
