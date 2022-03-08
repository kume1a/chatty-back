import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatParticipant } from './chat-participant.entity';
import { ChatMessage } from './chat-message.entity';

export class Chat_ extends BaseEntity_ {
  public static readonly TN = 'chats';

  public static readonly NAME = 'name';

  public static readonly RL_CHAT_PARTICIPANTS = 'chatParticipants';
  public static readonly RL_CHAT_MESSAGES = 'chatMessages';
}

@Entity(Chat_.TN)
export class Chat extends BaseEntity {
  @Column({ name: Chat_.NAME, nullable: true })
  name: string | null;

  @OneToMany(() => ChatParticipant, (chatParticipant) => chatParticipant.chat)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => ChatMessage, (chatMessages) => chatMessages.chat)
  chatMessages: ChatMessage[];
}
