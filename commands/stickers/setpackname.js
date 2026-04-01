// setpackname.js - Renombrar paquete de stickers estilo Rock Lee 🍃
export default {
  command: ['setstickerpackname', 'setpackname', 'packname', 'renombrarpack'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *RENOMBRAR PAQUETE* 🍃\n\n❓ Uso: *${usedPrefix + command} <nombre actual> | <nuevo nombre>*\n\n📌 Ejemplo: *${usedPrefix + command} Yuki | Rock Lee*\n\n💚 *"Un ninja renueva sus técnicas constantemente!"*`)
      }
      
      const fullText = args.join(' ').trim()
      const parts = fullText.split(/\||•|\//)
      
      if (parts.length < 2) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❓ Uso: *${usedPrefix + command} <nombre actual> | <nuevo nombre>*\n\n📌 Ejemplo: *${usedPrefix + command} Yuki | Rock Lee*\n\n💚 *"Un ninja usa el formato correcto!"*`)
      }
      
      const packName = parts[0].trim()
      const newName = parts[1].trim()
      
      if (!newName || newName.length === 0) {
        return m.reply(`🍃 *NOMBRE VACÍO* 🍃\n\n❌ El nuevo nombre no puede estar vacío.\n\n💚 *"Un ninja siempre tiene un nombre para su arsenal!"*`)
      }
      
      // Validar longitud del nombre
      if (newName.length < 3 || newName.length > 50) {
        return m.reply(`🍃 *NOMBRE INVÁLIDO* 🍃\n\n❌ El nuevo nombre debe tener entre *3 y 50 caracteres*.\n\n📌 *Actual:* ${newName.length} caracteres\n\n💚 *"Un ninja usa nombres cortos y poderosos!"*`)
      }
      
      // Validar caracteres prohibidos
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(newName)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre no puede contener: *< > : " / \\ | ? *\n\n📌 *Elige otro nombre*\n\n💚 *"Un ninja elige nombres con sabiduría!"*`)
      }
      
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}
      
      const packs = db.stickerspack[m.sender]?.packs || []
      
      if (!packs || packs.length === 0) {
        return m.reply(`🍃 *SIN PAQUETES* 🍃\n\n❌ No tienes paquetes de stickers creados.\n\n📌 *Crea uno con:* ${usedPrefix}newpack <nombre>\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      // Verificar si ya existe un paquete con el nuevo nombre
      if (packs.find(p => p.name.toLowerCase() === newName.toLowerCase())) {
        return m.reply(`🍃 *NOMBRE YA EXISTE* 🍃\n\n❌ Ya tienes un paquete llamado *${newName}*\n\n📌 *Elige otro nombre*\n\n💚 *"Un ninja no repite técnicas!"*`)
      }
      
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      
      if (!pack) {
        const packList = packs.map((p, i) => `${i + 1}. 🎨 *${p.name}* (${p.stickers?.length || 0} stickers)`).join('\n')
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró el paquete *${packName}*\n\n📌 *Tus paquetes:*\n${packList || 'Ninguno'}\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      const oldName = pack.name
      pack.name = newName
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      // Mensaje de éxito con estilo
      const stickerCount = pack.stickers?.length || 0
      const successMsg = `🍃 *PAQUETE RENOMBRADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Renovación ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre anterior:* ${oldName}
┊  *Nuevo nombre:* ${newName}
┊  *Stickers:* ${stickerCount}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa ${usedPrefix}packlist para ver tus paquetes*
┊➤ *Usa ${usedPrefix}addsticker ${newName} para agregar stickers*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${stickerCount > 0 ? `El pack ${newName} tiene ${stickerCount} stickers listos!` : 'Un nuevo nombre para un nuevo comienzo ninja!'}"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setpackname:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al renombrar el paquete.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}