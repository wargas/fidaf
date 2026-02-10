import { format } from "date-fns";
import { sumBy } from "lodash";
import app from "./app";
import { database } from "./database";
import { connection } from "./redis";


app.get('/resumo', async (_, res) => {
    const data = await database.table('resumo')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/correcao', async (_, res) => {
    const data = await database.table('correcao')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/status', async (_, res) => {
    const data = await database.table('status');

    return data;
})

app.get('/receitas', async (_, res) => {
    const data = await database.table('receitas')
        .orderBy('mes', 'desc')

    return data;
})

app.get('/recolhimentos', async (req, res) => {

    const { inicio = '', fim = '', orderBy = 'data' } = req.query as any;

    const query = database.table('recolhimento_diario')

    if (String(orderBy).startsWith('-')) {
        query.orderBy(String(orderBy).replace('-', ''), 'DESC')
    } else {
        query.orderBy(String(orderBy).replace('-', ''), 'ASC')
    }

    if (inicio) {
        query.where('data', '>=', inicio)
    }

    if (fim) {
        query.where('data', '<=', fim)
    }


    const data = await query;
    // .orderBy('data', 'desc')

    return data.map(d => ({
        ...d,
        nominal: parseFloat(d.nominal),
        corrigido: parseFloat(d.corrigido),
    }));
})

app.get('/calculo', async (req, res) => {
    const defaultEnd = new Date()
    const { inicio = '2026-01-01', fim = format(defaultEnd, 'Y-MM-dd') } = req.query as any;

    const inicioPrev = String(inicio).replace('2026', '2025')
    let fimPrev = String(fim).replace('2026', '2025')

    if(fimPrev == '2025-02-28' && inicioPrev <= '2025-02-15') {
        fimPrev = '2025-02-29'
    }
    
    const queryPrev = (await database.table('recolhimento_diario')
        .whereBetween('data', [inicioPrev, fimPrev])).map(r => ({...r,
            nominal: parseFloat(r.nominal),
            corrigido: parseFloat(r.corrigido)
        }))
    
    const queryCurr = (await database.table('recolhimento_diario')
        .whereBetween('data', [inicio, fim])).map(r => ({...r,
            nominal: parseFloat(r.nominal),
            corrigido: parseFloat(r.corrigido)
        }))

    const receitas = {
        prev: {
            nominal: 0,
            corrigida: 0
        },
        curr: {
            nominal: 0,
            corrigida: 0
        },
        incremento: {
            valor: 0,
            porcentagem: 0
        },
        refis: 0,
        premio: {
            porcentagem: 0,
            valor: 0
        }, 
        distribuicao: {
            pontos: 507.77,
            auditor: 0,
            analista: 0
        }

    }

    receitas.prev.nominal = sumBy(queryPrev, 'nominal')
    receitas.prev.corrigida = sumBy(queryPrev, 'corrigido')
    receitas.curr.nominal = sumBy(queryCurr, 'nominal')
    receitas.curr.corrigida = sumBy(queryCurr, 'corrigido')
    receitas.incremento.valor = receitas.curr.corrigida - receitas.prev.corrigida

    receitas.incremento.valor = receitas.incremento.valor < 0 ? 0 : receitas.incremento.valor
    receitas.incremento.porcentagem = receitas.incremento.valor / receitas.prev.corrigida

    receitas.premio.porcentagem = 0.1

    if(receitas.incremento.porcentagem >= 0.1) {
        receitas.premio.porcentagem = 0.15
    }

    if(receitas.incremento.porcentagem >= 0.06 && receitas.incremento.porcentagem < 0.1) {
        receitas.premio.porcentagem = 0.125
    }

    const valorRefis = await connection.get('valor_refis')

    receitas.refis =  parseFloat(valorRefis||'0')
    receitas.premio.valor = (receitas.premio.porcentagem * receitas.incremento.valor * 0.8) + (receitas.refis * 0.05)

    receitas.distribuicao.auditor = receitas.premio.valor / receitas.distribuicao.pontos * 3
    receitas.distribuicao.analista = receitas.premio.valor / receitas.distribuicao.pontos * 2.1

    res.send(receitas)

    
});

app.get('/ipca', async (_, res) => {
    const data = await database.table('ipca')
        .orderBy('mes', 'desc')

    return data;
});

app.post('/ipca', async (req, res) => {
    const data = req.body as { mes: string, indice: number }

    const update = await database.table('ipca')
        .where('mes', '>=', data.mes)
        .update('indice', data.indice)

    return update;
});

