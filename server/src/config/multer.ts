import multer from 'multer';
import path from 'path';
//gera dados aleatorio
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        //nome que eu quero da para o meu arquivo
        filename(resquest, file, callback ) {
            const hash = crypto.randomBytes(6).toString('hex');

            const filename = `${hash}-${file.originalname}`

            callback(null, filename);
        } 
    })
}