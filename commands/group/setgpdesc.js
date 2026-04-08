// setgpdesc.js - Cambiar descripción del dojo estilo Rock Lee 🍃
export default {
  command: ['setgpdesc', 'setdescripcion', 'cambiardesc', 'renombrardesc'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const newDesc = args.join(' ').trim()
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      const oldDesc = groupMetadata.desc || 'Sin descripción'
      
      if (!newDesc) {
        return m.reply(`🍃 *CAMBIAR DESCRIPCIÓN DEL DOJO* 🍃
        
❓ Uso: *${usedPrefix + command} <nueva descripción>*

📌 Ejemplo: 
*${usedPrefix + command} Un lugar donde los ninjas entrenan duro para alcanzar la gloria. La juventud explota! 💚*

📌 *Descripción actual:* ${oldDesc.length > 50 ? oldDesc.slice(0, 47) + '...' : oldDesc}

💚 *"Una descripción con honor refleja la grandeza del dojo"*`)
      }
      
      // 🍃 Validar longitud (máximo 512 caracteres para descripción de grupo)
      if (newDesc.length < 10) {
        return m.reply(`🍃 *DESCRIPCIÓN DEMASIADO CORTA* 🍃\n\n❌ La descripción debe tener al menos *10 caracteres*.\n\n📌 *Actual:* ${newDesc.length} caracteres\n\n💚 *"Un dojo merece una descripción con honor"*`)
      }
      
      if (newDesc.length > 512) {
        return m.reply(`🍃 *DESCRIPCIÓN DEMASIADO LARGA* 🍃\n\n❌ La descripción no puede tener más de *512 caracteres*.\n\n📌 *Actual:* ${newDesc.length} caracteres\n\n💚 *"Un ninja escribe con sabiduría y concisión"*`)
      }
      
      // 🍃 Validar caracteres prohibidos
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(newDesc)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ La descripción no puede contener: *< > : " / \\ | ? *\n\n💚 *"Un ninja escribe con palabras sabias"*`)
      }
      
      await m.reply(`🍃 *ACTUALIZANDO DESCRIPCIÓN* 🍃\n\n⏳ Procesando técnica de escritura...\n\n📌 *Dojo:* ${groupName}\n\n💚 *"Las palabras del sensei guían a los ninjas"*`)
      
      await client.groupUpdateDescription(m.chat, newDesc)
      
      const successMsg = `🍃 *DESCRIPCIÓN DEL DOJO ACTUALIZADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Descripción anterior:* ${oldDesc.length > 60 ? oldDesc.slice(0, 57) + '...' : oldDesc}
┊  *Nueva descripción:* ${newDesc.length > 60 ? newDesc.slice(0, 57) + '...' : newDesc}
┊┈─────̇─̇─̇─────◯◝
┊➤ *La descripción del dojo ha sido renovada*
┊➤ *Que inspire a todos los ninjas que la lean*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${newDesc.includes('juventud') || newDesc.includes('ninja') ? '¡Una descripción digna de un verdadero dojo ninja!' : 'Un nuevo rumbo para el dojo'}"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setgpdesc:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para cambiar la descripción del dojo.\n\n💚 *"Asegúrate de que el sensei sea administrador"*`)
      }
      
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar la descripción del dojo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}