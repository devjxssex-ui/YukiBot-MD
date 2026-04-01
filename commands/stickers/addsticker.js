// addstickers.js - Agregar stickers a paquetes estilo Rock Lee 🍃
export default {
  command: ['addsticker', 'stickeradd', 'agregarsticker'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *AGREGAR STICKER* 🍃\n\n❓ Uso: *${usedPrefix}addsticker <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}addsticker Rock Lee*\n\n💚 *Responde a un sticker para agregarlo al pack*`)
      }
      
      const packName = args.join(' ').trim()
      const db = global.db.data
      
      if (!db.stickerspack) db.stickerspack = {}
      if (!db.stickerspack[m.sender]) db.stickerspack[m.sender] = { packs: [] }
      
      const packs = db.stickerspack[m.sender].packs || []
      if (!packs || packs.length === 0) {
        return m.reply(`🍃 *SIN PAQUETES* 🍃\n\n❌ No tienes paquetes de stickers creados.\n\n📌 Crea uno con: *${usedPrefix}newpack <nombre>*\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      const pack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      if (!pack) {
        const packList = packs.map(p => `🎨 *${p.name}* (${p.stickers?.length || 0} stickers)`).join('\n')
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró el paquete *${packName}*\n\n📌 *Tus paquetes:*\n${packList || 'Ninguno'}\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      const quoted = m.quoted
      if (!quoted) {
        return m.reply(`🍃 *RESPONDE A UN STICKER* 🍃\n\n📌 Responde a un sticker para agregarlo al pack *${pack.name}*\n\n💚 *"La juventud explota con stickers!"*`)
      }
      
      const mime = quoted.mimetype || quoted.msg?.mimetype || ''
      if (!/webp/i.test(mime)) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ Solo puedes agregar *stickers* (formato webp).\n\n💚 *"Un ninja reconoce las técnicas adecuadas!"*`)
      }
      
      if (pack.stickers.length >= 50) {
        return m.reply(`🍃 *PACK LLENO* 🍃\n\n❌ El pack *${pack.name}* ya tiene 50 stickers (máximo).\n\n💚 *"Todo tiene un límite, incluso la juventud!"*`)
      }
      
      let buffer = await quoted.download()
      if (!buffer) {
        return m.reply(`🍃 *ERROR* 🍃\n\n❌ No se pudo descargar el sticker.\n\n💚 *"Un ninja nunca falla, inténtalo de nuevo!"*`)
      }
      
      if (!Buffer.isBuffer(buffer)) {
        buffer = Buffer.from(buffer)
      }
      
      if (buffer.length === 0) {
        return m.reply(`🍃 *STICKER VACÍO* 🍃\n\n❌ El sticker está vacío o corrupto.\n\n💚 *"Un ninja usa herramientas de calidad!"*`)
      }
      
      const base64Sticker = buffer.toString('base64')
      
      if (pack.stickers.includes(base64Sticker)) {
        return m.reply(`🍃 *STICKER DUPLICADO* 🍃\n\n❌ El sticker ya existe en el pack *${pack.name}*.\n\n💚 *"Un ninja no repite técnicas innecesariamente!"*`)
      }
      
      pack.stickers.push(base64Sticker)
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      const stickerCount = pack.stickers.length
      const message = `🍃 *STICKER AGREGADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Pack:* ${pack.name} 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Stickers:* ${stickerCount}/50
┊  *Agregado:* ✅
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa ${usedPrefix}stickerpack ${pack.name}* para descargar
┊➤ *Usa ${usedPrefix}packlist* para ver tus paquetes
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${stickerCount === 50 ? '¡Pack completo! Sigue entrenando' : '¡La juventud explota!'}"*`
      
      m.reply(message)
      
    } catch (e) {
      console.error('Error en addsticker:', e)
      m.reply(`🍃 *ERROR* 🍃\n\n❌ Ocurrió un error al agregar el sticker.\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero nunca se rinde, inténtalo de nuevo!"*`)
    }
  }
}