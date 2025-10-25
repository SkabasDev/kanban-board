import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { ConfigService } from './config.service'
import { Board } from '../modules/boards/board.entity'
import { ColumnEntity } from '../modules/columns/column.entity'
import { Task } from '../modules/tasks/task.entity'

@Injectable()
export class OrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly cfg: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.cfg.get('POSTGRES_HOST', 'localhost'),
      port: parseInt(this.cfg.get('POSTGRES_PORT', '5432')),
      username: this.cfg.get('POSTGRES_USER', 'postgres'),
      password: this.cfg.get('POSTGRES_PASSWORD', 'postgres'),
      database: this.cfg.get('POSTGRES_DB', 'kanban'),
      synchronize: false,
      migrations: ['dist/migrations/*.js'],
      entities: [Board, ColumnEntity, Task],
    }
  }
}
