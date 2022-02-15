import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class User_ {
  static readonly TABLE_NAME = 'users';

  static readonly ID = 'id';
  static readonly FIRST_NAME = 'firstName';
  static readonly LAST_NAME = 'lastName';
  static readonly EMAIL = 'email';
  static readonly PASSWORD = 'password';
}

@Entity({ name: User_.TABLE_NAME })
export class User {
  @PrimaryGeneratedColumn({ name: User_.ID, type: 'int8' })
  id: number;

  @Column({ name: User_.FIRST_NAME, nullable: false })
  firstName: string;

  @Column({ name: User_.LAST_NAME, nullable: false })
  lastName: string;

  @Column({ name: User_.EMAIL, nullable: false })
  email: string;

  @Column({ name: User_.PASSWORD, nullable: false })
  password: string;
}
