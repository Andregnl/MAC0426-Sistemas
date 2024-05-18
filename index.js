import express from 'express'
import { createPgConnectionPool, createMySqlConnectionPool } from './database.js'
import { Queries } from './queries.js'
import fs from 'fs';

import * as c from './consultas/conj_consultas.js'

let pgPool;
let myPool;


const app = express()
const port = 3080 //port in which the server will run

async function runTestBattery(db, queryList, indexList, dbName = "mysql", outFileName) {
    try {
        fs.unlinkSync(outFileName);
    }
    catch (err) {
        console.error('Nao consegui apagar o arquivo: ' + outFileName)
    }

    let results = await db.testManyWithIndex(20, queryList, indexList, dbName);

    fs.appendFileSync(outFileName ,JSON.stringify(results) + '\n');
}

async function startApplication() {
    try {
        // Abre o pool de conexões
        pgPool = await createPgConnectionPool();
        myPool = await createMySqlConnectionPool();
        // Inicia a aplicação Express
        app.listen(port, () => {
            console.log("Servidor rodando na porta " + port);
        });
    } catch (error) {
        console.error("Erro ao iniciar a aplicação:", error);
    }
}

await startApplication()

const db = new Queries(pgPool, myPool)


app.get('/', async (req, res) => {
    console.log("Requisição recebida")	

    var testResults = []
    let results = []

    // "Select * FROM Votes WHERE Id > 5503 AND Id < 1001375624;",
    console.log("run mysql queries")
    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "mysql", "consultas3BTree.json")
    console.log("run postgres queries")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "postgres", "consultas5BTree.json")
    console.log("end")
    // try {
    //     fs.unlinkSync('tempo_postgres.txt');
    // }
    // catch (err) {
    //     console.error(err)
    // }

    // results = await db.testManyWithIndex(2, allTests, "pg");

    // fs.appendFileSync(`tempo_postgres.txt`, JSON.stringify(results) + '\n');
    // res.send("Ok")

})

app.get('/dropIndexes', async (req, res) => {
    await db.dropAllIndexFromTable("Posts")
    res.send("OK")
})
