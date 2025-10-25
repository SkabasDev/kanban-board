import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ColumnEntity } from '../columns/column.entity'

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @OneToMany(() => ColumnEntity, (c) => c.board, { cascade: true })
  columns!: ColumnEntity[]
}
