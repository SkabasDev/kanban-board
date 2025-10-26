import { Body, Controller, Param, Patch, Post, ParseIntPipe } from '@nestjs/common'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() dto: { columnId: number; title: string; description?: string }) {
    return this.tasks.create(dto)
  }

  @Patch(':id/move')
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body('toColumnId', ParseIntPipe) toColumnId: number,
  ) {
    return this.tasks.move(id, toColumnId)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: { title?: string; description?: string }
  ) {
    return this.tasks.update(id, dto)
  }

  @Patch(':id/archive')
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.tasks.archive(id)
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tasks.restore(id)
  }
}
