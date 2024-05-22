import express from 'express'
import { createPgConnectionPool, createMySqlConnectionPool } from './database.js'
import { Queries } from './queries.js'
import fs from 'fs';

import * as c from './organizedResults/consultas/conj_consultas.js'

let pgPool;
let myPool;


const app = express()
const port = 3080 //port in which the server will run

async function runTestBattery(db, queryList, indexList, dbName = "mysql", outFileName, indexType = '') {
    try {
        fs.unlinkSync("results/" + outFileName);
    }
    catch (err) {
        console.error('Nao consegui apagar o arquivo: ' + "results3/" + outFileName)
    }

    let results = await db.testManyWithIndex(20, queryList, indexList, dbName, indexType);

    fs.appendFileSync("results/" + outFileName ,JSON.stringify(results, null, 4) + '\n');
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

    console.log('começando')

    //MYSQL
    await db.testManyWithIndex(1, c.createFullTextIndexMysql, false, "mysql", false)

    await runTestBattery(db, c.consultasItem2, false, "mysql", "con2NoIndex_My.json", false)
    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "mysql", "con3NoIndex_My.json", false)
    await runTestBattery(db, c.consultasItem4, false, "mysql", "con4NoIndex_My.json", false)
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "mysql", "con5NoIndex_My.json", false)
    await runTestBattery(db, c.consultasItem6, c.indexesItem6, "mysql", "con6NoIndex_My.json", false)
    await runTestBattery(db, c.consultasItem7, c.indexesItem7, "mysql", "con7NoIndex_My.json", false)

    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "mysql", "con3Hash_My.json", "HASH")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "mysql", "con5Hash_My.json", "HASH")
    await runTestBattery(db, c.consultasItem6, c.indexesItem6, "mysql", "con6Hash_My.json", "HASH")
    await runTestBattery(db, c.consultasItem7, c.indexesItem7, "mysql", "con7Hash_My.json", "HASH")

    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "mysql", "con3Btree_My.json", "BTREE")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "mysql", "con5Btree_My.json", "BTREE")
    await runTestBattery(db, c.consultasItem6, c.indexesItem6, "mysql", "con6Btree_My.json", "BTREE")
    await runTestBattery(db, c.consultasItem7, c.indexesItem7, "mysql", "con7Btree_My.json", "BTREE")

    await runTestBattery(db, c.consultasItem4, false, "mysql", "con4FullTextIndex.json", false)

    await db.testManyWithIndex(1, c.dropFullTextIndexMysql, false, "mysql", false)

    //POSTGRES
    await db.testManyWithIndex(1, c.createFullTextIndexPostgres, false, "pg", false)

    await runTestBattery(db, c.consultasItem2, false, "pg", "con2NoIndex_Pg.json", false)
    await runTestBattery(db, c.consultasItem3, false, "pg", "con3NoIndex_Pg.json", false)
    await runTestBattery(db, c.consultasItem4, false, "pg", "con4NoIndex_Pg.json", false)
    await runTestBattery(db, c.consultasItem5, false, "pg", "con5NoIndex_Pg.json", false)
    await runTestBattery(db, c.consultasItem6, false, "pg", "con6NoIndex_Pg.json", false)
    await runTestBattery(db, c.consultasItem7, false, "pg", "con7NoIndex_Pg.json", false)

    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "pg", "con3Hash_Pg.json", "HASH")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "pg", "con5Hash_Pg.json", "HASH")
    await runTestBattery(db, c.consultasItem6, c.indexesItem6, "pg", "con6Hash_Pg.json", "HASH")
    await runTestBattery(db, c.consultasItem7, c.indexesItem7, "pg", "con7Hash_Pg.json", "HASH")

    await runTestBattery(db, c.consultasItem3, c.indexesItem3, "pg", "con3Btree_Pg.json", "BTREE")
    await runTestBattery(db, c.consultasItem5, c.indexesItem5, "pg", "con5Btree_Pg.json", "BTREE")
    await runTestBattery(db, c.consultasItem6, c.indexesItem6, "pg", "con6Btree_Pg.json", "BTREE")
    await runTestBattery(db, c.consultasItem7, c.indexesItem7, "pg", "con7Btree_Pg.json", "BTREE")

    await runTestBattery(db, c.consultasItem4IndicesPostgres, false, "pg", "con4FullTextIndex_Pg.json", false)

    await db.testManyWithIndex(1, c.dropFullTextIndexPostgres, false, "pg", false)

    console.log("terminei");
    // try {
    //     fs.unlinkSync('tempo_postgres.txt');
    // }
    // catch (err) {
    //     console.error(err)
    // }

    // results = await db.testManyWithIndex(2, allTests, "pg");

    // fs.appendFileSync(`tempo_postgres.txt`, JSON.stringify(results) + '\n');
    res.send("Ok")

})

app.get('/dropIndexes', async (req, res) => {
    console.log(req.query.table)
    await db.dropAllIndexFromTable(req.query.table)
    res.send("OK")
})
