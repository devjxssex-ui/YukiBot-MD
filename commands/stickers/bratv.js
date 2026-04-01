// brat.js - Creador de stickers estilo Brat y Quote con Canvas (sin API) 🍃
import { createCanvas } from 'canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['brat', 'bratv', 'qc', 'emojimix'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      let text, emoji1, emoji2

      // 🍃 Procesar según el comando
      if (command === 'brat' || command === 'bratv') {
        if (!args.length) {
          return m.reply(`🍃 *CREAR STICKER BRAT* 🍃\n\n❓ Uso: *${usedPrefix}${command} <texto>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"La juventud explota en stickers!"*`)
        }
        text = args.join(' ')
      } 
      else if (command === 'qc') {
        if (!args.length) {
          return m.reply(`🍃 *QUOTE STICKER* 🍃\n\n❓ Uso: *${usedPrefix}${command} <texto>*\n\n📌 Ejemplo: *${usedPrefix}${command} El trabajo duro vence al talento*\n\n💚 *"Frase ninja en sticker!"*`)
        }
        text = args.join(' ')
      }
      else if (command === 'emojimix') {
        if (args.length < 2) {
          return m.reply(`🍃 *EMOJIMIX* 🍃\n\n❓ Uso: *${usedPrefix}${command} <emoji1> <emoji2>*\n\n📌 Ejemplo: *${usedPrefix}${command} 🍃 💚*\n\n💚 *"Combina emojis como un verdadero ninja!"*`)
        }
        emoji1 = args[0]
        emoji2 = args[1]
        
        const emojiRegex = /\p{Emoji}/u
        if (!emojiRegex.test(emoji1) || !emojiRegex.test(emoji2)) {
          return m.reply(`🍃 *EMOJIS INVÁLIDOS* 🍃\n\n❌ Ambos argumentos deben ser emojis.\n\n📌 Ejemplo: *${usedPrefix}${command} 🍃 💚*\n\n💚 *"Un ninja usa los emojis correctamente!"*`)
        }
      }

      await m.reply(`🍃 *CREANDO STICKER* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud nunca falla!"*`)

      let buffer

      // 🍃 Generar sticker según comando (todo local, sin API)
      if (command === 'brat') {
        buffer = await createBratSticker(text, false)
      } 
      else if (command === 'bratv') {
        buffer = await createBratSticker(text, true)
      }
      else if (command === 'qc') {
        buffer = await createQuoteSticker(text, m.pushName || 'Rock Lee')
      }
      else if (command === 'emojimix') {
        buffer = await createEmojiMixSticker(emoji1, emoji2)
      }

      if (!buffer || buffer.length === 0) {
        throw new Error('No se pudo generar el sticker')
      }

      // 🍃 Enviar sticker
      await client.sendMessage(m.chat, { 
        sticker: buffer,
        packname: 'Rock Lee Bot 🍃',
        author: 'El ninja de la hoja verde 💚'
      }, { quoted: m })

    } catch (error) {
      console.error('Error en brat:', error)
      
      let errorMsg = `🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo generar el sticker.\n\n📌 *Detalle:* ${error.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`
      m.reply(errorMsg)
    }
  }
}

// 🍃 Función para crear sticker estilo Brat (horizontal y vertical)
function createBratSticker(text, isVertical = false) {
  return new Promise((resolve, reject) => {
    try {
      const width = isVertical ? 400 : 512
      const height = isVertical ? 600 : 512
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      // Fondo negro
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, width, height)

      // Texto blanco con sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 5
      ctx.fillStyle = '#ffffff'
      
      const fontSize = isVertical ? 32 : 48
      ctx.font = `bold ${fontSize}px "Impact", "Arial Black", "Helvetica Neue", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowBlur = 0

      // Dividir texto en líneas
      const words = text.split(' ')
      const lines = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > width - 40) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      // Dibujar líneas
      const lineHeight = isVertical ? 50 : 60
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2
      
      lines.forEach((line, i) => {
        ctx.fillText(line.toUpperCase(), width / 2, startY + (i * lineHeight))
      })

      resolve(canvas.toBuffer('image/png'))
    } catch (err) {
      reject(err)
    }
  })
}

// 🍃 Función para crear sticker tipo quote
function createQuoteSticker(text, author) {
  return new Promise((resolve, reject) => {
    try {
      const width = 512
      const height = 512
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      // Fondo degradado verde (estilo Rock Lee)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#2ecc71')
      gradient.addColorStop(0.5, '#27ae60')
      gradient.addColorStop(1, '#229954')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Borde dorado
      ctx.strokeStyle = '#f1c40f'
      ctx.lineWidth = 8
      ctx.strokeRect(10, 10, width - 20, height - 20)

      // Sombra para texto
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 3
      
      // Texto principal
      ctx.fillStyle = '#ffffff'
      ctx.font = '28px "Segoe UI", "Arial", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Envolver texto
      const maxWidth = width - 60
      const words = text.split(' ')
      let lines = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      const lineHeight = 40
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2 - 30
      
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + (i * lineHeight))
      })

      // Autor (con estilo)
      ctx.font = 'italic 20px "Segoe UI", "Arial", sans-serif'
      ctx.fillStyle = '#f1c40f'
      ctx.shadowBlur = 2
      ctx.fillText(`— ${author}`, width / 2, height - 60)

      // Detalle decorativo
      ctx.font = '24px "Segoe UI Emoji"'
      ctx.fillStyle = '#f1c40f'
      ctx.fillText('🍃', width - 40, height - 30)
      ctx.fillText('💚', 40, height - 30)

      ctx.shadowBlur = 0
      resolve(canvas.toBuffer('image/png'))
    } catch (err) {
      reject(err)
    }
  })
}

// 🍃 Función para combinar emojis
function createEmojiMixSticker(emoji1, emoji2) {
  return new Promise((resolve, reject) => {
    try {
      const width = 512
      const height = 512
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')

      // Fondo degradado suave
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Círculo central brillante
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(46, 204, 113, 0.5)'
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 180, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(46, 204, 113, 0.2)'
      ctx.fill()
      
      // Emojis grandes
      ctx.font = `${width / 1.8}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowBlur = 10
      
      // Dibujar primer emoji
      ctx.fillStyle = '#ffffff'
      ctx.fillText(emoji1, width / 2 - 70, height / 2)
      
      // Dibujar segundo emoji con efecto
      ctx.globalAlpha = 0.85
      ctx.fillText(emoji2, width / 2 + 70, height / 2)
      
      ctx.globalAlpha = 1.0
      ctx.shadowBlur = 0

      resolve(canvas.toBuffer('image/png'))
    } catch (err) {
      reject(err)
    }
  })
}