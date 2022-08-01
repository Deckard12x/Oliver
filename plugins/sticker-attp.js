import webp from 'node-webpmux'
import { randomBytes } from 'crypto'

let handler = async (m, { conn, text }) => {
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text
    let attexto = encodeURIComponent(teks)
    var attp2 = await getBuffer(`https://api.xteam.xyz/attp?file&text=${attexto}`)
var stiker = await simpleStk(attp2, '', `[_>] ${NombreBot}`)
conn.sendMessage(m.chat, {sticker: stiker}, {quoted: m})
}
handler.help = ['attp <texto>']
handler.tags = ['conversor']

handler.command = /^attp$/i

export default handler

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)

async function simpleStk(webpSticker, packname, author, categories = [''], extra = {}) {
  const img = new webp.Image();
  const stickerPackId = randomID(32)
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}
