import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ColumnEntity } from './column.entity'

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(ColumnEntity) private readonly repo: Repository<ColumnEntity>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['tasks'] })
  }
}
