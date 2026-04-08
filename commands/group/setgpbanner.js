// setgpbanner.js - Cambiar imagen del dojo estilo Rock Lee 🍃
export default {
  command: ['setgpbanner', 'setgpicon', 'cambiarbanner', 'cambiaricono'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const q = m.quoted ? m.quoted : m
      const mime = (q.msg || q).mimetype || q.mediaType || ''
      
      if (!/image/.test(mime)) {
        return m.reply(`🍃 *CAMBIAR IMAGEN DEL DOJO* 🍃
        
❓ Uso: Responde a una *imagen* con *${usedPrefix + command}*

📌 Ejemplo: 
┊ *Envía una imagen y responde con ${usedPrefix + command}*

💚 *"Un dojo con una imagen imponente inspira respeto"*`)
      }
      
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      
      await m.reply(`🍃 *ACTUALIZANDO IMAGEN* 🍃\n\n⏳ Procesando técnica de renovación visual...\n\n📌 *Dojo:* ${groupName}\n\n💚 *"Una nueva imagen para un nuevo comienzo"*`)
      
      const img = await q.download()
      if (!img) {
        return m.reply(`🍃 *ERROR DE DESCARGA* 🍃\n\n❌ No se pudo descargar la imagen.\n\n💚 *"Un ninja verifica sus herramientas"*`)
      }
      
      await client.updateProfilePicture(m.chat, img)
      
      const successMsg = `🍃 *IMAGEN DEL DOJO ACTUALIZADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* ✅ Imagen actualizada
┊┈─────̇─̇─̇─────◯◝
┊➤ *El dojo luce un nuevo estandarte*
┊➤ *Que inspire a todos los ninjas que entren*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un dojo con honor se muestra con orgullo"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setgpbanner:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para cambiar la imagen del dojo.\n\n💚 *"Asegúrate de que el sensei sea administrador"*`)
      }
      
      if (errMsg.includes('image') || errMsg.includes('format')) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ La imagen no tiene un formato válido.\n\n📌 *Usa imágenes JPG, PNG o JPEG*\n\n💚 *"Un ninja usa imágenes de calidad"*`)
      }
      
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar la imagen del dojo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}