import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BoardsService } from './boards.service'
import { BoardsController } from './boards.controller'
import { Board } from './board.entity'
import { ColumnEntity } from '../columns/column.entity'
import { Task } from '../tasks/task.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Board, ColumnEntity, Task])],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService]
})
export class BoardsModule {}
