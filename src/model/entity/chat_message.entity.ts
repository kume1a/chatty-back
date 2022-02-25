import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';
import { MessageType } from '../enums/message_type.enum';

export class ChatMessage_ extends BaseEntity_ {
  public static readonly TN = 'chat_messages';

  public static readonly TEXT_MESSAGE = 'textMessage';
  public static readonly IMAGE_URL = 'imageUrl';
  public static readonly VOICE_URL = 'voiceUrl';
  public static readonly VIDEO_URL = 'videoUrl';
  public static readonly GIF_URL = 'gifUrl';
  public static readonly MESSAGE_TYPE = 'messageType';

  public static readonly USER_ID = 'userId';
  public static readonly CHAT_ID = 'chatId';
}

@Entity(ChatMessage_.TN)
export class ChatMessage extends BaseEntity {
  @Column({ name: ChatMessage_.TEXT_MESSAGE, nullable: true, type: 'text' })
  textMessage: string | null;

  @Column({ name: ChatMessage_.IMAGE_URL, nullable: true })
  imageUrl: string | null;

  @Column({ name: ChatMessage_.VOICE_URL, nullable: true })
  voiceUrl: string | null;

  @Column({ name: ChatMessage_.VIDEO_URL, nullable: true })
  videoUrl: string | null;

  @Column({ name: ChatMessage_.GIF_URL, nullable: true })
  gifURl: string | null;

  @Column({
    type: 'enum',
    enum: MessageType,
    name: ChatMessage_.MESSAGE_TYPE,
  })
  messageType: MessageType;

  @Column({ name: ChatMessage_.USER_ID })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: ChatMessage_.USER_ID })
  user: User;

  @Column({ name: ChatMessage_.CHAT_ID })
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  @JoinColumn({ name: ChatMessage_.CHAT_ID })
  chat: Chat;
}
