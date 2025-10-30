import { carregarServidores } from "../carregar_servidores";
import { database } from "../database";

export async function TaskServidores() {
    await database.transaction(async function (trx) {
        trx.table('servidores').truncate();

        const mes = new Date().getMonth();

        for (let i = 1; i <= mes; i++) {
            await carregarServidores(i, trx)
        }

        // trx.commit()
    })

    return true;
}