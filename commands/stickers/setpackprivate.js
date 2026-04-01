// setpackprivate.js - Hacer paquete privado estilo Rock Lee 🍃
export default {
  command: ['setpackprivate', 'setpackpriv', 'packprivate', 'hacerprivado'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *HACER PAQUETE PRIVADO* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja protege sus técnicas secretas!"*`)
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
        const packList = packs.map((p, i) => `${i + 1}. 🎨 *${p.name}* (${p.stickers?.length || 0} stickers) - ${p.spackpublic === 1 ? '🔓 Público' : '🔒 Privado'}`).join('\n')
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró el paquete *${packName}*\n\n📌 *Tus paquetes:*\n${packList || 'Ninguno'}\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      if (pack.spackpublic === 0 || pack.spackpublic === undefined) {
        const stickerCount = pack.stickers?.length || 0
        return m.reply(`🍃 *YA ES PRIVADO* 🍃\n\n🔒 El paquete *${pack.name}* ya es privado.\n\n📌 *Stickers:* ${stickerCount}\n\n💚 *"Este tesoro ya está protegido en el dojo!"*`)
      }
      
      const oldStatus = pack.spackpublic === 1 ? '🔓 Público' : '🔒 Privado'
      pack.spackpublic = 0
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      const stickerCount = pack.stickers?.length || 0
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *PAQUETE PRIVADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Protección ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pack:* ${pack.name}
┊  *Estado anterior:* ${oldStatus}
┊  *Nuevo estado:* 🔒 Privado
┊  *Stickers:* ${stickerCount}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora solo tú puedes ver y descargar este pack*
┊➤ *Usa ${usedPrefix}packpublic para hacerlo público*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${stickerCount > 0 ? `${stickerCount} técnicas quedaron bajo tu protección` : 'Un nuevo tesoro guardado en el dojo'}!"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setpackprivate:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al hacer el paquete privado.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}