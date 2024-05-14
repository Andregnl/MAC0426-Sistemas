import express from 'express'
import { createConnectionPool } from './database.js'
//import pkg from 'pg';

//const { Pool } = pkg;

 
let pool;

const app = express()
const port = 3080

async function getidsbadges() {
    const result = await pool.query('SELECT * From "Badges" ')
    console.log(result) 
    return result
}

async function startApplication() {
    try {
        // Abre o pool de conexões
        pool = await createConnectionPool();
        // Inicia a aplicação Express
        app.listen(port, () => {
            console.log("Servidor rodando na porta "+ port);
        });
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}


await startApplication()

app.get('/', async (req, res) => {
    console.time('getidsbadges'); // Start the timer
    const data = await getidsbadges();
    console.timeEnd('getidsbadges'); // End the timer and print the result

    res.send(data)
  })
