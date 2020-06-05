import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './route';
import { errors } from 'celebrate';


const app = express();

app.use(cors());
//fazer o express entender JSON
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

//isso lidar a forma que a gente trata os erros la do front-end
app.use(errors());

//ouvindo pela porta 3333
app.listen(3333);