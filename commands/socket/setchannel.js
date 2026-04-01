// setchannel.js - Configurar canal oficial del bot estilo Rock Lee 🍃
export default {
  command: ['setchannel', 'setbotchannel', 'canal', 'cambiar canal'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar el canal oficial"*`)
      }
      
      const value = args.join(' ').trim()
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR CANAL* 🍃
        
❓ Uso: *${m.usedPrefix}setchannel <enlace del canal de WhatsApp>*

📌 Ejemplo:
*${m.usedPrefix}setchannel https://whatsapp.com/channel/XXXXXXXXXXXXXX*

💚 *"Un ninja siempre tiene un lugar donde compartir sus técnicas"*`)
      }
      
      await m.reply(`🍃 *CONFIGURANDO CANAL* 🍃\n\n⏳ Procesando técnica de conexión...\n\n💚 *"La juventud se comparte en comunidad"*`)
      
      const channelUrl = value.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/channel\/([0-9A-Za-z]{22,24})/i)?.[1]
      
      if (!channelUrl) {
        return m.reply(`🍃 *ENLACE INVÁLIDO* 🍃\n\n❌ El enlace proporcionado no es válido.\n\n📌 *Formato correcto:*\nhttps://whatsapp.com/channel/XXXXXXXXXXXXXX\n\n💚 *"Un ninja verifica sus coordenadas"*`)
      }
      
      try {
        const info = await client.newsletterMetadata("invite", channelUrl)
        
        if (!info) {
          return m.reply(`🍃 *CANAL NO ENCONTRADO* 🍃\n\n❌ No se pudo obtener información del canal.\n\n📌 *Verifica que el enlace sea correcto y que el canal exista*\n\n💚 *"Un ninja busca caminos verdaderos"*`)
        }
        
        const oldChannelName = config.nameid || 'Ninguno'
        const oldChannelId = config.id || 'Ninguno'
        
        config.id = info.id
        config.nameid = info.thread_metadata?.name?.text || "Canal sin nombre"
        
        const successMsg = `🍃 *CANAL ACTUALIZADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Canal oficial del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.botname || 'Rock Lee'}
┊  *Canal anterior:* ${oldChannelName}
┊  *Nuevo canal:* ${config.nameid}
┊  *ID:* ${config.id}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora los mensajes mostrarán este canal*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo hogar para compartir la juventud ninja"*`
        
        return m.reply(successMsg)
        
      } catch (err) {
        console.error('Error obteniendo información del canal:', err)
        return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo obtener información del canal.\n\n📌 *Detalle:* ${err.message?.slice(0, 100) || 'Canal no válido'}\n\n💚 *"Un ninja verifica que su camino sea correcto"*`)
      }
      
    } catch (e) {
      console.error('Error en setchannel:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar el canal.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}