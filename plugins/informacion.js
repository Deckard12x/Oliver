import Connection from '../lib/connection.js'
import { plugins } from '../lib/plugins.js'
import { cpus as _cpus, totalmem, freemem, platform, type, arch, hostname } from 'os'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import now from 'performance-now'
const { generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessage, proto } = (await import('@adiwajshing/baileys')).default
let format = sizeFormatter({
  std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})
let handler = async (m, { conn }) => {
  const chats = Object.entries(Connection.store.chats).filter(([id, data]) => id && data.isChats)
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) //groups.filter(v => !v.read_only)
  const used = process.memoryUsage()
  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })
  const message = m.reply('_Obteniendo información..._')
  let old = performance.now()
  await message
  let neww = performance.now()
  let speed = neww - old
  let _uptime = process.uptime() * 1000
  let uptime = timeString(process.uptime())
  let more = String.fromCharCode(8206)
  let masss = more.repeat(850)
  var timestamp = now()
try {
    let wimg = await fetch('https://pastebin.com/raw/Bu8esjPA')
    let imgw = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => './multimedia/avatar_contact.png')
    var wjson = await wimg.json()
    var pweb = wjson.nk_media || imgw
    } catch (e) {
    var pweb = await conn.profilePictureUrl(conn.user.jid, 'image').catch(_ => './multimedia/avatar_contact.png')
    }
  let infotext = `
*~》INFORMACIÓN《~*
${masss}
┏─━─━━──━━─━─┓
➪ *Bot : _(activo)_*
➪ *Tiempo de ejecucion : _${uptime}._*
➪ *Apodo en Whatsapp : _${conn.user.name}_*
➪ *Grupos con mayor actividad : _${groupsIn.length}_*
➪ *Grupos nuevos : _${groupsIn.length}_*
➪ *Grupos abandonados : _${groupsIn.length - groupsIn.length}_*
➪ *Chats personales : _${chats.length - groupsIn.length}_*
➪ *Total de chats : _${chats.length}_*
➪ *Menu hits : _${menu_hit.length}_*
➪ *Version del bot : _${BotVersion}_*
➪ *Total de plugins : _${Object.keys(plugins).length}_*
➪ *Velocidad de procesamiento : _${speed} MLS..._*
➪ *Velocidad de conexion: _${now() - timestamp.toFixed(4)} S..._*
➪ *RAM: _${format(totalmem() - freemem())} Restantes De ${format(totalmem())}_*
➪ *Plataforma : _${platform()}_*
➪ *Base OS : _${type()}_*
➪ *Arquitectura : _${arch()}_*
➪ *Host : _${hostname()}_*

➫ _Consumó de memoria :_
${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}
➫ ${cpus[0] ? `_Uso total de CPU_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usado (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
┗─━─「 ✵ 」━─━─┛`.trim()
var wagen = await prepareWAMessageMedia({ image: {url: pweb} }, { upload: conn.waUploadToServer })
const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({ 
templateMessage: { hydratedTemplate: { imageMessage: wagen.imageMessage, hydratedContentText: infotext, hydratedFooterText: NombreBot+` 🔥`, hydratedButtons: [{ urlButton: { displayText: '[ GRACIAS! ]', url: "https://github.com/BochilGaming/games-wabot-md"}}, { urlButton: { displayText: '[ WA-WEB API ]', url: "https://github.com/adiwajshing/Baileys"}}, { urlButton: { displayText: '[ S C - G I T H U B ]', url: "https://github.com/NeKosmic/Quantum-Bot"}}]}}}), { userJid: m.chat, quoted: m })
conn.relayMessage(m.chat, template.message, { messageId: template.key.id })
}

handler.help = ['informacion']
handler.tags = ['casual']
handler.command = /^(informacion|ping|speed|info)$/i

export default handler

function timeString(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " Dia " : " Dias ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " Hora " : " Horas ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " Minuto " : " Minutos ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " Segundo " : " Segundos ") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}
