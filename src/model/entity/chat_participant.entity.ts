import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';

export class ChatParticipant_ extends BaseEntity_ {
  public static readonly TN = 'chat_participants';

  public static readonly LAST_DELETED_AT = 'lastDeletedAt';
  public static readonly LAST_SEEN_AT = 'lastSeenAt';

  public static readonly USER_ID = 'userId';
  public static readonly CHAT_ID = 'chatId';

  public static readonly RL_CHAT = 'chat';
}

@Entity(ChatParticipant_.TN)
export class ChatParticipant extends BaseEntity {
  @Column({
    type: 'timestamptz',
    name: ChatParticipant_.LAST_DELETED_AT,
    nullable: true,
  })
  lastDeletedAt: Date | null;

  @Column({
    type: 'timestamptz',
    name: ChatParticipant_.LAST_SEEN_AT,
    nullable: true,
  })
  lastSeenAt: Date | null;

  @Column({ name: ChatParticipant_.USER_ID })
  userId: number;

  @ManyToOne(() => User, (user) => user.chatParticipants)
  @JoinColumn({ name: ChatParticipant_.USER_ID })
  user: User;

  @Column({ name: ChatParticipant_.CHAT_ID })
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.chatParticipants)
  @JoinColumn({ name: ChatParticipant_.CHAT_ID })
  chat: Chat;
}
