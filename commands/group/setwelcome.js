// setwelcome.js - Establecer mensaje de bienvenida estilo Rock Lee 🍃
export default {
  command: ['setwelcome', 'setbienvenida', 'mensajebienvenida'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!global?.db?.data?.chats) global.db.data.chats = {}
      if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
      const chat = global.db.data.chats[m.chat]
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const groupName = groupMetadata?.subject || 'este dojo'
      const value = text ? text.trim() : ''
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR BIENVENIDA* 🍃
        
❓ Uso: *${usedPrefix + command} <mensaje de bienvenida>*

📌 Variables disponibles:
┊ *{usuario}* - Nombre del nuevo ninja
┊ *{grupo}* - Nombre del dojo
┊ *{desc}* - Descripción del dojo

📌 Ejemplo:
*${usedPrefix + command} 🍃 ¡Bienvenido {usuario} al dojo {grupo}! La juventud explota! 💚*

💚 *"Una buena bienvenida da inicio a un gran entrenamiento"*`)
      }
      
      // 🍃 Validar longitud
      if (value.length > 500) {
        return m.reply(`🍃 *MENSAJE DEMASIADO LARGO* 🍃\n\n❌ El mensaje de bienvenida no puede tener más de *500 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa palabras sabias y concisas"*`)
      }
      
      const oldMessage = chat.sWelcome || 'No configurado'
      chat.sWelcome = value
      
      // 🍃 Vista previa del mensaje con variables de ejemplo
      const preview = value
        .replace(/{usuario}/g, 'Rock Lee')
        .replace(/{grupo}/g, groupName)
        .replace(/{desc}/g, groupMetadata?.desc || 'Un lugar para entrenar duro')
      
      const successMsg = `🍃 *MENSAJE DE BIENVENIDA ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Mensaje anterior:* ${oldMessage.length > 50 ? oldMessage.slice(0, 47) + '...' : oldMessage}
┊  *Nuevo mensaje:* ${value.length > 50 ? value.slice(0, 47) + '...' : value}
┊┈─────̇─̇─̇─────◯◝
┊「 *Vista previa* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  ${preview}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El mensaje de bienvenida ha sido configurado*
┊➤ *Se mostrará cuando un nuevo ninja se una al dojo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Una cálida bienvenida fortalece el espíritu del dojo"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setwelcome:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar el mensaje de bienvenida.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}