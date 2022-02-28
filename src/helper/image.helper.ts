import { Injectable } from '@nestjs/common';
import _sizeOf from 'image-size';
import { promisify } from 'util';
import { Size } from '../model/common/size';

const sizeOf = promisify(_sizeOf);

@Injectable()
export class ImageHelper {
  public async getSize(imagePath: string): Promise<Size> {
    const meta = await sizeOf(imagePath);

    return {
      width: meta.width,
      height: meta.height,
    };
  }
}
