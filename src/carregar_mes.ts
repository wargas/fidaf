process.env.TZ = "UTC";
import axios from 'axios';
import { endOfMonth, format, startOfMonth } from 'date-fns';

const codigos = [
    "1112500100", "1112500200", "1112530100", "1112530200", "1114511100", "1114511200",
    "921112500100", "921112500200", "921112530100", "921112530200", "921114511100", "921114511200",
    "981112500100", "981112500200", "981112530100", "981112530200", "981114511100", "981114511200",
]

export async function carregarMes(ano: number, mes: number) {
    const start = format(startOfMonth(new Date(`${ano}-${mes}-01`)), 'yyyy-MM-dd')
    const end = format(endOfMonth(new Date(`${ano}-${mes}-01`)), 'yyyy-MM-dd')

    const url = `https://transparencia.fortaleza.ce.gov.br/index.php/receita/consultarPorReceitaAnaliticaCSV/${ano}/${start}/${end}/texto`

    const { data } = await axios.get(url);

    return String(data).split("\n").map(l => l.replaceAll('"', ""))
        .filter(l => codigos.includes(l.split(";")[0]))
        .map(l => {
            const [codigo, descricao, fonte, __, ___, recolhido] = l.split(";")
            const mes = start.replace(/(\d+-\d+)-\d+/, "$1");
            return {
                id: [mes, codigo, fonte].join(':'),
                mes,
                codigo,
                fonte,
                descricao: descricao.trim(),
                recolhido: parseFloat(recolhido.replaceAll('.', '').replace(',', '.'))
            }
        })
}