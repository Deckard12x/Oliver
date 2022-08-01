import db from '../lib/database.js'

const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = db.data.chats[m.chat]
    let bot = db.data.settings[this.user.jid] || {}
    const isGroupLink = linkRegex.exec(m.text)

    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return m.reply('Joder, lo weno es que el link detectado es de este grupo owo')
        }
        await conn.sendButton(m.chat, `*[ ! ] Link detectado [ ! ]*\n`, `${isBotAdmin ? '' : '_Por suerte no soy acmin, asi que no puedo hacer nada :v'}`, ['[ Desactivar antilink ]', Prefijo+'apagar antilink'], m)
        if (isBotAdmin && bot.restrict) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } else if (!bot.restrict) return m.reply('Para realizar acciones de eliminación, mi dueño tiene que encender el modo restringido!')
    }
    return !0
}