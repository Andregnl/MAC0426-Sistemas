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
    user: 'root',
    host: 'localhost',
    database: 'StackOverflow',
    password: '12345',
    port: 3306,
    });

export async function createPgConnectionPool() {
    try {
        await pgPool.connect();
        console.log("Pool de conexões Postgre criado com sucesso");
        return pgPool;
    } catch (error) {
        console.error("Erro ao criar o pool de conexões:", error);
    }
}

export function createMySqlConnectionPool() {
    return new Promise((resolve, reject) => {
        myPool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                console.log("Connected to MySQL database");
                resolve(connection);
            }
        });
    });
}