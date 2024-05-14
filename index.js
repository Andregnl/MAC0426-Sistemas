import express from 'express'
import { createPgConnectionPool, createMySqlConnectionPool } from './database.js'
import {Queries} from './queries.js'

let pgPool;
let myPool;


const app = express()
const port = 3080 //port in which the server will run

async function startApplication() {
    try {
        // Abre o pool de conexões
        pgPool = await createPgConnectionPool();
        myPool = await createMySqlConnectionPool();
        // Inicia a aplicação Express
        app.listen(port, () => {
            console.log("Servidor rodando na porta "+ port);
        });
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}


await startApplication()
const db = new Queries(pgPool, myPool)


app.get('/', async (req, res) => {
    console.time('getidsbadges'); // Start the timer
    const data = await db.getidsbadges()
    console.timeEnd('getidsbadges'); // End the timer and print the result

    res.send(data)
  })
