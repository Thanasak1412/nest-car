import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @AfterInsert()
  logInsertUser() {
    console.log('This user id to inserted', this.id);
  }

  @AfterRemove()
  logRemoveUser() {
    console.log('This user id to removed', this.id);
  }

  @AfterUpdate()
  logUpdateUser() {
    console.log('This user id to updated', this.id);
  }
}
