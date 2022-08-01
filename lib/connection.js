// @ts-check
import * as ws from 'ws'
import path from 'path'
import storeSystem from './store.js'
import Helper from './helper.js'
import { HelperConnection } from './simple.js'
import importFile from './import.js'
import db, { loadDatabase } from './database.js'
import fs from 'fs'
import chalk from 'chalk'

/** @type {import('@adiwajshing/baileys')} */
// @ts-ignore
const { DisconnectReason, default: makeWASocket } = (await import('@adiwajshing/baileys')).default

const authFolder = 'sesiones'
const storeFile = `${Helper.opts._[0] || 'datos'}.store.json` //store.json
const authState = await storeSystem.useMultiFileAuthState(authFolder)
const store = storeSystem.makeInMemoryStore()

/** @type {import('@adiwajshing/baileys').UserFacingSocketConfig} */
const connectionOptions = {
    printQRInTerminal: true,
    browser: ['<[ Quantum-bot ]>', 'Chrome', '3.0'],
    auth: authState.state,
    // logger: pino({ level: 'trace' })
}

store.readFromFile(storeFile)

/** 
 * @typedef {{ handler?: typeof import('../handler').handler, participantsUpdate?: typeof import('../handler').participantsUpdate, groupsUpdate?: typeof import('../handler').groupsUpdate, onDelete?:typeof import('../handler').deleteUpdate, connectionUpdate?: typeof connectionUpdate, credsUpdate?: () => void }} EventHandlers
 * 
 * @typedef {ReturnType<makeWASocket> & { isInit?: boolean, isReloadInit?: boolean, msgqueque?: import('./queque').default } & EventHandlers} Socket 
 */


/** @type {Map<string, Socket>} */
let conns = new Map();
/** 
 * @param {Socket?} oldSocket 
 * @param {{ handler?: typeof import('../handler'), isChild?: boolean, connectionOptions?: import('@adiwajshing/baileys').UserFacingSocketConfig, store: typeof store }} opts
 */
async function start(oldSocket = null, opts = { store }) {
    /** @type {Socket} */
    let conn = makeWASocket({
        ...connectionOptions,
        ...opts.connectionOptions,
        getMessage: async (key) => (opts.store.loadMessage(/** @type {string} */(key.remoteJid), key.id) || opts.store.loadMessage(/** @type {string} */(key.id)) || {}).message || { conversation: 'Por favor, envíe mensajes de nuevo' },
    })
    global.teslagod = conn
    HelperConnection(conn)

    if (oldSocket) {
        conn.isInit = oldSocket.isInit
        conn.isReloadInit = oldSocket.isReloadInit
    }
    if (conn.isInit == null) {
        conn.isInit = false
        conn.isReloadInit = true
    }

    store.bind(conn.ev, {
        groupMetadata: conn.groupMetadata
    })
    await reload(conn, false, opts).then((success) => console.log(chalk.bgWhite('Evento controlador de enlace : ', success+'\n'))) //No entendí :v

    return conn
}


let OldHandler = null
/** 
 * @param {Socket} conn 
 * @param {boolean} restartConnection
 * @param {{ handler?: PromiseLike<typeof import('../handler')> | typeof import('../handler'), isChild?: boolean }} opts
 */
