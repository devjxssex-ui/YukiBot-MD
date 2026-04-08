// setgp.js - Cambiar nombre del dojo estilo Rock Lee 🍃
export default {
  command: ['setgpname', 'setnombre', 'cambiarnombre', 'renamegroup'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const newName = args.join(' ').trim()
      const groupMetadata = await client.groupMetadata(m.chat)
      const oldName = groupMetadata.subject || 'este dojo'
      
      if (!newName) {
        return m.reply(`🍃 *CAMBIAR NOMBRE DEL DOJO* 🍃
        
❓ Uso: *${usedPrefix + command} <nuevo nombre>*

📌 Ejemplo: *${usedPrefix + command} Dojo de la Hoja*

📌 *Nombre actual:* ${oldName}

💚 *"Un dojo con un nombre honorable atrae a grandes ninjas"*`)
      }
      
      // 🍃 Validar longitud
      if (newName.length < 3) {
        return m.reply(`🍃 *NOMBRE DEMASIADO CORTO* 🍃\n\n❌ El nombre del dojo debe tener al menos *3 caracteres*.\n\n📌 *Actual:* ${newName.length} caracteres\n\n💚 *"Un nombre ninja debe tener honor"*`)
      }
      
      if (newName.length > 100) {
        return m.reply(`🍃 *NOMBRE DEMASIADO LARGO* 🍃\n\n❌ El nombre del dojo no puede tener más de *100 caracteres*.\n\n📌 *Actual:* ${newName.length} caracteres\n\n💚 *"Un nombre ninja es sabio y conciso"*`)
      }
      
      // 🍃 Validar caracteres prohibidos
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(newName)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre no puede contener: *< > : " / \\ | ? *\n\n💚 *"Un ninja elige nombres con sabiduría"*`)
      }
      
      await m.reply(`🍃 *CAMBIANDO NOMBRE DEL DOJO* 🍃\n\n⏳ Procesando técnica de renombre...\n\n📌 *Nombre anterior:* ${oldName}\n📌 *Nuevo nombre:* ${newName}\n\n💚 *"Un nuevo nombre para un nuevo comienzo"*`)
      
      await client.groupUpdateSubject(m.chat, newName)
      
      const successMsg = `🍃 *DOJO RENOMBRADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Cambio de nombre* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre anterior:* ${oldName}
┊  *Nuevo nombre:* ${newName}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El dojo ha sido renombrado con éxito*
┊➤ *Que el nuevo nombre traiga buena fortuna*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${newName} - Un nombre digno de grandes guerreros"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setgpname:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para cambiar el nombre del dojo.\n\n💚 *"Asegúrate de que el sensei sea administrador"*`)
      }
      
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el nombre del dojo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}