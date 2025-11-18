import { Worker } from "bullmq";
import { carregarServidores } from "./carregar_servidores";
import { database } from "./database";
import { connection } from "./redis";


const workerServidores = new Worker('loadServidores', async job => {
    await database.transaction(async function (trx) {
        trx.table('servidores').truncate();

        const mes = new Date().getMonth();

        for (let i = 1; i <= mes; i++) {
            await carregarServidores(i, trx)
        }

        trx.commit()
    })

    return true;
}, { connection, autorun: true })

export { workerServidores };