async function reload(conn, restartConnection, opts = {}) {
    if (!opts.handler) opts.handler = importFile(Helper.__filename(path.resolve('./handler.js'))).catch(console.error)
    if (opts.handler instanceof Promise) opts.handler = await opts.handler;
    if (!opts.handler && OldHandler) opts.handler = OldHandler
    OldHandler = opts.handler
    // const isInit = !!conn.isInit
    const isReloadInit = !!conn.isReloadInit
    if (restartConnection) {
        try { conn.ws.close() } catch { }
        // @ts-ignore
        conn.ev.removeAllListeners()
        Object.assign(conn, await start(conn) || {})
    }

    // Assign message like welcome, bye, etc.. to the connection
    Object.assign(conn, getMessageConfig())

    if (!isReloadInit) {
        if (conn.handler) conn.ev.off('messages.upsert', conn.handler)
        if (conn.participantsUpdate) conn.ev.off('group-participants.update', conn.participantsUpdate)
        if (conn.groupsUpdate) conn.ev.off('groups.update', conn.groupsUpdate)
        if (conn.onDelete) conn.ev.off('messages.delete', conn.onDelete)
        if (conn.connectionUpdate) conn.ev.off('connection.update', conn.connectionUpdate)
        if (conn.credsUpdate) conn.ev.off('creds.update', conn.credsUpdate)
    }
    if (opts.handler) {
        conn.handler = /** @type {typeof import('../handler')} */(opts.handler).handler.bind(conn)
        conn.participantsUpdate = /** @type {typeof import('../handler')} */(opts.handler).participantsUpdate.bind(conn)
        conn.groupsUpdate = /** @type {typeof import('../handler')} */(opts.handler).groupsUpdate.bind(conn)
        conn.onDelete = /** @type {typeof import('../handler')} */(opts.handler).deleteUpdate.bind(conn)
    }
    if (!opts.isChild) conn.connectionUpdate = connectionUpdate.bind(conn)
    conn.credsUpdate = authState.saveCreds.bind(conn)

    // @ts-ignore
    conn.ev.on('messages.upsert', conn.handler)
    // @ts-ignore
    conn.ev.on('group-participants.update', conn.participantsUpdate)
    // @ts-ignore
    conn.ev.on('groups.update', conn.groupsUpdate)
    // @ts-ignore
    conn.ev.on('messages.delete', conn.onDelete)
    // @ts-ignore
    if (!opts.isChild) conn.ev.on('connection.update', conn.connectionUpdate)
    // @ts-ignore
    conn.ev.on('creds.update', conn.credsUpdate)

    conn.isReloadInit = false
    return true

}

/**
 * @this {Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['connection.update']} update
 */
async function connectionUpdate(update) {
    console.log(update)
    // /** @type {Partial<{ connection: import('@adiwajshing/baileys').ConnectionState['connection'], lastDisconnect: { error: Error | import('@hapi/boom').Boom, date: Date }, isNewLogin: import('@adiwajshing/baileys').ConnectionState['isNewLogin'] }>} */
    const { connection, lastDisconnect, isNewLogin } = update
    if (isNewLogin) this.isInit = true
    // @ts-ignore
    if (connection == 'connecting') {
console.log(chalk.blue('\nCONECTANDO... U.U\n'));
} else if (connection === 'close') {
console.log(chalk.blue('\n[!] Conexion perdida, vuelva a intentarlo... :(\n'));
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (code && code !== DisconnectReason.loggedOut && this?.ws.readyState !== ws.CONNECTING) {
        console.log(await reload(this, true).catch(console.error))
        global.timestamp.connect = new Date
    }
}
if (connection === 'open') {
teslagod.sendMessage(`51995386439@s.whatsapp.net`, {text: `\n⚡ Wenas!, acabó de conectarme correctamente :D\n`, contextInfo:{"externalAdReply":{"title": `Gracias por usar este bot!!!`,"body": `Usuario : ${global.teslagod.user.name}`,"previewType": "PHOTO","thumbnailUrl": ``,"thumbnail": fs.readFileSync('./src/mylogo.jpg'),"sourceUrl": `https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA?sub_confirmation=1`}}}, {quoted: null });
teslagod.groupAcceptInvite('GtxTtrORaAaDdDWBGGX5R5').catch(e => {  });
console.log(chalk.green('\n[_>] CONECTADO :D\n'));
if (db.data == null) loadDatabase()
}
}

function getMessageConfig() {
    const welcome = '⚡ *Bienvenid@ @user a este grandioso grupo!*\n🍷 _*Espero y te agrade tu estancia aqui, no olvides respetar a los participantes y las reglas*_ ;)\n\n📜 *Normas del grupo actualmente :* \n'+String.fromCharCode(8206).repeat(850)+'\n@desc'
    const bye = '[ ! ] C fue alv : @user'
    const spromote = '@user Ahora es admin!'
    const sdemote = '@user Ya no es admin'
    const sDesc = 'La descripción fue actualizada \n@desc'
    const sSubject = 'El nombre del grupo fue cambiado \n@subject'
    const sIcon = 'Imagen del grupo actualizada correctamente!'
    const sRevoke = 'El link del grupo fue actualizado \n@revoke'

    return {
        welcome,
        bye,
        spromote,
        sdemote,
        sDesc,
        sSubject,
        sIcon,
        sRevoke
    }
}

const conn = start(null, { store }).catch(console.error)

export default {
    start,
    reload,
    conn,
    conns,
    connectionOptions,
    authFolder,
    storeFile,
    authState,
    store,
    getMessageConfig
}
