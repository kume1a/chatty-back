import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ChatMessage } from './chat_message.entity';

export class MessageType_ extends BaseEntity_ {
  public static readonly TN = 'message_type';

  public static readonly TYPE = 'type';
}

@Entity({ name: MessageType_.TN })
export class MessageType extends BaseEntity {
  @Column({ name: MessageType_.TYPE })
  type: string;

  @OneToMany(() => ChatMessage, (message) => message.messageType)
  messages: ChatMessage[];
}
