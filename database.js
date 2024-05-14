//postgre connection pool

// db:
//     image: postgres
//     restart: always
//     environment:
//       POSTGRES_DB: mac0426db
//       POSTGRES_USER: mac0426user
//       POSTGRES_PASSWORD: mac0426password
//     ports:
//       - "5432:5432"
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'StackOverflow',
    password: '12345',
    port: 5432,
});

export async function createConnectionPool() {
    try {
        await pool.connect();
        console.log("Pool de conexões criado com sucesso");
        const ret = await pool.query('SELECT * From "Badges" ')
        console.log(ret)

        return pool;
    } catch (error) {
        console.error("Erro ao criar o pool de conexões:", error);
    }
}