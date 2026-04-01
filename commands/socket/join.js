// join.js - Unir bot a grupos estilo Rock Lee 🍃
export default {
  command: ['join', 'unir', 'entrar'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede invocar esta técnica"*`)
      }
      
      if (!args[0]) {
        return m.reply(`🍃 *UNIR AL GRUPO* 🍃\n\n❓ Uso: *${m.usedPrefix}join <enlace del grupo>*\n\n📌 Ejemplo: *${m.usedPrefix}join https://chat.whatsapp.com/xxxxxxxxxx*\n\n💚 *"Un ninja siempre sabe a dónde ir"*`)
      }
      
      const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
      const match = args[0].match(linkRegex)
      
      if (!match || !match[1]) {
        return m.reply(`🍃 *ENLACE INVÁLIDO* 🍃\n\n❌ El enlace ingresado no es válido o está incompleto.\n\n📌 *Formato correcto:* https://chat.whatsapp.com/xxxxxxxxxx\n\n💚 *"Un ninja verifica sus coordenadas"*`)
      }
      
      await m.reply(`🍃 *ENTRANDO AL DOJO* 🍃\n\n⏳ Procesando técnica de teletransporte...\n\n💚 *"La juventud nunca falla!"*`)
      
      try {
        const inviteCode = match[1]
        await client.groupAcceptInvite(inviteCode)
        
        const successMsg = `🍃 *UNIDO AL GRUPO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Misión completada* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* ${config.botname || 'Rock Lee'}
┊  *Estado:* ✅ Conectado
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora soy parte de este dojo*
┊➤ *Usa !menu para ver las técnicas disponibles*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja siempre encuentra su camino"*`
        
        await client.reply(m.chat, successMsg, m)
        
      } catch (e) {
        const errMsg = String(e.message || e)
        
        if (errMsg.includes('not-authorized') || errMsg.includes('requires-admin')) {
          await m.reply(`🍃 *SOLICITUD ENVIADA* 🍃\n\n⏳ La unión requiere aprobación de administrador.\n\n📌 Espera a que acepten tu solicitud en el grupo.\n\n💚 *"La paciencia es virtud ninja"*`)
        } else if (errMsg.includes('not-in-group') || errMsg.includes('removed')) {
          await m.reply(`🍃 *NO SE PUDO UNIR* 🍃\n\n❌ No se pudo unir al grupo porque el bot fue eliminado recientemente.\n\n📌 *Espera 24 horas antes de intentarlo de nuevo*\n\n💚 *"Un ninja respeta los tiempos del dojo"*`)
        } else if (errMsg.includes('invalid') || errMsg.includes('expired')) {
          await m.reply(`🍃 *ENLACE EXPIRADO* 🍃\n\n❌ El enlace ha expirado o no es válido.\n\n📌 *Solicita un nuevo enlace al administrador*\n\n💚 *"Un ninja usa herramientas actualizadas"*`)
        } else {
          await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo unir al grupo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
        }
      }
      
    } catch (e) {
      console.error('Error en join:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al intentar unirte al grupo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}