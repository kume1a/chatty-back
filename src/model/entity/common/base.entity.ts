import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity_ {
  public static readonly ID = 'id';
  public static readonly CREATED_AT = 'createdAt';
  public static readonly UPDATED_AT = 'updatedAt';
  public static readonly DELETED_AT = 'deletedAt';
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ name: BaseEntity_.ID, type: 'int8' })
  public id: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    update: false,
    name: BaseEntity_.CREATED_AT,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: BaseEntity_.UPDATED_AT,
  })
  public updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    name: BaseEntity_.DELETED_AT,
  })
  public deletedAt?: Date;
}
