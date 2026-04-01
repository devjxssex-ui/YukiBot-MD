// setpackpublic.js - Hacer paquete público estilo Rock Lee 🍃
export default {
  command: ['setpackpublic', 'setpackpub', 'packpublic', 'hacerpublico'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *HACER PAQUETE PÚBLICO* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja comparte su arte con el mundo!"*`)
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
      
      if (pack.spackpublic === 1) {
        const stickerCount = pack.stickers?.length || 0
        return m.reply(`🍃 *YA ES PÚBLICO* 🍃\n\n🔓 El paquete *${pack.name}* ya es público.\n\n📌 *Stickers:* ${stickerCount}\n\n💚 *"¡La juventud ya está compartiendo este tesoro!"*`)
      }
      
      // Verificar que el pack tenga al menos 4 stickers para ser público
      const stickerCount = pack.stickers?.length || 0
      if (stickerCount < 4) {
        return m.reply(`🍃 *STICKERS INSUFICIENTES* 🍃\n\n❌ El paquete *${pack.name}* necesita al menos *4 stickers* para ser público.\n\n📌 *Stickers actuales:* ${stickerCount}\n\n📌 *Agrega más con:* ${usedPrefix}addsticker ${pack.name}\n\n💚 *"Un ninja comparte su arte cuando está completo!"*`)
      }
      
      const oldStatus = pack.spackpublic === 1 ? '🔓 Público' : '🔒 Privado'
      pack.spackpublic = 1
      pack.lastModified = Date.now().toString()
      db.stickerspack[m.sender].packs = packs
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *PAQUETE PÚBLICO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Arte compartido* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Pack:* ${pack.name}
┊  *Estado anterior:* ${oldStatus}
┊  *Nuevo estado:* 🔓 Público
┊  *Stickers:* ${stickerCount}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora todos los ninjas pueden ver y descargar este pack*
┊➤ *Usa ${usedPrefix}packprivate para protegerlo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${stickerCount >= 10 ? '¡Un arsenal completo compartido con el mundo!' : 'La juventud explota compartiendo arte!'}"*`
      
      m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setpackpublic:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al hacer el paquete público.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}