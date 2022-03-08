import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { ChatParticipant } from './chat-participant.entity';
import { ChatMessage } from './chat-message.entity';

export class User_ extends BaseEntity_ {
  static readonly TN = 'users';

  static readonly FIRST_NAME = 'firstName';
  static readonly LAST_NAME = 'lastName';
  static readonly EMAIL = 'email';
  static readonly PASSWORD = 'password';
  static readonly PROFILE_IMAGE_PATH = 'profileImagePath';
  static readonly SOCKET_ID = 'socketId';

  static readonly RL_CHAT_PARTICIPANTS = 'chatParticipants';
}

@Entity({ name: User_.TN })
export class User extends BaseEntity {
  @Column({ name: User_.FIRST_NAME })
  firstName: string;

  @Column({ name: User_.LAST_NAME })
  lastName: string;

  @Column({ name: User_.PROFILE_IMAGE_PATH, nullable: true })
  profileImagePath: string | null;

  @Column({ name: User_.EMAIL, unique: true })
  email: string;

  @Column({ name: User_.PASSWORD })
  password: string;

  @Column({ name: User_.SOCKET_ID })
  socketId: string;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.user)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];
}
