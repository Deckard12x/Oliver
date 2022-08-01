//Nidea :v
import { generateWAMessageFromContent } from '@adiwajshing/baileys'
let handler = async (m, { conn, text, participants }) => {
  let users = participants.map(u => conn.decodeJid(u.id))
  let quoted = m.quoted ? m.quoted : m
  let mime = (quoted.msg || quoted).mimetype || ''
  let isMedia = /image|video|sticker|audio/.test(mime)
  let more = String.fromCharCode(8206)
  let masss = more.repeat(850)
  let htextos = `${text ? text : "ˢᵉˣʸ ᴱˡ ᑫᵘᵉ ᴸᵒ ᴸᵉᵃ ⁷ʷ⁷"}`
if ((isMedia && quoted.mtype === 'imageMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { image: mediax, mentions: users, caption: htextos }, {quoted: m })
} else if ((isMedia && quoted.mtype === 'videoMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { video: mediax, mentions: users, mimetype: 'video/mp4', caption: htextos }, {quoted: m })
} else if ((isMedia && quoted.mtype === 'audioMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, { audio: mediax, mentions: users, mimetype: 'audio/mp4', fileName: `HidetagXD.mp3` }, {quoted: m })
} else if ((isMedia && quoted.mtype === 'stickerMessage') && htextos) {
var mediax = await quoted.download?.()
conn.sendMessage(m.chat, {sticker: mediax, mentions: users })
} else {
await conn.sendMessage(m.chat, { text : `${masss}\n${htextos}\n`, mentions: users })
}
}

handler.help = ['.', 'totag', 'hidetag'].map(v => v + ' [mensaje]')
handler.tags = ['grupos', 'admins']
handler.command = /^(.|totag|hidetag)$/i

handler.group = true
handler.admin = true

export default handler

