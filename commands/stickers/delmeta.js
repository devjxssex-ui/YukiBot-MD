// delmeta.js - Eliminar metadatos de stickers estilo Rock Lee 🍃
export default {
  command: ['delmeta', 'delstickermeta', 'borrarmeta'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db.data
      const userData = db.users[m.sender] || {}
      
      // Verificar si tiene metadatos
      const hasPackname = userData.metadatos && userData.metadatos !== ''
      const hasAuthor = userData.metadatos2 && userData.metadatos2 !== ''
      
      if (!hasPackname && !hasAuthor) {
        return m.reply(`🍃 *SIN METADATOS* 🍃\n\n❌ No tienes metadatos asignados en tus stickers.\n\n📌 *Usa:* ${usedPrefix}setmeta <autor|pack>\n\n💚 *"Un ninja siempre personaliza sus herramientas!"*`)
      }
      
      // Guardar nombre antes de eliminar (para mensaje)
      const oldPackname = userData.metadatos || ''
      const oldAuthor = userData.metadatos2 || ''
      
      // Eliminar metadatos
      db.users[m.sender].metadatos = ''
      db.users[m.sender].metadatos2 = ''
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *METADATOS ELIMINADOS* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Stickers reseteados* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pack anterior:* ${oldPackname || 'Sin pack'}
┊  *Autor anterior:* ${oldAuthor || 'Sin autor'}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora tus stickers serán genéricos*
┊➤ *Usa ${usedPrefix}setmeta para personalizar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja siempre renueva sus técnicas!"*`
      
      await client.sendMessage(m.chat, { text: successMsg }, { quoted: m })
      
    } catch (e) {
      console.error('Error en delmeta:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al eliminar los metadatos.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}