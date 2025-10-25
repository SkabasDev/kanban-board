import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'
import { ColumnEntity } from '../columns/column.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    @InjectRepository(ColumnEntity) private readonly columns: Repository<ColumnEntity>,
  ) {}

  async create(dto: { columnId: string; title: string; description?: string }) {
    const column = await this.columns.findOne({ where: { id: dto.columnId } })
    if (!column) throw new NotFoundException('Column not found')
    const task = this.tasks.create({ title: dto.title, description: dto.description, column })
    return this.tasks.save(task)
  }

  async move(taskId: string, toColumnId: string) {
    const task = await this.tasks.findOne({ where: { id: taskId }, relations: ['column'] })
    if (!task) throw new NotFoundException('Task not found')
    const toColumn = await this.columns.findOne({ where: { id: toColumnId } })
    if (!toColumn) throw new NotFoundException('Target column not found')
    const fromColumnId = task.column.id
    task.column = toColumn
    const saved = await this.tasks.save(task)
    return { task: saved, fromColumnId, toColumnId }
  }
}
