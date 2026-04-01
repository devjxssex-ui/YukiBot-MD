// emojimix.js - Combinador de emojis estilo Rock Lee 🍃
import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['emojimix', 'mixemoji', 'combinaremoji'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      // Validar argumentos
      if (!args[0]) {
        return m.reply(`🍃 *COMBINAR EMOJIS* 🍃\n\n❓ Uso: *${usedPrefix + command} <emoji1>+<emoji2>*\n\n📌 Ejemplo: *${usedPrefix + command} 🍃+💚*\n\n💚 *"Combina emojis como un verdadero ninja!"*`)
      }
      
      // Procesar emojis
      let emoji1, emoji2
      
      if (text.includes('+')) {
        [emoji1, emoji2] = text.split('+')
      } else if (args.length >= 2) {
        emoji1 = args[0]
        emoji2 = args[1]
      } else {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❓ Uso: *${usedPrefix + command} <emoji1>+<emoji2>*\n\n📌 Ejemplo: *${usedPrefix + command} 🍃+💚*\n\n💚 *"Un ninja usa el formato correcto!"*`)
      }
      
      // Validar que sean emojis
      const emojiRegex = /\p{Emoji}/u
      if (!emojiRegex.test(emoji1) || !emojiRegex.test(emoji2)) {
        return m.reply(`🍃 *EMOJIS INVÁLIDOS* 🍃\n\n❌ Ambos argumentos deben ser emojis.\n\n📌 Ejemplo: *${usedPrefix + command} 🍃+💚*\n\n💚 *"Un ninja usa los emojis correctamente!"*`)
      }
      
      await m.reply(`🍃 *COMBINANDO EMOJIS* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"${emoji1} + ${emoji2} = Poder ninja!"*`)
      
      // Obtener metadatos del usuario
      const db = global.db.data
      const user = db.users[m.sender] || {}
      const name = user.name || m.pushName || m.sender.split('@')[0]
      const meta1 = user.metadatos ? String(user.metadatos).trim() : ''
      const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : ''
      let packname = meta1 ? meta1 : 'Rock Lee Bot 🍃'
      let author = meta2 ? meta2 : name || 'El ninja de la hoja verde'
      
      // Crear sticker con Canvas
      const buffer = await createEmojiMixSticker(emoji1, emoji2)
      
      if (!buffer || buffer.length === 0) {
        throw new Error('No se pudo generar el sticker')
      }
      
      // Guardar temporalmente
      const tmpFile = path.join(__dirname, `../tmp/emojimix-${Date.now()}.webp`)
      fs.writeFileSync(tmpFile, buffer)
      
      // Enviar sticker
      await client.sendImageAsSticker(m.chat, tmpFile, m, { 
        packname: packname, 
        author: author 
      })
      
      // Limpiar archivo temporal
      fs.unlinkSync(tmpFile)
      
    } catch (e) {
      console.error('Error en emojimix:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al combinar los emojis.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}

// 🍃 Función para crear sticker combinando emojis
function createEmojiMixSticker(emoji1, emoji2) {
  return new Promise((resolve, reject) => {
    try {
      const width = 512
      const height = 512
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      
      // Fondo degradado verde oscuro a verde claro (estilo Rock Lee)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#1a472a')
      gradient.addColorStop(0.5, '#2ecc71')
      gradient.addColorStop(1, '#27ae60')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Patrón de hojas (círculos decorativos)
      ctx.globalAlpha = 0.2
      for (let i = 0; i < 50; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 10 + 2, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      }
      ctx.globalAlpha = 1
      
      // Círculo central brillante
      ctx.shadowBlur = 20
      ctx.shadowColor = 'rgba(46, 204, 113, 0.6)'
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 180, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.fill()
      
      // Emojis grandes
      const emojiFont = `${width / 1.5}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`
      ctx.font = emojiFont
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowBlur = 12
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      
      // Dibujar primer emoji (izquierda)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(emoji1, width / 2 - 80, height / 2)
      
      // Dibujar segundo emoji (derecha) con efecto de superposición
      ctx.globalAlpha = 0.9
      ctx.fillText(emoji2, width / 2 + 80, height / 2)
      
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      
      // Símbolo de combinación "+" en el centro
      ctx.font = `bold 48px "Segoe UI", "Arial", sans-serif`
      ctx.fillStyle = '#f1c40f'
      ctx.shadowBlur = 5
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.fillText('+', width / 2, height / 2)
      
      // Decoración inferior
      ctx.font = `24px "Segoe UI Emoji"`
      ctx.fillStyle = '#f1c40f'
      ctx.shadowBlur = 3
      ctx.fillText('🍃', width - 50, height - 40)
      ctx.fillText('💚', 50, height - 40)
      
      ctx.shadowBlur = 0
      
      resolve(canvas.toBuffer('image/png'))
    } catch (err) {
      reject(err)
    }
  })
}