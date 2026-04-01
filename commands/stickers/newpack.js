// newpack.js - Crear nuevo paquete de stickers estilo Rock Lee 🍃
export default {
  command: ['newpack', 'newstickerpack', 'crearpack'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *CREAR PAQUETE* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja siempre tiene sus herramientas organizadas!"*`)
      }
      
      const packName = args.join(' ').trim()
      
      // Validar nombre del paquete (máximo 50 caracteres)
      if (packName.length > 50) {
        return m.reply(`🍃 *NOMBRE DEMASIADO LARGO* 🍃\n\n❌ El nombre del paquete no puede tener más de 50 caracteres.\n\n📌 *Actual:* ${packName.length} caracteres\n\n💚 *"Un ninja usa nombres cortos y efectivos!"*`)
      }
      
      // Validar caracteres prohibidos
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(packName)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre no puede contener: *< > : " / \\ | ? *\n\n📌 *Elige otro nombre*\n\n💚 *"Un ninja elige nombres con sabiduría!"*`)
      }
      
      const db = global.db.data
      
      if (!db.stickerspack) db.stickerspack = {}
      if (!db.stickerspack[m.sender]) db.stickerspack[m.sender] = { packs: [] }
      
      const packs = db.stickerspack[m.sender].packs
      
      // Verificar límite de paquetes (máximo 20)
      if (packs.length >= 20) {
        return m.reply(`🍃 *LÍMITE ALCANZADO* 🍃\n\n❌ Ya tienes el máximo de 20 paquetes de stickers.\n\n📌 *Elimina algún paquete con:* ${usedPrefix}delpack <nombre>\n\n💚 *"Un ninja debe saber cuándo dejar ir!"*`)
      }
      
      // Verificar si ya existe un paquete con ese nombre
      const existingPack = packs.find(p => p.name.toLowerCase() === packName.toLowerCase())
      if (existingPack) {
        return m.reply(`🍃 *PAQUETE YA EXISTE* 🍃\n\n❌ Ya tienes un paquete llamado *${packName}*\n\n📌 *Usa otro nombre o elimina el existente*\n\n💚 *"Un ninja no repite técnicas innecesariamente!"*`)
      }
      
      // Crear nuevo paquete
      const newPack = {
        name: packName,
        stickers: [],
        created: Date.now(),
        lastModified: Date.now(),
        spackpublic: 0, // 0 = privado, 1 = público
        desc: `🍃 Paquete de stickers de ${m.pushName || 'un ninja'} - Rock Lee Style 💚`,
        author: m.pushName || 'Ninja Desconocido'
      }
      
      packs.push(newPack)
      
      // Mensaje de éxito con estilo
      const successMsg = `🍃 *PAQUETE CREADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nuevo pack* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre:* ${packName}
┊  *ID:* #${packs.length}
┊  *Estado:* 🔒 Privado
┊┈─────̇─̇─̇─────◯◝
┊➤ *Agrega stickers:* ${usedPrefix}addsticker ${packName}
┊➤ *Hacer público:* ${usedPrefix}packpublic ${packName}
┊➤ *Ver tus packs:* ${usedPrefix}packlist
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${packs.length} de 20 paquetes | La juventud explota!"*`
      
      await client.sendMessage(m.chat, { text: successMsg }, { quoted: m })
      
      // Opcional: sugerencia para agregar sticker
      setTimeout(async () => {
        await m.reply(`🍃 *TIP NINJA* 🍃\n\n📌 Para agregar un sticker a *${packName}*, usa:\n*${usedPrefix}addsticker ${packName}* y responde a un sticker.\n\n💚 *"La práctica hace al maestro!"*`)
      }, 2000)
      
    } catch (e) {
      console.error('Error en newpack:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al crear el paquete.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}