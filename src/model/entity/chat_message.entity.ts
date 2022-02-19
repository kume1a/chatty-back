import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { MessageType } from './message_type.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';

export class ChatMessage_ {
  public static readonly TN = 'chat_messages';

  public static readonly ID = BaseEntity_.ID;
  public static readonly CREATED_AT = BaseEntity_.CREATED_AT;
  public static readonly UPDATED_AT = BaseEntity_.UPDATED_AT;
  public static readonly DELETED_AT = BaseEntity_.DELETED_AT;

  public static readonly TEXT_MESSAGE = 'text_message';
  public static readonly IMAGE_URL = 'image_url';
  public static readonly VOICE_URL = 'voice_url';
  public static readonly GIF_URL = 'gif_url';

  public static readonly MESSAGE_TYPE_ID = 'message_type_id';
  public static readonly USER_ID = 'user_id';
  public static readonly CHAT_ID = 'chat_id';
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
  @JoinColumn({ name: ChatMessage_.MESSAGE_TYPE_ID })
  messageType: MessageType;

  @ManyToOne(() => User, (user) => user.chatMessages)
  @JoinColumn({ name: ChatMessage_.USER_ID })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  @JoinColumn({ name: ChatMessage_.CHAT_ID })
  chat: Chat;
}
