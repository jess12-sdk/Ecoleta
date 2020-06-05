import knex from 'knex';
import path from 'path';

//conexão com banco de dados

const connection = knex({
    client: 'sqlite3',
    connection: {
        //path.resolve uni caminhos
        //__driname diretorio
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});

export default connection;