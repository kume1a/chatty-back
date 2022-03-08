import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity, BaseEntity_ } from './common/base.entity';
import { ChatMessage } from './chat-message.entity';

export class ImageMeta_ extends BaseEntity_ {
  public static readonly TN = 'image_meta';

  public static readonly WIDTH = 'width';
  public static readonly HEIGHT = 'height';
  public static readonly CHAT_MESSAGE_ID = 'chatMessageId';
}

@Entity({ name: ImageMeta_.TN })
export class ImageMeta extends BaseEntity {
  @Column({ name: ImageMeta_.WIDTH })
  width: number;

  @Column({ name: ImageMeta_.HEIGHT })
  height: number;

  @Column({ name: ImageMeta_.CHAT_MESSAGE_ID })
  chatMessageId: number;

  @OneToOne(() => ChatMessage, (chatMessage) => chatMessage.imageMeta)
  @JoinColumn({ name: ImageMeta_.CHAT_MESSAGE_ID })
  chatMessage: ChatMessage;
}
