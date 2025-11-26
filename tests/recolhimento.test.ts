import { expect, test } from 'bun:test'
import { updateRecolhimento } from '../src/tasks/task-recolhimentos'

const codigos = [{ "codigo": "1112500100" }, { "codigo": "1112500200" }, { "codigo": "1112530100" }, { "codigo": "1112530200" }, { "codigo": "1114511100" }, { "codigo": "1114511200" }, { "codigo": "921112500100" }, { "codigo": "921112500200" }, { "codigo": "921112530100" }, { "codigo": "921112530200" }, { "codigo": "921114511100" }, { "codigo": "921114511200" }, { "codigo": "981112500100" }, { "codigo": "981112500200" }, { "codigo": "981112530100" }, { "codigo": "981114511100" }, { "codigo": "981112530200" }, { "codigo": "981114511200" }]
    .map(({ codigo }) => codigo)

test('obter recolhimenots', async () => {
    const rec = await updateRecolhimento("2025-07-01", "1114511000", codigos)



    expect(rec).toBeTrue()
})