import { Controller, Get } from '@nestjs/common'
import { BoardsService } from './boards.service'

@Controller('boards')
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get()
  async get() {
    return this.boards.findAll()
  }

  @Get('seed')
  async seed() {
    return this.boards.createDefault()
  }
}
