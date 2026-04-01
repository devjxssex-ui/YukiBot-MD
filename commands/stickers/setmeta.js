// setmeta.js - Configurar metadatos de stickers estilo Rock Lee 🍃
export default {
  command: ['setstickermeta', 'setmeta', 'metadatos', 'configurarsticker'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args || args.length === 0) {
      return m.reply(`🍃 *CONFIGURAR METADATOS* 🍃\n\n❓ Uso: *${usedPrefix}${command} <pack> | <autor>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee Bot | El ninja de la hoja verde*\n\n💚 *"Un ninja personaliza sus herramientas!"*`)
    }
    
    try {
      const fullArgs = args.join(' ')
      const separatorIndex = fullArgs.search(/[|•\/]/)
      let metadatos01, metadatos02
      
      if (separatorIndex === -1) {
        metadatos01 = fullArgs.trim()
        metadatos02 = ''
      } else {
        metadatos01 = fullArgs.slice(0, separatorIndex).trim()
        metadatos02 = fullArgs.slice(separatorIndex + 1).trim()
      }
      
      // Validar nombre del pack (máximo 50 caracteres)
      if (metadatos01.length > 50) {
        return m.reply(`🍃 *NOMBRE DEMASIADO LARGO* 🍃\n\n❌ El nombre del pack no puede tener más de *50 caracteres*.\n\n📌 *Actual:* ${metadatos01.length} caracteres\n\n💚 *"Un ninja usa nombres cortos y efectivos!"*`)
      }
      
      // Validar nombre del autor (máximo 50 caracteres)
      if (metadatos02 && metadatos02.length > 50) {
        return m.reply(`🍃 *AUTOR DEMASIADO LARGO* 🍃\n\n❌ El nombre del autor no puede tener más de *50 caracteres*.\n\n📌 *Actual:* ${metadatos02.length} caracteres\n\n💚 *"Un ninja usa nombres con sabiduría!"*`)
      }
      
      if (!metadatos01) {
        return m.reply(`🍃 *NOMBRE VACÍO* 🍃\n\n❌ El nombre del pack no puede estar vacío.\n\n📌 *Formato:* ${usedPrefix}${command} <pack> | <autor>\n\n💚 *"Un ninja siempre deja su marca!"*`)
      }
      
      const db = global.db.data
      if (!db.users[m.sender]) db.users[m.sender] = {}
      
      const oldPack = db.users[m.sender].metadatos || 'Sin configurar'
      const oldAuthor = db.users[m.sender].metadatos2 || 'Sin configurar'
      
      db.users[m.sender].metadatos = metadatos01
      db.users[m.sender].metadatos2 = metadatos02 || ''
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *METADATOS ACTUALIZADOS* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Stickers personalizados* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pack anterior:* ${oldPack}
┊  *Autor anterior:* ${oldAuthor}
┊┈─────̇─̇─̇─────◯◝
┊  *Nuevo pack:* ${metadatos01}
┊  *Nuevo autor:* ${metadatos02 || 'Sin autor'}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora tus stickers mostrarán esta información*
┊➤ *Usa ${usedPrefix}delmeta para resetear*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${metadatos02 ? `El ninja ${metadatos02} deja su huella` : 'Un ninja siempre recuerda su pack'}!"*`
      
      await client.sendMessage(m.chat, { text: successMsg }, { quoted: m })
      
    } catch (e) {
      console.error('Error en setmeta:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar los metadatos.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}