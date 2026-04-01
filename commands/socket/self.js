// self.js - Modo privado del bot estilo Rock Lee 🍃
export default {
  command: ['self', 'privado', 'modo'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar este modo"*`)
      }
      
      const chat = global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net']
      const estado = chat.self ?? false
      
      // 🍃 Activar modo self
      if (args[0] === 'enable' || args[0] === 'on' || args[0] === 'activar') {
        if (estado) {
          return m.reply(`🍃 *MODO PRIVADO* 🍃\n\n🔒 El modo *Self* ya estaba *activado*.\n\n💚 *"El ninja ya está en entrenamiento solitario"*`)
        }
        chat.self = true
        
        const successMsg = `🍃 *MODO PRIVADO ACTIVADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Modo entrenamiento* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* 🔒 Privado
┊  *Acceso:* Solo el Sensei
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora solo el dueño puede usar el bot*
┊➤ *Usa ${m.usedPrefix}self disable para desactivar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El ninja entrena en soledad para volverse más fuerte"*`
        
        return m.reply(successMsg)
      }
      
      // 🍃 Desactivar modo self
      if (args[0] === 'disable' || args[0] === 'off' || args[0] === 'desactivar') {
        if (!estado) {
          return m.reply(`🍃 *MODO PÚBLICO* 🍃\n\n🔓 El modo *Self* ya estaba *desactivado*.\n\n💚 *"El ninja ya está en modo entrenamiento grupal"*`)
        }
        chat.self = false
        
        const successMsg = `🍃 *MODO PRIVADO DESACTIVADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Modo grupal* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* 🔓 Público
┊  *Acceso:* Todos los ninjas
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora todos pueden usar el bot*
┊➤ *Usa ${m.usedPrefix}self enable para activar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El ninja comparte su entrenamiento con todos"*`
        
        return m.reply(successMsg)
      }
      
      // 🍃 Mostrar estado actual
      const estadoEmoji = estado ? '🔒 Activado' : '🔓 Desactivado'
      const estadoDesc = estado ? 'Solo el Sensei puede usar el bot' : 'Todos los ninjas pueden usar el bot'
      
      const infoMsg = `🍃 *MODO PRIVADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Estado del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Modo:* ${estadoEmoji}
┊  *Acceso:* ${estadoDesc}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Activar:* ${m.usedPrefix}self enable
┊➤ *Desactivar:* ${m.usedPrefix}self disable
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${estado ? 'El sensei entrena en soledad' : 'La juventud explota en equipo'}"*`
      
      return m.reply(infoMsg)
      
    } catch (e) {
      console.error('Error en self:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el modo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}