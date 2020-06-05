import express, { request, response } from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';
import PointsController from './controllers/PointsController';
import  ItemsController from './controllers/ItemsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

//lista itens
routes.get('/items', itemsController.index);

//criar (cadastro de produtos) e validação
routes.post(
    '/points', 
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    pointsController.create
);

//listar pontos de coletas filtrados
routes.get('/points/', pointsController.index);

//lista pontos de coleta
routes.get('/points/:id', pointsController.show);

//index: listagem
//show: se for exibir um unico registro
// create, update, delete

export default routes;