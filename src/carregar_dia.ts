import axios from "axios";
import { JSDOM } from 'jsdom';

//1114511200

export async function carregarDia(dia: string, subalinea: string) {
    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/receita/consultarPorSubAlinea/${dia}/${dia}/${subalinea}/0`

    const start = performance.now()
    const { data, status } = await axios.get(url, { timeout: 10000});
    const end = performance.now();

    console.log(status, end-start)

    const { window: { document } } = new JSDOM(data)

    const rows = document.querySelectorAll('table + table tbody tr');

    const valores = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');

        //"/index.php/receita/consultarPorDetalhamentoSubAlinea/2024-12-31/2024-12-31/1112500100/0"

        let codigo = (row.querySelector('a')?.href||'')
            .replace(/\/0$/, "")
            .split('/').pop()

        if(codigo?.startsWith('9')) {
            codigo = `${codigo}00`
        }

        return {
            id: `${dia.replaceAll('-', '')}:${codigo}`,
            valor: parseFloat(cells[3].textContent?.replaceAll('.', '')
                .replaceAll(',', '.') || '0'),
            codigo,
            data: dia
        }
    })

    return valores;

}

