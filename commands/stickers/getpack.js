// getpack.js - Descargar paquetes de stickers estilo Rock Lee 🍃
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['getpack', 'pack', 'stickerpack', 'descargarpack'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!args.length) {
        return m.reply(`🍃 *DESCARGAR PAQUETE* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre del pack>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja siempre tiene sus herramientas listas!"*`)
      }
      
      const packName = args.join(' ').trim().toLowerCase()
      const db = global.db.data
      if (!db.stickerspack) db.stickerspack = {}

      let pack = null
      let packOwner = m.sender

      // Buscar en paquetes propios
      const myPacks = db.stickerspack[m.sender]?.packs || []
      pack = myPacks.find(p => p.name.toLowerCase() === packName)

      // Buscar en paquetes públicos de otros usuarios
      if (!pack) {
        for (const [userId, userData] of Object.entries(db.stickerspack)) {
          const userPacks = userData.packs || []
          const publicPack = userPacks.find(p => p.name.toLowerCase() === packName && p.spackpublic === 1)
          if (publicPack) {
            pack = publicPack
            packOwner = userId
            break
          }
        }
      }

      if (!pack) {
        return m.reply(`🍃 *PAQUETE NO ENCONTRADO* 🍃\n\n❌ No se encontró un paquete con el nombre *${packName}*\n\n📌 *Usa ${usedPrefix}packlist* para ver tus paquetes\n\n💚 *"La memoria del ninja es importante!"*`)
      }
      
      if (!Array.isArray(pack.stickers) || pack.stickers.length < 4) {
        return m.reply(`🍃 *PACK INCOMPLETO* 🍃\n\n❌ El paquete *${pack.name}* no tiene suficientes stickers (mínimo 4).\n\n📌 *Stickers actuales:* ${pack.stickers?.length || 0}\n\n💚 *"Un ninja necesita un arsenal completo!"*`)
      }
      
      const validStickers = pack.stickers.map(s => {
        try {
          return Buffer.from(s, 'base64')
        } catch {
          return null
        }
      }).filter(s => s && Buffer.isBuffer(s) && s.length > 0)

      if (validStickers.length < 4) {
        return m.reply(`🍃 *STICKERS CORRUPTOS* 🍃\n\n❌ Algunos stickers del paquete *${pack.name}* están corruptos.\n\n💚 *"Un ninja usa herramientas de calidad!"*`)
      }

      const MAX_STICKERS = 50
      const selected = validStickers.slice(0, MAX_STICKERS)
      const cover = selected[0]

      const packOwnerUser = db.users[packOwner] || {}
      const ownerName = packOwnerUser?.name || packOwner.split('@')[0]
      const ownerMeta1 = packOwnerUser?.metadatos ? String(packOwnerUser.metadatos).trim() : ''
      const ownerMeta2 = packOwnerUser?.metadatos2 ? String(packOwnerUser.metadatos2).trim() : ''
      const stickerPackname = ownerMeta1 ? ownerMeta1 : pack.name
      const stickerAuthor = ownerMeta2 ? ownerMeta2 : (pack.desc || `Ninja ${ownerName}`)

      await m.reply(`🍃 *DESCARGANDO PAQUETE* 🍃\n\n📦 *Pack:* ${pack.name}\n👤 *Autor:* ${ownerName}\n🎨 *Stickers:* ${selected.length}\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud explota!"*`)

      const webp = await import('node-webpmux')
      const stickerResults = await Promise.all(selected.map(async (buffer, idx) => {
        try {
          const img = new webp.default.Image()
          await img.load(buffer)
          const json = { 
            'sticker-pack-id': 'https://github.com/devjxssex-ui/YukiBot-MD', 
            'sticker-pack-name': stickerPackname, 
            'sticker-pack-publisher': stickerAuthor, 
            emojis: ['🍃', '💚', '⚡'] 
          }
          const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
          const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8')
          const exif = Buffer.concat([exifAttr, jsonBuff])
          exif.writeUIntLE(jsonBuff.length, 14, 4)
          img.exif = exif
          const tmpOut = path.join(__dirname, `../tmp/pack-sticker-${Date.now()}-${idx}-${Math.random().toString(36).slice(2)}.webp`)
          await img.save(tmpOut)
          const stickerBuf = fs.readFileSync(tmpOut)
          fs.unlinkSync(tmpOut)
          return { sticker: stickerBuf, isAnimated: false, isLottie: false, emojis: ['🍃', '💚', '⚡'] }
        } catch (err) {
          return { sticker: buffer, isAnimated: false, isLottie: false, emojis: ['🍃', '💚', '⚡'] }
        }
      }))

      await client.sendMessage(m.chat, { 
        stickerPack: { 
          name: pack.name, 
          publisher: `${stickerAuthor} (${ownerName})`, 
          description: pack.desc || '🍃 Paquete de stickers del ninja de la hoja verde 💚', 
          cover, 
          stickers: stickerResults 
        } 
      }, { quoted: m })
      
      await m.react('✅')
      
      const successMsg = `🍃 *PAQUETE DESCARGADO* 🍃\n\n✅ *${pack.name}* (${selected.length} stickers)\n👤 *Autor:* ${ownerName}\n\n💚 *"${selected.length === MAX_STICKERS ? '¡Pack épico! La juventud explota' : 'Sigue entrenando para más stickers'}"*`
      await m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en getpack:', e)
      await m.react('❌')
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al descargar el paquete.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}