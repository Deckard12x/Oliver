// TODO: fix jadibot

import Connection from '../lib/connection.js'
import Store from '../lib/store.js'
import qrcode from 'qrcode'
import ws from 'ws'

const { DisconnectReason } = await import('@adiwajshing/baileys')

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
    /** @type {import('../lib/connection').Socket} */
    let parent = args[0] && args[0] == 'plz' ? _conn : await Connection.conn
    if (!((args[0] && args[0] == 'plz') || (await Connection.conn).user.jid == _conn.user.jid)) {
        return m.reply('No puedes ser un bot dentro de un subbot!\n\nhttps://wa.me/' + (await Connection.conn).user.jid.split`@`[0] + '?text='+usedPrefix+'nuebot')
    }

    const id = Connection.conns.size
    const auth = Store.useMemoryAuthState()
    const store = Store.makeInMemoryStore()
    const conn = await Connection.start(null, {
        isChild: true,
        connectionOptions: { auth: auth.state },
        store
    })
    const logout = async () => {
        await parent.sendMessage(conn.user?.jid || m.chat, { text: '[ ! ] Conexión perdida T~T' })
        try { conn.ws.close() } catch { }
        Connection.conns.delete(id)
    }
    let lastQr, shouldSendLogin, errorCount = 0
    conn.ev.on('connection.update', async ({ qr, isNewLogin, lastDisconnect }) => {
        if (shouldSendLogin && conn.user) {
            await parent.sendMessage(conn.user.jid, { text: 'Conectado con éxito con WhatsApp - mu.\n*NOTA: Esto es solo un paseo*\n' + JSON.stringify(conn.user, null, 2) }, { quoted: m })
        }
        if (qr) {
            if (lastQr) lastQr.delete()
            lastQr = await parent.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), 'qrcode.png', `
Escanea este QR para convertirte en un bot temporal, como hacerlo?
Pasos a seguir en WhatsApp:
1. Haga clic en los tres puntos en la esquina superior derecha
2. Toca en dispositivos vinculados
3. Escanea este QR (Antes de que expire)

Por favor no use este comando si no sabe como usarlo
`.trim(), m)
        }
        if (isNewLogin)
            shouldSendLogin = true

        if (lastDisconnect) {
            const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (code && code !== DisconnectReason.loggedOut && conn?.ws.readyState !== ws.CONNECTING) {
                console.log(await Connection.reload(conn, true, { isChild: true }).catch(console.error))
            } else if (code == DisconnectReason.loggedOut)
                logout()
            errorCount++;
        }

        if (errorCount > 5)
            logout()

    })

    Connection.conns.set(id, conn)
}


handler.help = ['serbot']
handler.tags = ['esclabot']
handler.command = /^(serbot)|(jadibot)$/i

handler.disabled = true //Deshabilitado :v
handler.limit = true

export default handler