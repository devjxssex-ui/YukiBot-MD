// packlist.js - Lista de paquetes de stickers estilo Rock Lee 🍃
export default {
  command: ['packlist', 'stickerpacks', 'mispacks', 'listapacks'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}
      const packs = db.stickerspack[m.sender]?.packs || []
      
      if (!packs.length) {
        return m.reply(`🍃 *SIN PAQUETES* 🍃\n\n❌ No tienes paquetes de stickers creados.\n\n📌 *Crea uno con:* ${usedPrefix}newpack <nombre>\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      const formatDate = (timestamp) => {
        if (!timestamp) return 'Fecha desconocida'
        const date = new Date(parseInt(timestamp))
        return date.toLocaleString('es-CO', { timeZone: 'America/Bogota', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
      }
      
      // Calcular total de stickers
      const totalStickers = packs.reduce((sum, pack) => sum + (pack.stickers?.length || 0), 0)
      const packsPrivados = packs.filter(p => p.spackpublic !== 1).length
      const packsPublicos = packs.filter(p => p.spackpublic === 1).length
      
      let text = `🍃 *DOJO DE STICKERS* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Ninja:* @${m.sender.split('@')[0]} 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Paquetes:* ${packs.length}
┊  *Stickers:* ${totalStickers}
┊  *Públicos:* ${packsPublicos} 🔓
┊  *Privados:* ${packsPrivados} 🔒
┊┈─────̇─̇─̇─────◯◝`

      packs.forEach((pack, index) => {
        const estado = pack.spackpublic === 1 ? '🔓 Público' : '🔒 Privado'
        const stickerCount = pack.stickers?.length || 0
        const progressBar = stickerCount > 0 ? '█'.repeat(Math.min(10, Math.floor(stickerCount / 5))) + '░'.repeat(10 - Math.min(10, Math.floor(stickerCount / 5))) : '░░░░░░░░░░'
        
        text += `\n┊ *${index + 1}. ${pack.name || 'Sin nombre'}*\n`
        text += `┊   🎨 Stickers: ${stickerCount} [${progressBar}]\n`
        text += `┊   📅 Modificado: ${formatDate(pack.lastModified || pack.created)}\n`
        text += `┊   ${estado}\n`
        text += `┊   ──────────────────\n`
      })
      
      text += `╰─────────────────╯

💚 *"${packs.length === 1 ? 'Un paquete es el comienzo de un gran ninja' : totalStickers > 100 ? '¡Arsenal ninja completo! La juventud explota' : 'Sigue entrenando, más stickers llegarán'}"*

📌 *Comandos útiles:*
┊ ${usedPrefix}addsticker <nombre> - Agregar sticker
┊ ${usedPrefix}packpublic <nombre> - Hacer público
┊ ${usedPrefix}packprivate <nombre> - Hacer privado
┊ ${usedPrefix}delpack <nombre> - Eliminar pack
╰─────────────────╯`
      
      await client.sendMessage(m.chat, { text, mentions: [m.sender] }, { quoted: m })
      
    } catch (e) {
      console.error('Error en packlist:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al mostrar tus paquetes.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}