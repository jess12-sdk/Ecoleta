import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController{

    async index(request: Request, response: Response){
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

            const serializedPoints = points.map(point => {
                return {
                    ...point,
                    image_url: `http://192.168.100.41:3333/uploads/${point.image}`,
                };
            });

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response){
        //const id = request.params.id;
        const { id } = request.params;

        //procura por id
        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({ message: 'Point not found.' });
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.100.41:3333/uploads/${point.image}`,
            
        };

        /**
         * SELECT * FROM items
         *  JOIN point_items ON items.id = point_items.item_id
         * WHERE point_items.point_id = id
         */

        //lista todos os items que tem relação com point
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point: serializedPoint, items});
    }

    async create(request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        //se um table der erro não salva nas outras(relacionamento)
        const trx = await knex.transaction();
    
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        //insere os ids
        const insertedIds = await trx('points').insert(point);
        
        //inicializa point_id para ser usado em pointsItems
        const point_id = insertedIds[0];
    
        //pegar os ids para faezr conexão com a outra tabela point_items
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id
                }
        })
        
        //vai para tabela point_items
        await trx('point_items').insert(pointItems);

        //faz realmente os insertes na base de dados
        await trx.commit();
    
        return response.json({ 
            id: point_id,
            ...point,
         });
    }
}

export default PointsController;