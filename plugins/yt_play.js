import fetch from 'node-fetch'
import { youtubeSearch } from '@bochilteam/scraper'

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return m.reply(`Ejemplo de uso ${usedPrefix}${command} maincra`)
  let playtext = encodeURIComponent(text)
  global.mcarga('proceso', m, conn)
  let vid = (await youtubeSearch(playtext)).video[0]
  if (!vid) return m.reply('Vídeo/Audio no encontrado')
  let { title, thumbnail, videoId, duration } = vid
  let url = 'https://www.youtube.com/watch?v=' + videoId
  let ytres = await fetch('https://latam-api.vercel.app/api/ytmp3?apikey='+MyApiKey+'&q='+url)
  let apiytdl = await ytres.json()
await conn.sendMessage(m.chat, {text: `\`\`\`Enviando audio, espere...\`\`\``, contextInfo:{"externalAdReply":{"title": `${title}`,"body": `1:23 ━━━━●───────── ${duration}`,"previewType": "PHOTO","thumbnailUrl": thumbnail, "thumbnail": ``,"sourceUrl": apiytdl.descarga }}}, {quoted: m })
conn.sendMessage(m.chat, { audio: { url: apiytdl.descarga }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
}

handler.help = ['play']
handler.tags = ['servicio']
handler.command = /^play$/i

handler.exp = 0
handler.limit = false

export default handler