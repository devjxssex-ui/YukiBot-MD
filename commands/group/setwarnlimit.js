// setwarnlimit.js - Establecer límite de advertencias estilo Rock Lee 🍃
export default {
  command: ['setwarnlimit', 'setlimite', 'limitewarn', 'configurarwarn'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args) => {
    try {
      const chat = global.db.data.chats[m.chat]
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const groupName = groupMetadata?.subject || 'este dojo'
      const raw = args[0]
      const limit = parseInt(raw)
      
      // 🍃 Mostrar estado actual
      if (!args.length) {
        const estadoActual = chat.expulsar 
          ? `✅ Activado (límite: *${chat.warnLimit}* advertencias)` 
          : `❌ Desactivado`
        
        return m.reply(`🍃 *LÍMITE DE ADVERTENCIAS* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado actual:* ${estadoActual}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Activar:* ${usedPrefix}setwarnlimit <1-10>
┊➤ *Desactivar:* ${usedPrefix}setwarnlimit 0
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja debe conocer los límites del dojo"*`)
      }
      
      // 🍃 Validar límite
      if (isNaN(limit) || limit < 0 || limit > 10) {
        return m.reply(`🍃 *LÍMITE INVÁLIDO* 🍃
        
❓ El límite debe ser un número entre *1* y *10*, o *0* para desactivar.

📌 Ejemplos:
┊ *${usedPrefix}setwarnlimit 5* (activa con 5 advertencias)
┊ *${usedPrefix}setwarnlimit 0* (desactiva la función)

📌 *Estado actual:* ${chat.expulsar ? `\`${chat.warnLimit}\` advertencias` : '`Desactivado`'}

💚 *"Un ninja sabio establece límites justos"*`)
      }
      
      // 🍃 Desactivar función
      if (limit === 0) {
        chat.warnLimit = 0
        chat.expulsar = false
        
        const successMsg = `🍃 *FUNCIÓN DESACTIVADA* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* ❌ Desactivado
┊  *Límite:* Sin límite
┊┈─────̇─̇─̇─────◯◝
┊➤ *Los ninjas ya no serán expulsados automáticamente*
┊➤ *Las advertencias seguirán registrándose*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La misericordia también es parte del camino ninja"*`
        
        return m.reply(successMsg)
      }
      
      // 🍃 Activar función con límite
      chat.warnLimit = limit
      chat.expulsar = true
      
      const successMsg = `🍃 *LÍMITE DE ADVERTENCIAS ACTIVADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Límite:* ${limit} advertencias
┊  *Acción:* Expulsión automática
┊┈─────̇─̇─̇─────◯◝
┊➤ *Los ninjas serán expulsados al alcanzar ${limit} advertencias*
┊➤ *Usa ${usedPrefix}warn @user para advertir*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La disciplina mantiene el orden en el dojo"*`
      
      await m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setwarnlimit:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al establecer el límite de advertencias.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}