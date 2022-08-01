import fetch from 'node-fetch'
import * as fs from 'fs'

let handler = async (m, { conn, command }) => {
	let etiqueta = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
	let name = await conn.getName(m.sender)
	let rand = ['737000000000000', '69000000000', '707000000000000000'] //bytes
	let resimg = await fetch('https://latam-api.vercel.app/api/'+command+'?apikey='+MyApiKey)
	let json = await resimg.json()
	conn.sendMessage(m.chat, { image: {url: json.imagen}, caption: `┏━⊱ Imagen : ${command}\n┗⊱ Solicitada por : @${etiqueta.replace(/@.+/, '')}`, fileLength: rand[Math.floor(Math.random() * (rand.length))], mentions: [m.sender] }, { ephemeralExpiration: 24*3600, quoted: {key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "51995386439-1604595598@g.us"}, "message": {orderMessage: {itemCount: 737,status: 200, thumbnail: fs.readFileSync('./multimedia/imagenes/mylogo.jpg'), surface: 200, message: `${name} [_>] ${command}`, orderTitle: 'Matt_M', sellerJid: '0@s.whatsapp.net'}}} })
	}

handler.help = ['waifu_hd', 'rostro_4k']
handler.tags = ['animeuwu']
handler.command = /^(waifu_hd)|(rostro_4k)$/i

export default handler