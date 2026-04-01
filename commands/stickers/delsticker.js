// delsticker.js - Eliminar sticker de paquete estilo Rock Lee 🍃
export default {
  command: ['stickerdel', 'delsticker', 'borrarsticker'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *ELIMINAR STICKER* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Responde al sticker que quieres eliminar"*`)
      }
      
      const packName = args.join(' ').trim()
      const db = global.db.data
      
      if (!db.stickerspack) db.stickerspack = {}
      
      const packs = db.stickerspack[m.sender]?.packs || []
      
      if (!packs || packs.length === 0) {
        return m.reply(`🍃 *SIN PAQUETES* 🍃\n\n❌ No tienes paquetes de stickers creados.\n\n📌 *Crea uno con:* ${usedPrefix}newpack <nombre>\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      
      if (!pack) {
        const packList = packs.map((p, i) => `${i + 1}. 🎨 *${p.name}* (${p.stickers?.length || 0} stickers)`).join('\n')
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró el paquete *${packName}*\n\n📌 *Tus paquetes:*\n${packList || 'Ninguno'}\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      const quoted = m.quoted
      if (!quoted) {
        return m.reply(`🍃 *RESPONDE A UN STICKER* 🍃\n\n📌 Responde al sticker que quieres eliminar del pack *${pack.name}*\n\n💚 *"La juventud explota con stickers!"*`)
      }
      
      const mime = quoted.mimetype || quoted.msg?.mimetype || ''
      if (!/webp/i.test(mime)) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ Solo puedes eliminar *stickers* (formato webp).\n\n💚 *"Un ninja reconoce las técnicas adecuadas!"*`)
      }
      
      if (!pack.stickers || pack.stickers.length === 0) {
        return m.reply(`🍃 *PACK VACÍO* 🍃\n\n❌ El pack *${pack.name}* no tiene stickers para eliminar.\n\n💚 *"Un ninja no puede eliminar lo que no existe!"*`)
      }
      
      let buffer = await quoted.download()
      if (!buffer) {
        return m.reply(`🍃 *ERROR* 🍃\n\n❌ No se pudo obtener el sticker.\n\n💚 *"Un ninja nunca falla, inténtalo de nuevo!"*`)
      }
      
      if (!Buffer.isBuffer(buffer)) {
        buffer = Buffer.from(buffer)
      }
      
      const base64Buffer = buffer.toString('base64')
      const index = pack.stickers.findIndex(stored => stored === base64Buffer)
      
      if (index === -1) {
        return m.reply(`🍃 *STICKER NO ENCONTRADO* 🍃\n\n❌ Ese sticker no está en el paquete *${pack.name}*.\n\n💚 *"Un ninja solo elimina lo que posee!"*`)
      }
      
      // Eliminar sticker
      pack.stickers.splice(index, 1)
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      const remainingStickers = pack.stickers.length
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *STICKER ELIMINADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Pack:* ${pack.name} 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Stickers restantes:* ${remainingStickers}
┊  *Eliminado:* ✅
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa ${usedPrefix}stickerpack ${pack.name}* para descargar
┊➤ *Usa ${usedPrefix}packlist* para ver tus paquetes
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${remainingStickers === 0 ? 'El pack está vacío, hora de crear nuevos stickers' : 'Un sticker menos, pero la juventud sigue explotando'}!"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en delsticker:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al eliminar el sticker.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}