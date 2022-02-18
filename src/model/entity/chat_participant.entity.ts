import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './common/base.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';

export class ChatParticipant_ {
  public static readonly TN = 'chat_participants';

  public static readonly LAST_DELETED_AT = 'last_deleted_at';
  public static readonly LAST_SEEN_AT = 'last_seen_at';
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

  @ManyToOne(() => User, (user) => user.chatParticipants)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatParticipants)
  chat: Chat;
}
