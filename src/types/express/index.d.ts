declare namespace Express{
  export interface Request{
    user_id: string
  }
}

import { Request } from 'express';
import { File } from 'multer'; // Importa o tipo 'File' da 'multer'

// Estendemos a interface Request para incluir 'file' do tipo Buffer
export interface MulterRequest extends Request {
  file: File; // ou 'Express.Multer.File' caso ocorra conflito
}