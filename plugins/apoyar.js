import { generateWAMessageFromContent, generateWAMessage } from '@adiwajshing/baileys'
import * as fs from 'fs'

let handler = async (m, { conn, usedPrefix }) => {
let more = String.fromCharCode(8206)
let masss = more.repeat(850)
conn.createMessage = async (jidnya, kontennya, optionnya) => {
        return await generateWAMessage(jidnya, kontennya, {...optionnya,userJid: conn.authState.creds.me.id,upload: conn.waUploadToServer})
}
let linkButt = async (id, text1, desc1, yo) => {
let genMess = await generateWAMessageFromContent(m.chat, {
    "templateMessage": {
      "hydratedTemplate": {
        ...yo.message,
        "hydratedContentText": text1,
        "hydratedFooterText": desc1,
        "hydratedButtons": [
          {
            "urlButton": {
              "displayText": "YouTube [ > ]",
              "url": "https://youtube.com/channel/UC_Pp8pT9vbT15k5_-i6oseA"
            }
          },
          {
            "urlButton": {
              "displayText": "Tik-Tok [Ꮄ]",
              "url": "https://vm.tiktok.com/ZMLjUL3sW/"
            }
          },
          {
            "urlButton": {
              "displayText": "Facebook [ f ]",
              "url": "https://fb.watch/b7tHGEpS3m/"
            }
          }
        ]
      }
    }
  }, {})
conn.relayMessage(id, genMess.message, { messageId: genMess.key.id })
}
await linkButt(m.chat, `💻 *Redes sociales* 📲\n${masss}\n`+TusRedesSociales, "ᴺᵒ ᵖᶦᵈᵒ ᵈᶦⁿᵉʳᵒ• ˢᵒˡᵒ ᶜᵒⁿ ᵗᵘ ᵃᵖᵒʸᵒ ˢᵒʸ ᶠᵉˡᶦᶻ ⁿʷⁿ", await conn.createMessage(m.chat, {image: fs.readFileSync('./multimedia/imagenes/mylogo.jpg'), caption: `💻 *Redes sociales* 📲\n${masss}\n`+TusRedesSociales }))
}

handler.help = ['apoyo']
handler.tags = ['casual']
handler.command = /^(apoyo|donar|donasi|dono)$/i

export default handler
