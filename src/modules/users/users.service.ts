import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Like } from "typeorm";

// IMPORT USERS
import { User } from "./entities/user.entity";
import { FilterUserInput } from "./dto/filter-user.input";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

// IMPORT PAGINATE
import { PageInfo } from "../paginations/entities/pagination.entity";
import { PaginationArgs } from "../filters/PaginationArgs";
import Paginate from "../../utils/Paginate";

// IMPORT ERROR
import { NotFoundError } from "src/common/errors/types/NotFoundError";

// IMPORT DOTENV
import * as dotenv from "dotenv";
dotenv.config();

// IMPORT MD5 - CRYPTO PASSWORD
import * as md5 from "md5";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User> {
    const userId = await this.usersRepository.findOne({ where: { id } });

    if (!userId) {
      throw new NotFoundError("Usuario não existe!");
    }

    return userId;
  }

  async findEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async findAll({ perPage, currentPage }: PaginationArgs, filters: FilterUserInput): Promise<any> {
    const [items, count]: any = await this.usersRepository.findAndCount({
      skip: perPage * (currentPage - 1),
      take: perPage,
      where: {
        ...(filters.id && { id: filters.id }),
        ...(filters.name && { name: Like(`%${filters.name}%`) }),
        ...(filters.phoneNumber && { phoneNumber: Like(`%${filters.phoneNumber}%`) }),
        ...(filters.email && { email: Like(`%${filters.email}%`) }),
        ...(filters.password && { password: Like(`%${filters.password}%`) }),
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

  async create(data: CreateUserInput): Promise<User> {
    const { email, phoneNumber, password, active, createdAt, ...rest } = data; //eslint-disable-line

    const checkedEmail = await this.verifyDuplicityEmail(email);
    const checkedPhoneNumber = await this.verifyDuplicityPhone(phoneNumber);

    if (checkedEmail) {
      throw new NotFoundError("Email já existente na base de dados!");
    }

    if (checkedPhoneNumber) {
      throw new NotFoundError("Telefone já existente na base de dados!");
    }

    const encryptedPassword = md5(password + process.env.SECRET_PASSWORD);

    const createdUser = {
      ...rest,
      email: email.trim(),
      phoneNumber: phoneNumber,
      password: encryptedPassword,
      active: true,
      createdAt: new Date(),
    };

    const user = await this.usersRepository.create(createdUser);
    return this.usersRepository.save(user);
  }

  async update(id: number, data: UpdateUserInput): Promise<User> {
    const { email, phoneNumber, password, updatedAt, ...rest } = data; //eslint-disable-line

    const user = await this.usersRepository.findOne({ where: { id } });
    const checkedEmail = await this.verifyDuplicityEmail(email);
    const checkedPhoneNumber = await this.verifyDuplicityPhone(phoneNumber);

    if (!user) {
      throw new NotFoundError("Usuario não existe!");
    }

    if (email == checkedEmail) {
      throw new NotFoundError("Email já existente na base de dados!");
    }

    if (phoneNumber == checkedPhoneNumber) {
      throw new NotFoundError("Numero de telefone já existente na base de dados!");
    }

    const encryptedPassword = md5(password + process.env.SECRET_PASSWORD);

    const updatedUser = {
      ...rest,
      email: email.trim(),
      phoneNumber: phoneNumber,
      password: encryptedPassword,
      updatedAt: new Date(),
    };

    return this.usersRepository.save({ ...user, ...updatedUser });
  }

  async delete(id: number): Promise<User> {
    const userId = await this.usersRepository.findOne({ where: { id } });
    const data = { deletedAt: new Date(), updatedAt: new Date(), active: false };

    if (!userId) {
      throw new NotFoundError("Usuario não existe!");
    }

    return this.usersRepository.save({ ...userId, ...data });
  }

  async verifyDuplicityEmail(email: string): Promise<any> {
    const checkedEmail = await this.usersRepository.findOne({
      where: {
        email: email.trim(),
      },
    });
    return checkedEmail;
  }

  async verifyDuplicityPhone(phoneNumber: string): Promise<any> {
    const checkedEmail = await this.usersRepository.findOne({
      where: {
        phoneNumber,
      },
    });
    return checkedEmail;
  }
}
