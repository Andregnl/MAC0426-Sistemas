import pg from 'pg'
import mysql from 'mysql'

const pgPool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'StackOverflow',
    password: '12345',
    port: 5432,
});

const myPool = mysql.createPool({
    user: 'mysql',
    host: 'localhost',
    database: 'StackOverflow',
    password: '12345',
    port: 3306,
});

export async function createPgConnectionPool() {
    try {
        await pgPool.connect();
        console.log("Pool de conexões Postgre criado com sucesso");
        const ret = await pgPool.query('SELECT * From "Badges" ')
        console.log(ret)

        return pgPool;
    } catch (error) {
        console.error("Erro ao criar o pool de conexões:", error);
    }
}

export async function createMySqlConnectionPool() {
    try{
        await myPool.connect();
        console.log("Pool de conexões Mysql criado com sucesso");
        return myPool;
    }
    catch(error){
        console.error("Erro ao criar o pool de conexões:", error);
    }
}