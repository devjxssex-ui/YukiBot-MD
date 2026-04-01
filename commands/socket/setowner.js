// setowner.js - Configurar dueño del bot estilo Rock Lee 🍃
import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['setbotowner', 'setowner', 'sensei', 'cambiarsensei'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* actual del dojo.\n\n💚 *"Solo el sensei puede nombrar a su sucesor"*`)
      }
      
      const text = args.join(' ').trim()
      const actual = config.owner || ''
      
      // 🍃 Opción clear - eliminar dueño
      if (text.toLowerCase() === 'clear') {
        if (!actual) {
          return m.reply(`🍃 *SIN SENSEI* 🍃\n\n❌ No hay ningún sensei asignado actualmente.\n\n💚 *"El dojo espera a su líder"*`)
        }
        const oldOwner = actual.split('@')[0]
        config.owner = ''
        return m.reply(`🍃 *SENSEI REMOVIDO* 🍃\n\n✅ Se ha eliminado al sensei *@${oldOwner}* del dojo.\n\n💚 *"El dojo busca un nuevo líder"*`, { mentions: [actual] })
      }
      
      // 🍃 Obtener el nuevo dueño
      const mentionedJid = m.mentionedJid || []
      const who2 = mentionedJid.length > 0 ? mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
      const who = who2 ? await resolveLidToRealJid(who2, client, m.chat) : null
      const limpio = text.replace(/[^0-9]/g, '')
      const nuevo = who || (limpio.length >= 10 ? (limpio.startsWith('52') && limpio.length === 12 ? `52${limpio[2] !== '1' ? '1' : ''}${limpio.slice(2)}@s.whatsapp.net` : `${limpio}@s.whatsapp.net`) : null)
      
      // 🍃 Si ya hay dueño y no se especifica nuevo
      if (actual && ((!m.quoted && mentionedJid.length === 0 && !text) || (nuevo && actual === nuevo))) {
        const currentOwner = actual.split('@')[0]
        return m.reply(`🍃 *SENSEI ACTUAL* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Líder del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* @${currentOwner}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Para cambiar:* ${usedPrefix + command} @${idBot.split('@')[0]}
┊➤ *Para eliminar:* ${usedPrefix + command} clear
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El sensei guía el camino del dojo"*`, { mentions: [actual, idBot] })
      }
      
      if (!nuevo) {
        return m.reply(`🍃 *NOMBRAR SENSEI* 🍃
        
❓ Uso: *${usedPrefix + command} @usuario*

📌 Ejemplo: *${usedPrefix + command} @${idBot.split('@')[0]}*

💚 *"Un sensei debe ser elegido con honor"*`, { mentions: [idBot] })
      }
      
      const ownerActual = actual ? actual.split('@')[0] : null
      const ownerNuevo = nuevo.split('@')[0]
      config.owner = nuevo
      
      // 🍃 Mensaje de éxito
      let successMsg
      let mentionsList = [nuevo]
      
      if (actual && actual !== nuevo) {
        successMsg = `🍃 *SENSEI CAMBIADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nuevo líder del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Anterior sensei:* @${ownerActual}
┊  *Nuevo sensei:* @${ownerNuevo}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El dojo tiene un nuevo líder*
┊➤ *Que la juventud te guíe, sensei*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo camino comienza para el dojo"*`
        mentionsList.push(actual)
      } else {
        successMsg = `🍃 *SENSEI ASIGNADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Líder del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* @${ownerNuevo}
┊  *Dojo:* ${config.namebot || 'Rock Lee Bot'}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Bienvenido sensei, guía este dojo con honor*
┊➤ *Usa !menu para ver las técnicas*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El dojo ahora tiene un líder digno"*`
      }
      
      return m.reply(successMsg, { mentions: mentionsList })
      
    } catch (e) {
      console.error('Error en setowner:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el sensei.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}