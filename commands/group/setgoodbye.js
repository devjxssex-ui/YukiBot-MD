
// setgoodbye.js - Establecer mensaje de despedida estilo Rock Lee 🍃
export default {
  command: ['setgoodbye', 'setdespedida', 'mensajedespedida'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!global?.db?.data?.chats) global.db.data.chats = {}
      if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
      const chat = global.db.data.chats[m.chat]
      const value = text ? text.trim() : ''
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR DESPEDIDA* 🍃
        
❓ Uso: *${usedPrefix + command} <mensaje de despedida>*

📌 Variables disponibles:
┊ *{usuario}* - Nombre del ninja que se va
┊ *{grupo}* - Nombre del dojo
┊ *{desc}* - Descripción del dojo

📌 Ejemplo:
*${usedPrefix + command} 🍃 {usuario} ha dejado el dojo {grupo}. ¡Que la fuerza te acompañe! 💚*

💚 *"Una despedida honorable es parte del camino ninja"*`)
      }
      
      // 🍃 Validar longitud
      if (value.length > 500) {
        return m.reply(`🍃 *MENSAJE DEMASIADO LARGO* 🍃\n\n❌ El mensaje de despedida no puede tener más de *500 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa palabras precisas"*`)
      }
      
      const oldMessage = chat.sGoodbye || 'No configurado'
      chat.sGoodbye = value
      
      // 🍃 Vista previa del mensaje con variables de ejemplo
      const preview = value
        .replace(/{usuario}/g, 'Rock Lee')
        .replace(/{grupo}/g, 'Dojo de la Hoja')
        .replace(/{desc}/g, 'Un lugar para entrenar duro')
      
      const successMsg = `🍃 *MENSAJE DE DESPEDIDA ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo configurado* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Mensaje anterior:* ${oldMessage.length > 50 ? oldMessage.slice(0, 47) + '...' : oldMessage}
┊  *Nuevo mensaje:* ${value.length > 50 ? value.slice(0, 47) + '...' : value}
┊┈─────̇─̇─̇─────◯◝
┊「 *Vista previa* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  ${preview}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El mensaje de despedida ha sido configurado*
┊➤ *Se mostrará cuando un ninja abandone el dojo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Una despedida con honor honra al que se va"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setgoodbye:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar el mensaje de despedida.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}