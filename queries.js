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

    async dropAllIndexFromTable(table, db = "pg") {
        if (db == "mysql") {
            const sql = "SHOW INDEX FROM " + table;
            const result = await this.myPool.query(sql);
            console.log(result);
        } else if (db == "pg") {
            const sql = `SELECT indexname FROM pg_indexes WHERE tablename = "${table}"`;
            const result = await this.pgPool.query(sql);
            console.log(result);
        }
        return;

        //results[0].RowDataPacket.Column_name
        //results[0].RowDataPacket.Key_name
        // let dropIndex = []
        // for (let i = 0; i < result.length; i++) {
        //     dropIndex.push(`DROP INDEX ${result[i].Key_name}`)
        // }
    }

    async runQuery(sql, db) {
        console.log("Consulta: ",sql, " |base: ",db);
        let res;
        if (db === "pg") res = await this.pgPool.query(sql);
        else if (db === "mysql") {
            sql = sql.replace(/"/g, "");
            res = await this.myPool.query(sql);
        }
        return res;
    }

    async testManyWithIndex(tests = 10, qryList, db = "pg") {
        let tempoDiff = [];
        let results = {};

        for (let i = 0; i < tests; i++) {
            for (let qry of qryList) {
                let queryDropIndex = [];
                let index_name = "no_index";
                if (qry["index"] != []) {
                    // adiciona index
                    for (let index of qry["index"]) {
                        let index_table_name = index.table_name;
                        let index_column_name = index.column_name;
                        index_name = index.column_name + "_" + index.table_name;
                        if (db == "mysql") {
                            index_table_name = index_table_name.replace(/"/g, "");
                            index_column_name = index_column_name.replace(/"/g, "");
                        }
                        index_name = index_name.replace(/"/g, "");
                        let index_qry = `CREATE INDEX ${index_name} ON ${index_table_name} (${index_column_name})`;
                        let dropIndex = `DROP INDEX ${index_name}`;
                        if(db == "mysql") dropIndex = `DROP INDEX ${index_name} ON ${index_table_name}`;
                        queryDropIndex.push(dropIndex);
                        await this.runQuery(index_qry, db);
                    }
                }

                const iniTime = process.hrtime();
                let diff = process.hrtime(iniTime);
                await this.runQuery(qry.query, db);
                diff = diff.toString().replace(/,/g, ".");
                tempoDiff.push(diff);
                console.log(`Teste ${i} demorou: ${diff} ms`);
                if (!results[qry.query]) results[qry.query] = {};
                if (!results[qry.query][index_name]) results[qry.query][index_name] = [];
                results[qry.query][index_name].push(diff);

                console.log("hora de dropar")
                for (let qryDrop of queryDropIndex) { // to drop indexes
                    await this.runQuery(qryDrop, db);
                }
            }
        }
        console.log("results: ", results);
        return results;
    }

    async testMany(tests = 10, qry, db = "pg") {
        let tempoDiff = [];
        console.log("consulta: ", qry);
        let results = {};

        for (let i = 0; i < tests; i++) {
            for (let sql of qry) {
                const iniTime = process.hrtime();
                let res;
                if (db === "pg") await this.pgPool.query(sql);
                else if (db === "mysql") {
                    res = await this.myPool.query(sql);
                }
                let diff = process.hrtime(iniTime); // Calculate the time difference
                diff = diff.toString().replace(/,/g, ".");
                tempoDiff.push(diff);
                console.log(`Teste ${i} demorou: ${diff} ms`);
                if (!results[sql]) results[sql] = [];
                results[sql].push(diff);
                testData.push();
            }
        }
        console.log(results);
        return results;
    }
}
