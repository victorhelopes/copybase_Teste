export interface File extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  size: number;
  buffer: Buffer;
}
