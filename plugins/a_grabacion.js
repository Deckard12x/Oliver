import { toPTT } from '../lib/converter.js'
import * as fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, text }) => {
	let redes = ['https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA?sub_confirmation=1', 'https://vm.tiktok.com/ZMLjP4RBS/', 'https://fb.watch/b7LOc9_LU2/', 'https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA']
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return m.reply(`Envie ó Responda un (video/grabación) con el comando:\n\n${usedPrefix + command}`)
    let media = await q.download?.()
    if (!media) return m.reply('No se pudo descargar el archivo')
    let audio = await toPTT(media, 'mp4')
    if (!audio.data) return m.reply('No se pudo convertir a audio')
    conn.sendMessage(m.chat, { audio: audio.data, contextInfo: {externalAdReply:{title: `🎶 ${NombreBot} 🎤`,"body": `Convertido a grabación ✓`,"previewType":"PHOTO","thumbnail": fs.readFileSync('./multimedia/imagenes/mylogo.jpg'),"sourceUrl": redes[Math.floor(Math.random() * redes.length)]}}, mimetype: 'audio/mp4', fileName: `${text ? text : 'audio'}.mp3`, ptt:true }, { quoted: m })
}

handler.help = ['aptt']
handler.tags = ['conversor']
handler.command = /^a(vn|(ptt)?)$/i

export default handler