// bot.js - Activar/desactivar bot en grupos estilo Rock Lee 🍃
export default {
  command: ['bot', 'activar', 'desactivar'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    try {
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const botSettings = global.db.data.settings[botId] || {}
      const botname = botSettings.namebot || 'Rock Lee'
      const chat = global.db.data.chats[m.chat]
      const estado = chat.isBanned ?? false
      
      // 🍃 Desactivar bot
      if (args[0] === 'off' || args[0] === 'disable' || args[0] === 'desactivar') {
        if (estado) {
          return m.reply(`🍃 *BOT DESACTIVADO* 🍃\n\n❌ El bot *${botname}* ya estaba *desactivado* en este dojo.\n\n💚 *"El sensei ya estaba en silencio"*`)
        }
        chat.isBanned = true
        
        const successMsg = `🍃 *BOT DESACTIVADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo en silencio* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* ${botname}
┊  *Estado:* 🔇 Desactivado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha entrado en meditación*
┊➤ *Usa ${m.usedPrefix}bot on para activarlo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El silencio también es parte del entrenamiento"*`
        
        return m.reply(successMsg)
      }
      
      // 🍃 Activar bot
      if (args[0] === 'on' || args[0] === 'enable' || args[0] === 'activar') {
        if (!estado) {
          return m.reply(`🍃 *BOT ACTIVADO* 🍃\n\n✅ El bot *${botname}* ya estaba *activado* en este dojo.\n\n💚 *"El sensei ya está presente"*`)
        }
        chat.isBanned = false
        
        const successMsg = `🍃 *BOT ACTIVADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo activo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* ${botname}
┊  *Estado:* 🔊 Activado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha despertado de su meditación*
┊➤ *Usa ${m.usedPrefix}menu para ver las técnicas*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud explota nuevamente en el dojo"*`
        
        return m.reply(successMsg)
      }
      
      // 🍃 Mostrar estado actual
      const estadoEmoji = estado ? '🔇 Desactivado' : '🔊 Activado'
      const estadoDesc = estado ? 'El sensei está en meditación, no responde a comandos' : 'El sensei está presente, listo para entrenar'
      
      const infoMsg = `🍃 *ESTADO DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${botname}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* ${estadoEmoji}
┊  *Descripción:* ${estadoDesc}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Activar:* ${m.usedPrefix}bot on
┊➤ *Desactivar:* ${m.usedPrefix}bot off
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${estado ? 'El sensei descansa, pero siempre vuelve' : 'El sensei está listo para enseñar nuevas técnicas'}"*`
      
      return m.reply(infoMsg)
      
    } catch (e) {
      console.error('Error en bot:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el estado del bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}