import { promisify } from "util";
import fs from "fs";
import { constants } from "fs/promises";

export class Queries {
    constructor(pgPool, myPool) {
        this.pgPool = pgPool;
        this.myPool = myPool;
        this.myPool.query = promisify(this.myPool.query).bind(this.myPool);
    }

    async getidsbadges() {
        const result = await this.myPool.query("SELECT * From Badges");
        return result;
    }

    async genericQuery(qry) {
        const result = await this.pgPool.query(qry);
        return result;
    }

    async dropAllIndexFromTable(table) {
        const sql = `SHOW INDEX FROM ${table}`;
        let result = await this.myPool.query(sql);
        for (const row of result) {
            // Verifica se o índice não é a chave primária e não é uma chave estrangeira
            if (row.Key_name !== 'PRIMARY' && row.Index_type === 'BTREE') {
                const dropIndexSql = `ALTER TABLE ${table} DROP INDEX ${row.Key_name}`;
                await this.myPool.query(dropIndexSql);
            }
        }

        // results[0].RowDataPacket.Column_name
        // results[0].RowDataPacket.Key_name
        // let dropIndex = []
        // for (let i = 0; i < result.length; i++) {
        //     dropIndex.push(`DROP INDEX ${result[i].Key_name}`)
        // }
    }

    async runQuery(sql, db) {

        console.log("Consulta: ", sql, " |base: ", db);
        let res;
        try {
            if (db === "pg") {
                res = await this.pgPool.query(sql);
                res = res.rows;
            }
            else if (db === "mysql") {
                sql = sql.replace(/"/g, "");
                res = await this.myPool.query(sql);
                // console.log("res: ", res);
            }
            //if index in sql console.log
            if (sql.includes("CREATE INDEX") || sql.includes("DROP INDEX")) console.log("res: ", res);
            console.log("res lentgh: ", res?.length)
        }
        catch (err) {
            console.log("erro: ", err);
        }
        return res;
    }

    async resetCache(db) {
        if (db === "pg") {
            res = await this.pgPool.query("RESET QUERY CACHE;");
            res = res.rows;
        }
        else if (db === "mysql") {
            sql = sql.replace(/"/g, "");
            res = await this.myPool.query("RESET QUERY CACHE;");
            // console.log("res: ", res);
        }
    }

    async createIndex(indexType = "BTREE", allIndex, db) {
        let index_name = ''
        let queryDropIndex = []
        for (let index of allIndex) {
            let index_table_name = index.table_name;
            let index_column_name = index.column_name;
            let indexTypeQry = ''
            index_name = index.column_name + "_" + index.table_name;
            if (db == "mysql") {
                index_table_name = index_table_name.replace(/"/g, "");
                index_column_name = index_column_name.replace(/"/g, "");
                if (indexType == "BTREE") {
                    this.runQuery("SET GLOBAL innodb_adaptive_hash_index = OFF;", db)
                }
                else if (indexType == "HASH") {
                    this.runQuery("SET GLOBAL innodb_adaptive_hash_index = ON;", db)
                }
            }
            else if (db = "pg") {
                indexTypeQry = " USING " + indexType;
            }
            index_name = index_name.replace(/"/g, "");
            let index_qry
            if (db == 'pg') index_qry = `CREATE INDEX IF IT NOT EXISTS ${index_name} ON ${index_table_name}  ${indexTypeQry}  (${index_column_name})`;
            if (db == 'mysql') index_qry = `CREATE INDEX ${index_name} ON ${index_table_name}  ${indexTypeQry}  (${index_column_name})`;
            let dropIndex = `DROP INDEX ${index_name}`;
            if (db == "mysql") dropIndex = `DROP INDEX ${index_name} ON ${index_table_name}`;
            queryDropIndex.push(dropIndex);
            try {
                await this.runQuery(index_qry, db);
            }
            catch (err) {
                if (err?.sqlMessage) console.log("erro ao criar index: ", err.sqlMessage);
                else console.log("erro ao criar index: ", err);
            }
        }

        return queryDropIndex;
    }

    async destroyIndexes(queryDropIndex, db) {
        for (let qry of queryDropIndex) {
            try {
                await this.runQuery(qry, db)
            } catch (err) {
                if (err?.sqlMessage) console.log("erro ao deletar index: ", err.sqlMessage);
                else console.log("erro ao deletar index: ", err);
            }
        }
    }

    // os indice usado vão ser 2 no postgres: hash, btree
    // os indice usado vão ser 1 no mysql: b_tree

    // caso especial de utilização de indice: full_text
    // nesse caso especial só utilizaremos os testes do
    // item 4 dos Tipos de Testes

    // Evitar o problema de cache 
    // Solução: Não rodar os mesmo testes de novo em sequencia
    // Quantas consultas temos? supondo 60
    // 60x -> 60x -> ... -> 60x  == 60x 20 é a quantidade de bateria de teste = BT
    // BTxteste_index, sendo que teste_indexs são diferentes cenários de index

    // Evitar alteração de dados no teste de inserção e deleção:
    // Primeiro todas as inserção -> todas as deleção 

    // Organização dos arquivos json deve ser feita por:
    // 1) Tipo de banco utilizado
    // 2) Tipo de indice utilizado
    // 3) Quantidade n de indices utilizados em colunas
    // Os arquivos json devem conter baterias de testes dos 60 testes que
    // temos executados em 20 baterias.

    // Tipos de Testes
    // 1.Análise das operações de inserção, remoção e alteração
    // 2.Busca por atributos chave-primária simples e composta
    // 3.Busca por atributos não chave-primária
    // (caso especial)4.Busca por padrões em atributos do tipo string
    // 5.Busca em resultados de junções e junções aninhadas
    // 6.Busca em consultas aninhadas
    // 7.Busca em resultados de operações de agrupamento e agregação

    async testManyWithIndex(tests = 10, qryList, indexList, db = "pg", indexType) {

        let tempoDiff = [];
        let results = {};
        let dropQueries;

        if (indexType) dropQueries = await this.createIndex(indexType, indexList, db);
        else if (db == 'mysql') await this.runQuery("SET GLOBAL innodb_adaptive_hash_index = OFF;", db);

        for (let i = 0; i < tests; i++) {
            for (let qry of qryList) {
                const iniTime = process.hrtime();
                await this.runQuery(qry, db);
                let diff = process.hrtime(iniTime);
                diff = diff.toString().replace(/,/g, ".");
                tempoDiff.push(diff);
                console.log(`Teste ${i} demorou: ${diff} ms`);
                if (!results[qry]) results[qry] = [];
                results[qry].push(diff);
            }
        }

        if (indexType) await this.destroyIndexes(dropQueries, db)
        console.log("results: ", results);
        return results;
    }

    // async testMany(tests = 10, qry, db = "pg") {
    //     let tempoDiff = [];
    //     console.log("consulta: ", qry);
    //     let results = {};

    //     for (let i = 0; i < tests; i++) {
    //         for (let sql of qry) {
    //             const iniTime = process.hrtime();
    //             let res;
    //             if (db === "pg") await this.pgPool.query(sql);
    //             else if (db === "mysql") {
    //                 res = await this.myPool.query(sql);
    //             }
    //             let diff = process.hrtime(iniTime); // Calculate the time difference
    //             diff = diff.toString().replace(/,/g, ".");
    //             tempoDiff.push(diff);
    //             console.log(`Teste ${i} demorou: ${diff} ms`);
    //             if (!results[sql]) results[sql] = [];
    //             results[sql].push(diff);
    //             testData.push();
    //         }
    //     }
    //     console.log(results);
    //     return results;
    // }
}