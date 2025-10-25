import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  create(@Body() dto: { columnId: string; title: string; description?: string }) {
    return this.tasks.create(dto)
  }

  @Patch(':id/move')
  move(@Param('id') id: string, @Body('toColumnId') toColumnId: string) {
    return this.tasks.move(id, toColumnId)
  }
}
