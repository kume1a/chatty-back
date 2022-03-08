import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './upload',
    filename: (_, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const fileExtName = path.extname(file.originalname);
      const fileName = `${uniqueSuffix}${fileExtName}`;

      callback(null, fileName);
    },
  }),
  // fileFilter: (_, file, callback) => {
  //   if (!file.originalname.match(/\.((jpeg)|(jpg)|(aac)|(mp4))$/)) {
  //     return callback(
  //       new GenericException(
  //         HttpStatus.BAD_REQUEST,
  //         ErrorMessageCode.UNSUPPORTED_FILE_TYPE,
  //       ),
  //       false,
  //     );
  //   }
  //
  //   callback(null, true);
  // },
  // limits: { fileSize: configs.general.PROFILE_UPLOAD_FILE_SIZE_MAX },
};
