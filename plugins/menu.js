import db from '../lib/database.js'
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import { plugins } from '../lib/plugins.js'
import fetch from 'node-fetch';
import { generateWAMessage } from "@adiwajshing/baileys"
import * as fs from 'fs'
let tags = {
  //'contenido': 'Principal',
  'conversor': '_CONVERSORES :_',
  'utilidad': '_PASATIEMPO :_',
  'animeuwu': '_ANIME :_',
  'casual': '_CMDS-CASUAL :_',
  'propietario': '_CMDS DUEÑO :_',
  'herramienta': '_HERRAMIENTAS :_',
  'premium': '_PREMIUM :_',
  'esclabot': '_SER SUB-BOT :_',
  'avanzado': '_AVANZADO :_',
  'admins': '_CMDS ADMINS :_',
  'grupos': '_CMDS GRUPOS :_',
  'fabricar': '_ARTE Y DISEÑO :_',
  'servicio': '_SERVICIOS :_',
  'xp': '_XP & LIMITE :_',
  'rpg': '_RPG GAMES :_',
  '': '_SIN CATEGORÍA :_',
}
global.menu_hit = []
let handler = async (m, { conn, usedPrefix: _p, __dirname, command }) => {
	try {
    let wimg = await fetch('https://pastebin.com/raw/GZ8d1qcT')
    let imgw = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png')
    var wjson = await wimg.json()
    var pweb = wjson.nk_media || imgw
    var textweb = wjson.nk_txt
    } catch (e) {
    var pweb = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
    var textweb = ''
    }
    m.reply(`_Cargando menu..._ ${textweb}`)
    menu_hit.push(command)
    try {
    let datcov = await fetch('https://latam-api.vercel.app/api/covid19?apikey=nekosmic&q=world');
	let CovidApi = await datcov.json();
	var cotext = `┏「 DATOS - COVID19 」┓
┃➲ Casos positivos : ${CovidApi.casos}
┃✯ Recuperados : ${CovidApi.recuperados}
┃❥ Tratados : ${CovidApi.activo}
┃✞ Fallecidos : ${CovidApi.muertes}
┗─━─━「 🌎 」━─━─┛`
    } catch (e) {
    var cotext = NombreBot+' 🔥'
    }
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level, role } = db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = timeString(process.uptime())
    let totalreg = Object.keys(db.data.users).length
    let rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
    let help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `By https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limitado)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      prop: global.Propietario,
      pref: ' '+global.Prefijo+' ',
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[ URL de github inválido ]',
      level, limit, name, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    conn.sendHydrated(m.chat, text.trim(), cotext, pweb, 'https://github.com/NeKosmic/Quantum-Bot', 'Regalame una estrella :3', null, null, [
      ['[ CREADOR ]', Prefijo+`creador`],
      ['[ APOYO ]', Prefijo+`apoyo`],
      ['[ INFORMACION ]', Prefijo+`informacion`]
    ], m)
    let settingstatus = 0;
    if (new Date() * 1 - settingstatus > 1000) {
    	await conn.query({tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status', }, content: [{ tag: 'status', attrs: {}, content: Buffer.from(`<[ Quantum|Bot ]>\nTiempo activo : `+uptime+global.noPriv, 'utf-8')}]}).catch((_) => _);
    settingstatus = new Date() * 1;
    }
  } catch (e) {
    conn.reply(m.chat, '[ ! ] Ocurrio un error en el menú :/ ', m)
    throw e
  }
}
const defaultMenu = {
  before: `
< [ \`\`\`%npmname\`\`\` ] >

╔I [_>]
║❂ Base de datos : %rtotalreg a %totalreg
║❂ Tiempo activo : %uptime
║❂ Version del bot : %version
║❂ Dueño : %prop
║❂ Prefijo único : 「 %pref 」
║❂ Cliente : %name
║❂ Limite restante : %limit
║❂ Rol del Cliente : %role
╚══════════
%readmore
~|-------------------------|~
⮕ *_COMANDOS_  ☷*
~|-------------------------|~\n`.trimStart(),
  header: '╔「 %category 」\n║╭—————————',
  body: '║├  %cmd %islimit %isPremium',
  footer: '║╰—————————\n╚══════════\n',
  after: ``,
}
handler.help = ['menu', 'help', '?']
//handler.tags = ['contenido']
handler.command = /^(menu|help|\?)$/i

handler.exp = 3

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(850)

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

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
