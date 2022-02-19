import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { ChatParticipant } from './chat_participant.entity';
import { ChatMessage } from './chat_message.entity';

export class User_ extends BaseEntity_ {
  static readonly TN = 'users';

  static readonly FIRST_NAME = 'firstName';
  static readonly LAST_NAME = 'lastName';
  static readonly EMAIL = 'email';
  static readonly PASSWORD = 'password';

  static readonly RELATION_CHAT_PARTICIPANTS = 'chatParticipants';
}

@Entity({ name: User_.TN })
export class User extends BaseEntity {
  @Column({ name: User_.FIRST_NAME, nullable: false })
  firstName: string;

  @Column({ name: User_.LAST_NAME, nullable: false })
  lastName: string;

  @Column({ name: User_.EMAIL, nullable: false })
  email: string;

  @Column({ name: User_.PASSWORD, nullable: false })
  password: string;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];
}
