import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Board } from './board.entity'

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private readonly repo: Repository<Board>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['columns', 'columns.tasks'] })
  }

  async createDefault(): Promise<Board> {
    const count = await this.repo.count()
    if (count > 0) return (await this.findAll())[0]

    const board = this.repo.create({
      name: 'Mi tablero',
      columns: [
        { name: 'ToDo', id: undefined as any, tasks: [], board: undefined as any },
        { name: 'Doing', id: undefined as any, tasks: [], board: undefined as any },
        { name: 'Done', id: undefined as any, tasks: [], board: undefined as any },
      ] as any,
    })
    return this.repo.save(board)
  }
}
