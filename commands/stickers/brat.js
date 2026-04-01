// brat.js - Creador de stickers local estilo Rock Lee 🍃
import { createCanvas, loadImage, registerFont } from 'canvas'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🍃 Cargar fuentes (opcional - puedes poner una fuente personalizada)
const fontPath = path.join(__dirname, '../assets/fonts/RockLee.ttf')
try {
  registerFont(fontPath, { family: 'RockLee' })
} catch (e) {
  // Fuente no encontrada, usar la predeterminada
}

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

// 🍃 Función para crear sticker estilo Brat
async function createBratSticker(text, isVertical = false) {
  const width = isVertical ? 400 : 512
  const height = isVertical ? 600 : 512
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo negro
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)

  // Texto blanco
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${isVertical ? 32 : 48}px "Impact", "Arial Black", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

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
    ctx.fillText(line, width / 2, startY + (i * lineHeight))
  })

  return canvas.toBuffer('image/png')
}

// 🍃 Función para crear sticker tipo quote
async function createQuoteSticker(text, author) {
  const width = 512
  const height = 512
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo degradado verde
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#2ecc71')
  gradient.addColorStop(1, '#27ae60')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Borde
  ctx.strokeStyle = '#f1c40f'
  ctx.lineWidth = 10
  ctx.strokeRect(10, 10, width - 20, height - 20)

  // Texto
  ctx.fillStyle = '#ffffff'
  ctx.font = '28px "Arial", sans-serif'
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

  // Autor
  ctx.font = '20px "Arial", sans-serif'
  ctx.fillStyle = '#f1c40f'
  ctx.fillText(`— ${author}`, width / 2, height - 60)

  return canvas.toBuffer('image/png')
}

// 🍃 Función para combinar emojis
async function createEmojiMixSticker(emoji1, emoji2) {
  const width = 512
  const height = 512
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo transparente
  ctx.clearRect(0, 0, width, height)
  
  // Emoji grande en el centro
  ctx.font = `${width / 1.5}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Dibujar primer emoji
  ctx.fillText(emoji1, width / 2 - 80, height / 2)
  
  // Dibujar segundo emoji con efecto de superposición
  ctx.globalAlpha = 0.7
  ctx.fillText(emoji2, width / 2 + 80, height / 2)
  
  ctx.globalAlpha = 1.0

  return canvas.toBuffer('image/png')
}