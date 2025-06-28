import axios from "axios";
import fs from 'fs';
import { JSDOM } from 'jsdom';
import { database } from "./database";

export async function carregarServidores(_mes: number) {
    const mes = String(_mes).padStart(2, "0");

    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/servidores/consultar?mes=${mes}&ano=2025&orgao=23101`

    const { data } = await axios.get(url)

    await fs.promises.writeFile('servidores.html', data)

    const { window: {document} } = new JSDOM(data)

    const items = Array.from(document.querySelectorAll('.resultado'))
        .map(resultadoItem => {
            const divs = resultadoItem.querySelectorAll('span>div')
            return {
                nome: divs.item(0).textContent?.trim().replace("Nome: ", ""),
                cargo: divs.item(1).textContent?.trim().replace("Cargo: ", ""),
                mes: _mes
            }
        })

    await database.table('servidores').insert(items);
}

carregarServidores(1);