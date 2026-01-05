import axios from "axios";
import fs from 'fs';
import { JSDOM } from 'jsdom';
import type { Knex } from "knex";
import { database } from "./database";

const cargos = [
    "ANALISTA DO TESOURO MUNICIPAL",
    "ANALISTA FAZENDARIO MUNICIPAL",
    "ASSIST TEC DO TESOURO MUNICIP",
    "AUDITOR DO TESOURO MUNICIPAL",
    "AUXILIAR DO TESOURO MUNICIPAL",
]

export async function carregarServidores(_mes: number, database: Knex) {
    const mes = String(_mes).padStart(2, "0");

    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/servidores/consultar?mes=${mes}&ano=2025&orgao=23101`

    const { data } = await axios.get(url)

    await fs.promises.writeFile('servidores.html', data)

    const { window: { document } } = new JSDOM(data)

    const items = Array.from(document.querySelectorAll('.resultado'))
        .map(resultadoItem => {
            const divs = resultadoItem.querySelectorAll('span>div')
            return {
                nome: divs.item(0).textContent?.trim().replace("Nome: ", ""),
                cargo: divs.item(1).textContent?.trim().replace("Cargo: ", "") || "",
                mes: _mes
            }
        }).filter(c => cargos.includes(c.cargo))
    if (items.length > 0) {
        await database.table('servidores').insert(items);
    }
}

await carregarServidores(1, database);
await carregarServidores(2, database);
await carregarServidores(3, database);
await carregarServidores(4, database);
await carregarServidores(5, database);
await carregarServidores(6, database);
await carregarServidores(7, database);
await carregarServidores(8, database);
await carregarServidores(9, database);
await carregarServidores(10, database);
await carregarServidores(11, database);
await carregarServidores(12, database);
