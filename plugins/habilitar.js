import db from '../lib/database.js'
import fs from 'fs'
import { generateWAMessageFromContent, WAProto } from "@adiwajshing/baileys"
import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner, groupMetadata }) => {
  let isEnable = /true|encender|(turn)?on|1/i.test(command)
  let chat = db.data.chats[m.chat]
  let user = db.data.users[m.sender]
  let bot = db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  let etiqueta = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = await conn.getName(m.sender)
  let nwn = [`Hola`, `Wenas`, `Que tal`, `Hi`, `Hello`, `Olá`, `Namaste`, `Hey!`, `Aloha`, `Konnichi wa`, `Mi king`, `Que hay`, `Como estas`, `Oi`, `Joder Buenas`]
  let uwu = nwn[Math.floor(Math.random() * (nwn.length))]
  let sections = [{
	title: "[ ⬇️ BIENVENIDA AUTOMÁTICA ]",
	rows: [{
			title: "[ 🛬 Activar ]",
			description: "~ᴱˡ ᵇᵒᵗ ᵈᵃʳᵃ́ ᵇᶦᵉⁿᵛᵉⁿᶦᵈᵃ ᵃ ˡᵒˢ ⁿᵘᵉᵛᵒˢ ᵖᵃʳᵗᶦᶜᶦᵖᵃⁿᵗᵉˢ ᵉⁿ ᵘⁿ ᵍʳᵘᵖᵒ~",
			rowId: `${usedPrefix}encender bienvenida`
		},
		{
			title: "[ 🛫 Desactivar ]",
			description: "~ᴺᵒ ˢᵉ ᵈᵃʳᵃ́ ᵇᶦᵉⁿᵛᵉⁿᶦᵈᵃ ᵃ ˡᵒˢ ⁿᵘᵉᵛᵒˢ ᵖᵃʳᵗᶦᶜᶦᵖᵃⁿᵗᵉˢ ᵉⁿ ᵘⁿ ᵍʳᵘᵖᵒ~",
			rowId: `${usedPrefix}apagar bienvenida`
		}
	]
},
{
	title: "[ ⬇️ ANTI - LINK ]",
	rows: [{
			title: "[ 🗡️ Activar ]",
			description: "~ᴱˡ ᵇᵒᵗ ᵉˡᶦᵐᶦⁿᵃʳᵃ́ ᵃˡ ᵖᵃʳᵗᶦᶜᶦᵖᵃⁿᵗᵉ ᑫᵘᵉ ᵉⁿᵛᶦ́ᵉ ᵘⁿ ˡᶦⁿᵏ ᵉⁿ ᵘⁿ ᵍʳᵘᵖᵒ~",
			rowId: `${usedPrefix}encender antilink`
		},
		{
			title: "[ 😴 Desactivar ]",
			description: "~ᴺᵒ ˢᵉ ʳᵉᵃˡᶦᶻᵃʳᵃ́ ⁿᶦⁿᵍᵘⁿᵃ ᵃᶜᶜᶦᵒ́ⁿ ᶜᵘᵃⁿᵈᵒ ˢᵉ ᵉⁿᵛᶦ́ᵉⁿ ˡᶦⁿᵏˢ~",
			rowId: `${usedPrefix}apagar antilink`
		}
	]
},
{
	title: "[ ⬇️ MODO DE USO ]",
	rows: [{
			title: "[ 🏬 Público ]",
			description: "~ᴹᵒᵈᵒ ᵖᵘᵇˡᶦᶜᵒ ᵃᶜᵗᶦᵛᵃᵈᵒ ᵃʰᵒʳᵃ ᵗᵒᵈᵒˢ ˡᵒˢ ᵘˢᵘᵃʳᶦᵒˢ ᵖᵒᵈʳᵃⁿ ᵘˢᵃʳ ᵃˡ ᵇᵒᵗ~",
			rowId: `${usedPrefix}encender publico`
		},
		{
			title: "[ 🏡 Privado ]",
			description: "~ᴹᵒᵈᵒ ᵖʳᶦᵛᵃᵈᵒ ᵃᶜᵗᶦᵛᵃᵈᵒ ᵃʰᵒʳᵃ ˢᵒˡᵒ ᵉˡ ᵈᵘᵉⁿ̃ᵒ ᵈᵉˡ ᵇᵒᵗ ᵖᵒᵈʳᵃ ᵘˢᵃʳˡᵒ~",
			rowId: `${usedPrefix}apagar publico`
		}
	]
},
{
	title: "[ ⬇️ MODO RESTRINGIDO ]",
	rows: [{
			title: "[ 🌚 Activado ]",
			description: "~ᴬᶜᵗᶦᵛᵃ ˡᵃ ᶠᵘⁿᶜᶦᵒ́ⁿ ᵖᵃʳᵃ ᵉˡᶦᵐᶦⁿᵃʳ ᵖᵃʳᵗᶦᶜᶦᵖᵃⁿᵗᵉˢ ᵉⁿ ᵍʳᵘᵖᵒˢ⁽ᴺᵒ ʳᵉᶜᵒᵐᵉⁿᵈᵃᵇˡᵉ⁾~",
			rowId: `${usedPrefix}encender restringir`
		},
		{
			title: "[ 🌝 Desactivado ]",
			description: "~ᴬᶜᶜᶦᵒⁿᵉˢ ᵈᵉ ᵉˡᶦᵐᶦⁿᵃʳ ʸ ᵃᵍʳᵉᵍᵃʳ ᵖᵃʳᵗᶦᶜᶦᵖᵃⁿᵗᵉˢ ᵈᵉˢᵃᶜᵗᶦᵛᵃᵈᵃ⁽ʳᵉᶜᵒᵐᵉⁿᵈᵃᵇˡᵉ⁾~",
			rowId: `${usedPrefix}apagar restringir`
		}
	]
},
{
	title: "[ ⬇️ MODO SIN BOT ]",
	rows: [{
			title: "[ 🙈 Activar ]",
			description: "~ˢᵒˡᵒ ᶦᵐᵖʳᶦᵐᵉ ˡᵒˢ ᵐᵉⁿˢᵃʲᵉˢ ʳᵉᶜᶦᵇᶦᵈᵒˢ ʸ ᵃᵍʳᵉᵍᵃ ᵘˢᵘᵃʳᶦᵒˢ ᵃ ˡᵃ ᵇᵃˢᵉ ᵈᵉ ᵈᵃᵗᵒˢ~",
			rowId: `${usedPrefix}encender atender`
		},
		{
			title: "[ 🙉 Desactivar ]",
			description: "~ᶜᵒᵐᵉⁿᶻᵃʳᵃ́ ᵃ ᶜᵘᵐᵖˡᶦʳ ᶜᵒⁿ ˡᵃˢ ᶠᵘⁿᶜᶦᵒⁿᵉˢ ˢᵒˡᶦᶜᶦᵗᵃᵈᵃˢ~",
			rowId: `${usedPrefix}apagar atender`
		}
	]
},
{
	title: "[ ⬇️ ANTI - PRIVADO ]",
	rows: [{
			title: "[ 💔 Activar ]",
			description: "~ᴬʰᵒʳᵃ ᵗᵒᵈᵒ ᵃᑫᵘᵉˡ ᑫᵘᵉ ʰᵃᵇˡᵉ ᵃˡ ᵇᵒᵗ ᵖᵒʳ ᵖʳᶦᵛᵃᵈᵒ ˢᵉʳᵃ ᵇˡᵒᑫᵘᵉᵃᵈᵒ~",
			rowId: `${usedPrefix}encender noprivado`
		},
		{
			title: "[ ❤️ Desactivar ]",
			description: "~ᴹᵒᵈᵒ ᴬⁿᵗᶦ⁻ᴾʳᶦᵛᵃᵈᵒ ᵈᵉˢᵃᶜᵗᶦᵛᵃᵈᵒ~",
			rowId: `${usedPrefix}apagar noprivado`
		}
	]
},
{
	title: "[ ⬇️ ANTI - ELIMINADO ]",
	rows: [{
			title: "[ ♻️ Activar ]",
			description: "~ᵀᵒᵈᵒ ᵐᵉⁿˢᵃʲᵉ ᵉˡᶦᵐᶦⁿᵃᵈᵒ ˢᵉʳᵃ́ ʳᵉᶜᵘᵖᵉʳᵃᵈᵒ ᵃᵘᵗᵒᵐᵃ́ᵗᶦᶜᵃᵐᵉⁿᵗᵉ~",
			rowId: `${usedPrefix}encender antidelete`
		},
		{
			title: "[ 🗑️ Desactivar ]",
			description: "~ᴸᵒˢ ᵐᵉⁿˢᵃʲᵉˢ ᵉˡᶦᵐᶦⁿᵃᵈᵒˢ ⁿᵒ ˢᵉʳᵃ́ⁿ ʳᵉᶜᵘᵖᵉʳᵃᵈᵒˢ~",
			rowId: `${usedPrefix}encender delete`
		}
	]
},
{
	title: "[ ⬇️ AUTO - LEER ]",
	rows: [{
			title: "[ 🤓 Leer ]",
			description: "~ᴱˡ ᵇᵒᵗ ᶜᵒᵐᵉⁿᶻᵃʳᵃ́ ᵃ ᵐᵃʳᶜᵃʳ ˡᵒˢ ᶜʰᵃᵗˢ ᶜᵒᵐᵒ ˡᵉᶦ́ᵈᵒˢ~",
			rowId: `${usedPrefix}encender autoleer`
		},
		{
			title: "[ 😵 No-Leer ]",
			description: "~ᴱˡ ᵇᵒᵗ ⁿᵒ ˡᵉᵉʳᵃ́ ˡᵒˢ ᶜʰᵃᵗˢ~",
			rowId: `${usedPrefix}apagar autoleer`
		}
	]
},
{
	title: "[ ⬇️ AUTO - NIVELEAR ]",
	rows: [{
			title: "[ 👑 Activar ]",
			description: "~ᴸᵒˢ ᵘˢᵘᵃʳᶦᵒˢ ᵖᵒᵈʳᵃⁿ ᵃ ˢᵘᵇᶦʳ ᵈᵉ ⁿᶦᵛᵉˡ ᵃᵘᵗᵒᵐᵃ́ᵗᶦᶜᵃᵐᵉⁿᵗᵉ~",
			rowId: `${usedPrefix}encender autolevelup`
		},
		{
			title: "[ 🎓 Desactivar ]",
			description: "~ᴸᵒˢ ᵘˢᵘᵃʳᶦᵒˢ ʸᵃ ⁿᵒ ᵖᵒᵈʳᵃⁿ ᵃ ˢᵘᵇᶦʳ ᵈᵉ ⁿᶦᵛᵉˡ~",
			rowId: `${usedPrefix}apagar autolevelup`
		}
	]
}, ]
  switch (type) {
    case 'bienvenida' : {
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
}
break
    case 'publico': case 'público':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['self'] = !isEnable
      break
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break
    case 'restringir':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break
    case 'atender':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['nyimak'] = isEnable
      break
    case 'autoleer':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['autoread'] = isEnable
      break
    case 'noprivado':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      global.opts['gconly'] = isEnable
      global.noPriv = opts['gconly'] ? '| No chat privados' : ''
      break
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = isEnable
      break
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.delete = !isEnable
      break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    default:
      if (!/[01]/.test(command)) return await conn.sendMessage(m.chat, { text: '┗⊱ Aqui tiene la lista de opciones :3', footer: '\n'+moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM/YY'), title: `┏━━⊱「 ${uwu} ${name}! 」`, buttonText: " Seleccione aqui ✓ ", sections }, { quoted: { key : { participant : '0@s.whatsapp.net' }, message: { orderMessage: { itemCount : 707, itemCoun : 404, surface : 404, message: Propietario, orderTitle: 'B', thumbnail: null, sellerJid: '0@s.whatsapp.net' }}} })
      throw false
  }
  conn.sendMessage(m.chat, { text: `\n@${etiqueta.replace(/@.+/, '')} ${isEnable ? 'activó' : 'desactivó'} *${type}* exitosamente ${isAll ? 'para este bot' : isUser ? '' : 'para este chat'}\n`, mentions: [m.sender] }, {ephemeralExpiration: 24*3600,quoted: {key : {participant : '0@s.whatsapp.net'},message: {documentMessage: {title: `${isEnable ? '[✓]' : '[X]'}`,jpegThumbnail: null }}}})
}

handler.help = ['encender', 'apagar'].map(v => v + ' <opción>')
handler.tags = ['grupos', 'propietario']
handler.command = /^((encender|apagar)|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

export default handler
