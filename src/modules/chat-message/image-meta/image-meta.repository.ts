import { EntityRepository, Repository } from 'typeorm';
import { ImageMeta } from '../../../model/entity/image-meta.entity';

@EntityRepository(ImageMeta)
export class ImageMetaRepository extends Repository<ImageMeta> {
  public async saveEntity(p: {
    chatMessageId: number;
    width: number;
    height: number;
  }): Promise<ImageMeta> {
    const entity = this.create({
      chatMessageId: p.chatMessageId,
      width: p.width,
      height: p.height,
    });

    return this.save(entity);
  }
}
