// :D
import Connection from '../lib/connection.js'
import * as fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
	if (!text) return m.reply(`[ ! ] Y el mensaje?`)
  let gmap = Object.entries(Connection.store.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])
  let quoted = m.quoted ? m.quoted : m
  let mime = (quoted.msg || quoted).mimetype || ''
  let isMedia = /image|video|sticker|audio/.test(mime)
  let redes = ['https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA?sub_confirmation=1', 'https://vm.tiktok.com/ZMLjP4RBS/', 'https://fb.watch/b7LOc9_LU2/', 'https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA']
  m.reply(`Enviando transmisión a ${gmap.length} grupo(s), en aproximadamente ${gmap.length * 1.5} segundo(s)`)
if (isMedia) {
var mediax = await quoted.download?.()
for (let i of gmap){
	await delay(5000)
conn.sendMessage(i, { image: mediax, caption: text } ) 
}
m.reply(`Finalizando transmisión a ${gmap.length} grupo(s) ✓`)
}else {
for (let i of gmap){
	await delay(5000)
conn.sendMessage(i, { text: text, contextInfo: { externalAdReply:{title: `[ 📡TRANSMISIÓN 🛰️ ]`,"body":`${NombreBot}`,"previewType":"PHOTO","thumbnail": fs.readFileSync('./multimedia/imagenes/mylogo.jpg'),"sourceUrl": redes[Math.floor(Math.random() * redes.length)]}} } )
}
m.reply(`Finalizando transmisión a ${gmap.length} grupo(s) ✓`)
}
}

handler.help = ['bcgc', 'broadcastgroup'].map(v => v + ' <mensaje>')
handler.tags = ['propietario']
handler.command = /^(bcgc|broadcastgroup)$/i

handler.owner = true

export default handler

const delay = time => new Promise(res => setTimeout(res, time))
