// delpack.js - Eliminar paquetes de stickers estilo Rock Lee 🍃
export default {
  command: ['delpack', 'deletepack', 'borrarpack'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *ELIMINAR PAQUETE* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja mantiene su arsenal organizado!"*`)
      }
      
      const packName = args.join(' ').trim()
      const db = global.db.data
      
      if (!db.stickerspack) db.stickerspack = {}
      if (!db.stickerspack[m.sender]) db.stickerspack[m.sender] = { packs: [] }
      
      const packs = db.stickerspack[m.sender].packs || []
      
      if (!packs || packs.length === 0) {
        return m.reply(`🍃 *SIN PAQUETES* 🍃\n\n❌ No tienes paquetes de stickers creados.\n\n📌 *Crea uno con:* ${usedPrefix}newpack <nombre>\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      const packIndex = packs.findIndex(p => p.name.toLowerCase() === packName.toLowerCase())
      
      if (packIndex === -1) {
        const packList = packs.map((p, i) => `${i + 1}. 🎨 *${p.name}* (${p.stickers?.length || 0} stickers)`).join('\n')
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró el paquete *${packName}*\n\n📌 *Tus paquetes:*\n${packList || 'Ninguno'}\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      const pack = packs[packIndex]
      const stickerCount = pack.stickers?.length || 0
      const packNameDeleted = pack.name
      
      // Eliminar paquete
      packs.splice(packIndex, 1)
      db.stickerspack[m.sender].packs = packs
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *PAQUETE ELIMINADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Pack eliminado* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre:* ${packNameDeleted}
┊  *Stickers:* ${stickerCount} stickers
┊┈─────̇─̇─̇─────◯◝
┊➤ *Paquete eliminado correctamente*
┊➤ *Te quedan ${packs.length} paquete(s)*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${stickerCount > 0 ? `${stickerCount} técnicas se han ido al dojo celestial` : 'Un ninja siempre renueva su arsenal'}!"*`
      
      await client.sendMessage(m.chat, { text: successMsg }, { quoted: m })
      
    } catch (e) {
      console.error('Error en delpack:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al eliminar el paquete.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}