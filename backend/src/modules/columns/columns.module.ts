import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ColumnsController } from './columns.controller'
import { ColumnsService } from './columns.service'
import { ColumnEntity } from './column.entity'
import { Task } from '../tasks/task.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ColumnEntity, Task])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService]
})
export class ColumnsModule {}
