// delwarn.js - Eliminar advertencias estilo Rock Lee 🍃
import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['delwarn', 'borrarwarn', 'eliminarwarn', 'limpiarwarn'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args) => {
    try {
      const chat = global.db.data.chats[m.chat]
      const mentioned = m.mentionedJid || []
      const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : false)
      
      if (!who2) {
        return m.reply(`🍃 *ELIMINAR ADVERTENCIA* 🍃
        
❓ Uso: *${m.usedPrefix}delwarn @usuario <índice|all>*

📌 Ejemplos:
┊ *${m.usedPrefix}delwarn @usuario 1* (elimina advertencia #1)
┊ *${m.usedPrefix}delwarn @usuario all* (elimina todas)

💚 *"Un ninja aprende de sus errores y sigue adelante"*`)
      }
      
      const targetId = await resolveLidToRealJid(who2, client, m.chat)
      const user = chat.users[targetId]
      
      if (!user) {
        return m.reply(`🍃 *NINJA NO ENCONTRADO* 🍃\n\n❌ No se encontró al ninja en la base de datos.\n\n💚 *"Todo ninja comienza su entrenamiento"*`)
      }
      
      const total = user?.warnings?.length || 0
      const userName = global.db.data.users[targetId]?.name || 'Ninja'
      const userMention = `@${targetId.split('@')[0]}`
      
      if (total === 0) {
        return m.reply(`🍃 *SIN ADVERTENCIAS* 🍃\n\n✅ El ninja ${userMention} no tiene advertencias registradas.\n\n💚 *"Un ninja honorable sigue el camino correcto"*`, { mentions: [targetId] })
      }
      
      const rawIndex = mentioned.length > 0 ? args[1] : args[0]
      
      // 🍃 Eliminar todas las advertencias
      if (rawIndex?.toLowerCase() === 'all') {
        user.warnings = []
        const successMsg = `🍃 *ADVERTENCIAS ELIMINADAS* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Perdón ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* ${userName}
┊  *Advertencias eliminadas:* ${total}
┊  *Estado:* ✅ Limpio
┊┈─────̇─̇─̇─────◯◝
┊➤ *El ninja ha purificado su camino*
┊➤ *Oportunidad para empezar de nuevo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Todo ninja merece una segunda oportunidad"*`
        return m.reply(successMsg, { mentions: [targetId] })
      }
      
      // 🍃 Validar índice
      const index = parseInt(rawIndex)
      if (isNaN(index)) {
        return m.reply(`🍃 *ÍNDICE INVÁLIDO* 🍃
        
❓ Uso: *${m.usedPrefix}delwarn @usuario <índice|all>*

📌 *Advertencias actuales:* ${total}

💡 *Ejemplos:*
┊ *${m.usedPrefix}delwarn @usuario 1* (elimina #1)
┊ *${m.usedPrefix}delwarn @usuario all* (elimina todas)

💚 *"Un ninja elige con sabiduría"*`)
      }
      
      if (index < 1 || index > total) {
        return m.reply(`🍃 *ÍNDICE FUERA DE RANGO* 🍃\n\n❌ El índice debe ser un número entre *1* y *${total}*.\n\n📌 *Advertencias actuales:* ${total}\n\n💚 *"La memoria ninja es precisa"*`)
      }
      
      const realIndex = total - index
      const removedWarning = user.warnings[realIndex]
      user.warnings.splice(realIndex, 1)
      
      // 🍃 Mensaje de éxito
      const remaining = user.warnings.length
      const motivo = removedWarning?.reason || 'Sin motivo registrado'
      const fecha = removedWarning?.date ? new Date(removedWarning.date).toLocaleDateString('es-MX') : 'Fecha desconocida'
      
      const successMsg = `🍃 *ADVERTENCIA ELIMINADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Perdón ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* ${userName}
┊  *Advertencia #${index}:* ${motivo}
┊  *Fecha:* ${fecha}
┊  *Advertencias restantes:* ${remaining}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El ninja ha sido perdonado*
┊➤ *${remaining === 0 ? 'Ahora tiene un récord limpio' : `Le quedan ${remaining} advertencia(s)`}*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${remaining === 0 ? 'Un nuevo comienzo para el ninja' : 'Sigue entrenando, la redención está cerca'}"*`
      
      return m.reply(successMsg, { mentions: [targetId] })
      
    } catch (e) {
      console.error('Error en delwarn:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al eliminar la advertencia.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}