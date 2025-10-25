import { Controller, Get } from '@nestjs/common'
import { ColumnsService } from './columns.service'

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columns: ColumnsService) {}

  @Get()
  list() {
    return this.columns.findAll()
  }
}
