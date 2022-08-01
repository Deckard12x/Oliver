import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return m.reply(`Ejemplo de uso ${usedPrefix}${command} maincra`)
  let playtext = encodeURIComponent(text)
  global.mcarga('proceso', m, conn)
  let vid = (await youtubeSearch(playtext)).video[0]
  if (!vid) return m.reply('Vídeo/Audio no encontrado')
  let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId
  await conn.sendHydrated(m.chat, `
✍️ *Titulo:* ${title}
📆 *Fecha de subida:* ${publishedTime}
⏰ *Duracion:* ${durationH}
👀 *Vistas:* ${viewH}
📜 *Descripcion:* ${description}
  `.trim(), NombreBot+' 🔥', thumbnail, url, 'Ver en Youtube 📺', null, null, [
    ['[ Audio 🎧 ]', `${usedPrefix}yta ${url} yes`],
    ['[ Video 🎥 ]', `${usedPrefix}ytv ${url} yes`],
    ['[ Buscar en Youtube 🔎 ]', `${usedPrefix}yts ${url}`]
  ], m)
}
handler.help = ['play2'].map(v => v + ' <busqueda>')
handler.tags = ['servicio']
handler.command = /^play2$/i

handler.exp = 0
handler.limit = false

export default handler

