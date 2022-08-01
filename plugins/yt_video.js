import fetch from 'node-fetch'
import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'
import db from '../lib/database.js'

let limit = 500
let handler = async (m, { conn, args, isPrems, isOwner }) => {
  if (!args || !args[0]) return m.reply('Por favor use un link de YouTube')
  global.mcarga('proceso', m, conn)
  let chat = db.data.chats[m.chat]
  const isY = /y(es)/gi.test(args[1])
  const { thumbnail, video: _video, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0])).catch(async _ => await youtubedlv3(args[0]))
  const limitedSize = (isPrems || isOwner ? 2000 : limit) * 1024
  let video, source, res, link, lastError, isLimit
  for (let i in _video) {
    try {
      video = _video[i]
      if (isNaN(video.fileSize)) continue
      isLimit = limitedSize < video.fileSize
      if (isLimit) continue
      link = await video.download()
      if (link) res = await fetch(link)
      isLimit = res?.headers.get('content-length') && parseInt(res.headers.get('content-length')) < limitedSize
      if (isLimit) continue
      if (res) source = await res.arrayBuffer()
      if (source instanceof ArrayBuffer) break
    } catch (e) {
      video = link = source = null
      lastError = e
    }
  }
  if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) return m.reply('[ ! ] Error: ' + (lastError || 'no se pudo descargar el audio'))
  if (!isY && !isLimit) await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', `
*✍️ Titulo:* ${title}
*📲 Tamaño:* ${video.fileSizeH}
*🔗 ${isLimit ? 'Usar ' : ''}Link:* ${link}
`.trim(), m)
  let _thumb = {}
  try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
  catch (e) { }
  if (!isLimit) await conn.sendFile(m.chat, link, title + '.mp4', `
*✍️ Titulo:* ${title}
*📲 Tamaño:* ${video.fileSizeH}
`.trim(), m, false, {
    ..._thumb,
    asDocument: chat.useDocument
  })
}

handler.help = ['mp4', 'v', ''].map(v => 'yt' + v + ` <link>`)
handler.tags = ['servicio']
handler.command = /^yt(v|mp4)?$/i

handler.exp = 0


export default handler
