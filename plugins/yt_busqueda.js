import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { conn, usedPrefix, text }) => {
  if (!text) return m.reply('Que esta buscando?')
  global.mcarga('proceso', m, conn)
  const { video, channel } = await youtubeSearch(text)
  const listSections = []
  let teks = [...video, ...channel].map(v => {
    switch (v.type) {
      case 'video': {
        listSections.push([`⚡${v.title}`, [
          ['[ Video 🎥 ]', `${usedPrefix}ytv ${v.url} yes`, `Descargar: (${v.url})`],
          ['[ Audio 🎧 ]', `${usedPrefix}yta ${v.url} yes`, `Descargar: (${v.url})`]
        ]])
        return `
📌 *${v.title}* (${v.url})
⌚ Duración: ${v.durationH}
⏲️ Fecha de subida ${v.publishedTime}
👁️ Vistas ${v.view}
      `.trim()
      }
      case 'channel': return `
📌 *${v.channelName}* (${v.url})
🧑‍🤝‍🧑 _${v.subscriberH}_
🎥 ${v.videoCount} video(s)
`.trim()
    }
  }).filter(v => v).join('\n\n========================\n\n')
  const msg = await m.reply(teks)
  conn.sendList(m.chat, '📺 *Búsqueda en Youtube* 🔎', '\n'+NombreBot+' 🔥', global.wm, 'Lista de descargas', listSections, msg)
}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' <busqueda>')
handler.tags = ['servicio']
handler.command = /^yts(earch)?$/i

export default handler
