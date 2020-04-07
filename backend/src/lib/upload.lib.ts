import path from 'path';
import multer from 'multer';
import { generateId } from './method.lib';

const fileFilter = (req, file, cb) => {
  const fileName = `${generateId()}${path.extname(file.originalname)}`;

  return cb(null, fileName);
};

export const uploader = multer({
  storage: multer.diskStorage({
    destination: function(_, __, cb) {
      cb(null, 'src/public/img');
    },
    filename: fileFilter,
  }),
  // limits: {
  //   fileSize: 8400000,
  // },
});
