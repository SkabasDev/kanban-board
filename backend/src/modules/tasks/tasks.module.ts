import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
import { Task } from './task.entity'
import { ColumnEntity } from '../columns/column.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Task, ColumnEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
