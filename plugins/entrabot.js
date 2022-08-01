import db from '../lib/database.js'

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { conn, text, isOwner }) => {
    let [_, code, expired] = text.match(linkRegex) || []
    if (!code) return m.reply('[ ! ] Error, El link no funciona o es inválido')
    let res = await conn.groupAcceptInvite(code)
    expired = Math.floor(Math.min(999, Math.max(1, isOwner ? isNumber(expired) ? parseInt(expired) : 0 : 3)))
    m.reply(`${NombreBot} se unió al grupo ${res} con éxito \n${expired ? `Durante ${expired} día(24-Horas)` : ''}`)
    let chats = db.data.chats[res]
    if (!chats) chats = db.data.chats[res] = {}
    if (expired) chats.expired = +new Date() + expired * 1000 * 60 * 60 * 24
}

handler.help = ['unete <Link de un grupo>']
handler.tags = ['premium', 'propietario']
handler.command = /^(unete|entrabot|join)$/i

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))