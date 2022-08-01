import db from '../lib/database.js'

let handler = async (m, { text, conn }) => {
    let user = db.data.users[m.sender]
    if (!text) return m.reply(`Por favor diga su motivo para irse AFK\nEjemplo de uso : \n${Prefijo}afk iré al baño`)
    if (text.length < 10) return m.reply(`[ ! ] El motivo es muy corto`)
    user.afk = + new Date
    user.afkReason = text
    m.reply(`*Se activo la función AFK exitosamente*\n\n➸ *Usuario*: ${conn.getName(m.sender)}\n➸ *Razon*: ${text}`)
}

handler.help = ['afk [razon]']
handler.tags = ['utilidad']
handler.command = /^afk$/i

export default handler