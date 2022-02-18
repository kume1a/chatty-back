import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './common/base.entity';
import { MessageType } from './message_type.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';

export class ChatMessage_ {
  public static readonly TN = 'chat_messages';

  public static readonly TEXT_MESSAGE = 'text_message';
  public static readonly IMAGE_URL = 'image_url';
  public static readonly VOICE_URL = 'voice_url';
  public static readonly GIF_URL = 'gif_url';
}

@Entity(ChatMessage_.TN)
export class ChatMessage extends BaseEntity {
  @Column({ name: ChatMessage_.TEXT_MESSAGE, nullable: true, type: 'text' })
  textMessage: string | null;

  @Column({ name: ChatMessage_.IMAGE_URL, nullable: true })
  imageUrl: string | null;

  @Column({ name: ChatMessage_.VOICE_URL, nullable: true })
  voiceUrl: string | null;

  @Column({ name: ChatMessage_.GIF_URL, nullable: true })
  gifURl: string | null;

  @OneToOne(() => MessageType, (messageType) => messageType.messages)
  messageType: MessageType;

  @ManyToOne(() => User, (user) => user.chatMessages)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  chat: Chat;
}
