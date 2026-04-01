// events.js - Eventos del bot estilo Rock Lee 🍃
import fetch from 'node-fetch'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const defaultImage = path.join(__dirname, '../assets/images/default-profile.jpg')

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const chat = global?.db?.data?.chats?.[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants.length      
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return
      for (const p of anu.participants) {
        const jid = p.phoneNumber
        const phone = p.phoneNumber?.split('@')[0] || jid.split('@')[0]
        
        // 🍃 IMAGEN LOCAL en lugar de URL externa
        const pp = await client.profilePictureUrl(jid, 'image').catch(() => {
          return fs.existsSync(defaultImage) ? defaultImage : null
        })
        
        const mensajes = { 
          add: chat.sWelcome ? `\n┊➤ ${chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '', 
          remove: chat.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '', 
          leave: chat.sGoodbye ? `\n┊➤ ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '✿ Sin Desc ✿')}` : '' 
        }

        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId]?.id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId]?.nameid || 'Rock Lee Bot 🍃'
            },
            externalAdReply: {
              title: global.db.data.settings[botId]?.namebot || 'Rock Lee Bot',
              body: global.dev || '🍃 El ninja de la hoja verde',
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId]?.icon || '',
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"]?.link || '',
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }

        // 🍃 BIENVENIDA
        if (anu.action === 'add' && chat?.welcome && (!primaryBotId || primaryBotId === botId)) {
          const caption = `🍃 *¡BIENVENIDO AL DOJO!* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Bienvenido ${metadata.subject}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa !menu para ver las técnicas ninja.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud explota!"*`
         await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })     
        }

        // 🍃 DESPEDIDA
        if ((anu.action === 'remove' || anu.action === 'leave') && chat?.goodbye && (!primaryBotId || primaryBotId === botId)) {
          const caption = `🍃 *¡HASTA PRONTO!* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Hasta pronto ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre ›* @${phone}
┊  *Grupo ›* ${metadata.subject}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ojalá que vuelvas pronto a entrenar.*
┊➤ *Ahora somos ${memberCount} miembros.* ${mensajes[anu.action]}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💪 *"Un ninja verdadero nunca se rinde!"*`
          await client.sendMessage(anu.id, { image: { url: pp }, caption, ...fakeContext })
        }

        // 🍃 PROMOVER
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { 
            text: `🍃 *ASCENSO EN EL DOJO* 🍃\n\n⚡ *@${phone}* ha sido promovido a *Administrador* por *@${usuario.split('@')[0]}*\n\n💚 *"El trabajo duro vence al talento!"*`, 
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] 
          })
        }

        // 🍃 DEGRADAR
        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { 
            text: `🍃 *DEGRADACIÓN* 🍃\n\n⚡ *@${phone}* ha sido degradado de *Administrador* por *@${usuario.split('@')[0]}*\n\n💚 *"Sigue entrenando, algún día volverás a ser admin"*`, 
            mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] 
          })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`🍃 Evento error: ${err}`))
    }
  })

  client.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m.messageStubType) return
  const id = m.key.remoteJid
  const chat = global.db.data.chats[id]
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  const primaryBotId = chat?.primaryBot
  if (!chat?.alerts || (primaryBotId && primaryBotId !== botId)) return
  const isSelf = global.db.data.settings[botId]?.self ?? false
  if (isSelf) return
  const actor = m.key?.participant || m.participant || m.key?.remoteJid
  const phone = actor.split('@')[0]
  const groupMetadata = await client.groupMetadata(id).catch(() => null)
  const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []

  // 🍃 CAMBIO DE NOMBRE
  if (m.messageStubType == 21) {
    await client.sendMessage(id, { 
      text: `🍃 *CAMBIO DE NOMBRE* 🍃\n\n⚡ *@${phone}* cambió el nombre del dojo a:\n📛 *${m.messageStubParameters[0]}*\n\n💚 *"La juventud explota!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }

  // 🍃 CAMBIO DE ICONO
  if (m.messageStubType == 22) {
    await client.sendMessage(id, { 
      text: `🍃 *CAMBIO DE ICONO* 🍃\n\n⚡ *@${phone}* cambió el ícono del dojo.\n\n💚 *"El trabajo duro vence al talento!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }

  // 🍃 CAMBIO DE ENLACE
  if (m.messageStubType == 23) {
    await client.sendMessage(id, { 
      text: `🍃 *ENLACE RENOVADO* 🍃\n\n⚡ *@${phone}* restableció el enlace del grupo.\n\n💚 *"Un ninja verdadero nunca se rinde!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }

  // 🍃 CAMBIO DE DESCRIPCIÓN
  if (m.messageStubType == 24) {
    await client.sendMessage(id, { 
      text: `🍃 *CAMBIO DE DESCRIPCIÓN* 🍃\n\n⚡ *@${phone}* cambió la descripción del dojo.\n\n💚 *"La juventud nunca falla!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }

  // 🍃 CAMBIO DE CONFIGURACIÓN
  if (m.messageStubType == 25) {
    await client.sendMessage(id, { 
      text: `🍃 *CONFIGURACIÓN ACTUALIZADA* 🍃\n\n⚡ *@${phone}* cambió los ajustes: ahora ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} pueden configurar el grupo.\n\n💚 *"El poder de la juventud!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }

  // 🍃 CAMBIO DE MENSAJES
  if (m.messageStubType == 26) {
    await client.sendMessage(id, { 
      text: `🍃 *GRUPO ACTUALIZADO* 🍃\n\n⚡ *@${phone}* cambió los ajustes: ahora ${m.messageStubParameters[0] === 'on' ? 'solo administradores pueden enviar mensajes' : 'todos los miembros pueden enviar mensajes'}.\n\n💚 *"Sigue entrenando duro!"*`, 
      mentions: [actor, ...groupAdmins.map(v => v.id)] 
    })
  }
})
}