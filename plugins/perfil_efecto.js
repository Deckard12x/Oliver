let handler = async (m, { conn, command }) => {
	let etiqueta = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let encUrl = encodeURIComponent(await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'))
    let img = 'https://some-random-api.ml/canvas/'+command+'?avatar='+encUrl
    conn.sendMessage(m.chat, { image: {url: img}, caption: `*┏━> Efecto de perfil* : _${command}_
*┗> Solicitado por* : _@${etiqueta.replace(/@.+/, '')}_`, mentions: [etiqueta] }, { quoted: m })
}

handler.help = ['lolice', 'gay', 'triggered']
handler.tags = ['fabricar']

handler.command = /^(lolice)|(gay)|(triggered)$/i

export default handler