import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../config/config.module'
import { OrmConfigService } from '../config/typeorm.config'
import { BoardsModule } from './boards/boards.module'
import { ColumnsModule } from './columns/columns.module'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: OrmConfigService,
    }),
    BoardsModule,
    ColumnsModule,
    TasksModule,
  ],
})
export class AppModule {}
