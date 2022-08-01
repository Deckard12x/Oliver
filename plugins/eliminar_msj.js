let handler = function (m, { conn }) {
    if (!m.quoted) throw false
    let { chat, fromMe, isBaileys } = m.quoted
    if (!fromMe) throw false
    if (!isBaileys) return m.reply(`*[ ! ] Esta accion solo puede usarse respondiendo un mensaje reciente del bot*`)
    conn.sendMessage(chat, { delete: m.quoted.vM.key })
}

handler.help = ['suprimir']
handler.tags = ['propietario']
handler.command = /^(suprimir)$/i

export default handler