// subbot.js - Crear sub-bots estilo Rock Lee 🍃
import { startSubBot } from '../../lib/subs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
let commandFlags = {}

export default {
  command: ['code', 'qr', 'subbot', 'nuevobot'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const userData = global.db.data.users[m.sender] || {}
      const time = userData.Subs + 120000 || ''
      
      // 🍃 Verificar cooldown
      if (new Date() - (userData.Subs || 0) < 120000) {
        const remainingTime = msToTime(time - new Date())
        return client.reply(m.chat, `🍃 *ESPERA NINJA* 🍃\n\n⏳ Debes esperar *${remainingTime}* para crear un nuevo sub-bot.\n\n💚 *"La paciencia es parte del entrenamiento"*`, m)
      }
      
      // 🍃 Verificar límite de sub-bots
      const subsPath = path.join(dirname, '../../Sessions/Subs')
      const subsCount = fs.existsSync(subsPath)
        ? fs.readdirSync(subsPath).filter((dir) => {
            const credsPath = path.join(subsPath, dir, 'creds.json')
            return fs.existsSync(credsPath)
          }).length : 0
      const maxSubs = 50
      
      if (subsCount >= maxSubs) {
        return client.reply(m.chat, `🍃 *LÍMITE ALCANZADO* 🍃\n\n❌ No hay espacios disponibles para registrar un nuevo sub-bot (máximo ${maxSubs}).\n\n💚 *"El dojo tiene un límite de aprendices"*`, m)
      }
      
      commandFlags[m.sender] = true
      
      // 🍃 Mensajes según el método
      const isCode = /^(code)$/.test(command)
      
      const rtx = `🍃 *VINCULAR SUB-BOT* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Método: Código* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pasos:* 
┊  1. Abre WhatsApp
┊  2. Click en los 3 puntos
┊  3. Dispositivos vinculados
┊  4. Vincular nuevo dispositivo
┊  5. Selecciona "Vincular con número de teléfono"
┊┈─────̇─̇─̇─────◯◝
┊➤ *Este código solo funciona en el número que lo solicita*
┊➤ *Aparecerá en breve...*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo aprendiz se une al dojo"*`
      
      const rtx2 = `🍃 *VINCULAR SUB-BOT* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Método: QR* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pasos:* 
┊  1. Abre WhatsApp
┊  2. Click en los 3 puntos
┊  3. Dispositivos vinculados
┊  4. Vincular nuevo dispositivo
┊  5. Escanea el código QR
┊┈─────̇─̇─̇─────◯◝
┊➤ *No es recomendable usar tu cuenta principal*
┊➤ *El QR aparecerá en breve...*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud explota en nuevos ninjas"*`

      const caption = isCode ? rtx : rtx2
      const phone = args[0] ? args[0].replace(/\D/g, '') : m.sender.split('@')[0]
      
      await m.reply(`🍃 *CREANDO SUB-BOT* 🍃\n\n⏳ Preparando técnica de clonación...\n\n💚 *"Un ninja siempre tiene un aprendiz"*`)
      
      await startSubBot(m, client, caption, isCode, phone, m.chat, commandFlags, true)
      
      // 🍃 Guardar cooldown
      if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
      global.db.data.users[m.sender].Subs = Date.now()
      
      const successMsg = `🍃 *SUB-BOT EN PROCESO* 🍃
      
✅ Sigue las instrucciones para completar la vinculación.
⏳ Tienes 60 segundos para completar el proceso.
💚 *"El aprendiz debe mostrar su determinación"*`
      
      setTimeout(async () => {
        await m.reply(successMsg)
      }, 2000)
      
    } catch (e) {
      console.error('Error en subbot:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al crear el sub-bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
};

function msToTime(duration) {
  if (duration <= 0) return '0 segundos'
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes > 0 ? minutes : ''
  seconds = seconds < 10 && minutes > 0 ? '0' + seconds : seconds
  if (minutes) {
    return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`
  } else {
    return `${seconds} segundo${seconds > 1 ? 's' : ''}`
  }
}