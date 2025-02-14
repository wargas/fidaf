import axios from "axios";
import { JSDOM } from 'jsdom';

//1114511200

export async function carregarIntervalo(subalinea: string, inicio: string, fim: string) {
    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/receita/consultarPorSubAlinea/${inicio}/${fim}/${subalinea}/0`

    const { data } = await axios.get(url);

    const { window: { document } } = new JSDOM(data)

    const rows = document.querySelectorAll('table + table tbody tr');

    const valores = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');

        let codigo = (row.querySelector('a')?.href || '')
            .replace(/\/0$/, "")
            .split('/').pop()

        if (codigo?.startsWith('9')) {
            codigo = `${codigo}00`
        }

        return {
            valor: parseFloat(cells[3].textContent?.replaceAll('.', '')
                .replaceAll(',', '.') || '0'),
            codigo,
            inicio, fim
        }
    })

    return valores;

}

