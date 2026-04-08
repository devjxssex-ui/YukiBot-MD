// setprimary.js - Establecer bot primario del dojo estilo Rock Lee 🍃
import { resolveLidToRealJid } from "../../lib/utils.js"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const getBotsFromFolder = (folderName) => {
  const basePath = path.join(dirname, '../../Sessions', folderName)
  if (!fs.existsSync(basePath)) return []
  return fs.readdirSync(basePath).filter((dir) => fs.existsSync(path.join(basePath, dir, 'creds.json'))).map((id) => id.replace(/\D/g, '') + '@s.whatsapp.net')
}

const getAllowedBots = (mainBotJid) => {
  const subs = getBotsFromFolder('Subs')
  return [...new Set([...subs, mainBotJid])]
}

export default {
  command: ['setprimary', 'setbotprincipal', 'cambiarbot', 'primarybot'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const groupName = groupMetadata?.subject || 'este dojo'
      const mentioned = m.mentionedJid
      const who2 = mentioned.length > 0 ? mentioned[0] : m.quoted?.sender || false
      const who = await resolveLidToRealJid(who2, client, m.chat)
      
      if (!who2) {
        return m.reply(`🍃 *SET BOT PRINCIPAL* 🍃
        
❓ Uso: *${usedPrefix + command} @bot*

📌 Ejemplo: *${usedPrefix + command} @${client.user.id.split(':')[0]}*

💚 *"Un dojo necesita un sensei principal que lo guíe"*`)
      }
      
      const groupParticipants = groupMetadata?.participants?.map((p) => p.phoneNumber || p.jid || p.id || p.lid) || []
      const mainBotJid = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
      const allowedBots = getAllowedBots(mainBotJid)
      const botName = global.db.data.settings[who]?.namebot || who.split('@')[0]
      
      // 🍃 Verificar si es un bot válido
      if (!allowedBots.includes(who)) {
        return m.reply(`🍃 *NO ES UN BOT VÁLIDO* 🍃\n\n❌ El usuario mencionado no es una instancia de Sub-Bot.\n\n💚 *"Solo los aprendices del sensei pueden ser líderes del dojo"*`)
      }
      
      // 🍃 Verificar si está en el grupo
      if (!groupParticipants.includes(who)) {
        return m.reply(`🍃 *BOT NO ENCONTRADO* 🍃\n\n❌ El bot *${botName}* no está presente en este dojo.\n\n💚 *"El sensei debe estar presente para liderar"*`)
      }
      
      // 🍃 Verificar si ya es el principal
      if (chat.primaryBot === who) {
        return m.reply(`🍃 *YA ES EL PRINCIPAL* 🍃\n\n✅ *${botName}* ya es el Sensei principal del dojo *${groupName}*.\n\n💚 *"El líder ya está guiando el camino"*`, { mentions: [who] })
      }
      
      const oldPrimary = chat.primaryBot ? global.db.data.settings[chat.primaryBot]?.namebot || chat.primaryBot.split('@')[0] : 'Ninguno'
      
      await m.reply(`🍃 *CAMBIANDO SENSEI PRINCIPAL* 🍃\n\n⏳ Procesando técnica de liderazgo...\n\n📌 *Dojo:* ${groupName}\n📌 *Anterior sensei:* ${oldPrimary}\n📌 *Nuevo sensei:* ${botName}\n\n💚 *"Un nuevo líder guiará el destino del dojo"*`)
      
      chat.primaryBot = who
      
      const successMsg = `🍃 *SENSEI PRINCIPAL ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei anterior:* ${oldPrimary}
┊  *Nuevo sensei:* ${botName}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora todos los comandos serán ejecutados por ${botName}*
┊➤ *Que su sabiduría guíe a los ninjas del dojo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${botName}, que la juventud te guíe en esta nueva responsabilidad"*`
      
      await m.reply(successMsg, { mentions: [who] })
      
    } catch (e) {
      console.error('Error en setprimary:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al establecer el bot principal.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}