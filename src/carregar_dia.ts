import axios from "axios";
import { JSDOM } from 'jsdom'

export async function carregarDia(dia:string, codigo:string) {
    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/receita/consultarPorDetalhamentoSubAlinea/${dia}/${dia}/${codigo}/0`

    const { data } = await axios.get(url);

    const { window: { document }} = new JSDOM(data)

    const strRecolhido = document.querySelector('table + table tbody td + td + td')?.textContent || '';

    if(strRecolhido == '') {
        return null;
    }

    const valor = parseFloat(strRecolhido
        .replaceAll('.', '')
        .replaceAll(',', '.'))
    
    return { id: `${dia.replaceAll('-', '')}:${codigo}`, data:dia, codigo, valor}
}

