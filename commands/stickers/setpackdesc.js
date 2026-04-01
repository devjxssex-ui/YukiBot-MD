// setpackdesc.js - Establecer descripción de paquete de stickers estilo Rock Lee 🍃
export default {
  command: ['setstickerpackdesc', 'setpackdesc', 'packdesc', 'descripcionpack'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *DESCRIPCIÓN DE PAQUETE* 🍃\n\n❓ Uso: *${usedPrefix + command} <nombre> | <descripción>*\n\n📌 Ejemplo: *${usedPrefix + command} Rock Lee | Stickers épicos del ninja de la hoja verde*\n\n💚 *"Un ninja siempre describe su arsenal!"*`)
      }
      
      const fullText = args.join(' ').trim()
      const parts = fullText.split(/\||•|\//)
      
      if (parts.length < 2) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❓ Uso: *${usedPrefix + command} <nombre> | <descripción>*\n\n📌 Ejemplo: *${usedPrefix + command} Rock Lee | Stickers épicos*\n\n💚 *"Un ninja usa el formato correcto!"*`)
      }
      
      const packName = parts[0].trim()
      const desc = parts[1].trim()
      
      if (!desc || desc.length === 0) {
        return m.reply(`🍃 *DESCRIPCIÓN VACÍA* 🍃\n\n❌ La descripción no puede estar vacía.\n\n💚 *"Un ninja siempre deja una huella!"*`)
      }
      
      if (desc.length > 80) {
        return m.reply(`🍃 *DESCRIPCIÓN DEMASIADO LARGA* 🍃\n\n❌ La descripción no puede tener más de *80 caracteres*.\n\n📌 *Actual:* ${desc.length} caracteres\n\n💚 *"Un ninja usa palabras precisas!"*`)
      }
      
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
      
      const oldDesc = pack.desc || 'Sin descripción'
      pack.desc = desc
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *DESCRIPCIÓN ACTUALIZADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Pack:* ${pack.name} 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Descripción anterior:* ${oldDesc}
┊  *Nueva descripción:* ${desc}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Usa ${usedPrefix}packlist para ver tus paquetes*
┊➤ *Usa ${usedPrefix}getpack ${pack.name} para descargar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${desc.includes('ninja') || desc.includes('Rock') ? '¡Excelente descripción ninja!' : 'La juventud explota en cada sticker!'}"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setpackdesc:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al actualizar la descripción.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}