// qc.js - Quote sticker estilo Rock Lee 🍃
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  command: ['qc', 'quote', 'frase'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      let textFinal = args.join(' ') || m.quoted?.text
      
      if (!textFinal) {
        return client.reply(m.chat, `🍃 *QUOTE STICKER* 🍃\n\n❓ Ingresa un texto para crear el sticker.\n\n📌 Ejemplo: *${usedPrefix}${command} El trabajo duro vence al talento*\n\n💚 *"La juventud explota en palabras!"*`, m)
      }
      
      // Limitar longitud del texto
      if (textFinal.length > 100) {
        await m.react('❌')
        return client.reply(m.chat, `🍃 *TEXTO DEMASIADO LARGO* 🍃\n\n❌ El texto no puede tener más de *100 caracteres*.\n\n📌 *Actual:* ${textFinal.length} caracteres\n\n💚 *"Un ninja usa palabras precisas!"*`, m)
      }
      
      await m.reply(`🍃 *CREANDO QUOTE* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"${textFinal.slice(0, 50)}${textFinal.length > 50 ? '...' : ''}"*`)
      
      // Obtener foto de perfil del usuario
      let target = m.quoted ? m.quoted.sender : m.sender
      let pp = null
      try {
        pp = await client.profilePictureUrl(target, 'image')
      } catch {
        // Usar imagen local si no hay foto
        const defaultImage = path.join(__dirname, '../assets/images/default-profile.jpg')
        if (fs.existsSync(defaultImage)) {
          pp = defaultImage
        }
      }
      
      const db = global.db.data
      const userGlobal = db.users[target] || {}
      const nombre = userGlobal?.name || target.split('@')[0] || 'Ninja'
      
      // Obtener metadatos del usuario
      const user = db.users[m.sender] || {}
      const name = user.name || m.sender.split('@')[0]
      const meta1 = user.metadatos ? String(user.metadatos).trim() : ''
      const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : ''
      const packname = meta1 ? meta1 : 'Rock Lee Bot 🍃'
      const author = meta2 ? meta2 : (name || 'El ninja de la hoja verde')
      
      // Crear sticker con Canvas
      const buffer = await createQuoteSticker(textFinal, nombre, pp)
      
      if (!buffer || buffer.length === 0) {
        throw new Error('No se pudo generar el sticker')
      }
      
      // Guardar temporalmente
      const tmpFile = path.join(__dirname, `../tmp/qc-${Date.now()}.webp`)
      fs.writeFileSync(tmpFile, buffer)
      
      // Enviar sticker
      await client.sendImageAsSticker(m.chat, tmpFile, m, { 
        packname: packname, 
        author: author 
      })
      
      // Limpiar archivo temporal
      fs.unlinkSync(tmpFile)
      await m.react('✅')
      
    } catch (e) {
      console.error('Error en qc:', e)
      await m.react('❌')
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al crear el quote.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  }
}

// 🍃 Función para crear sticker tipo quote
async function createQuoteSticker(text, author, avatarUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      const width = 512
      const height = 512
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext('2d')
      
      // Fondo degradado verde (estilo Rock Lee)
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#1a472a')
      gradient.addColorStop(0.3, '#2ecc71')
      gradient.addColorStop(0.7, '#27ae60')
      gradient.addColorStop(1, '#1f6e43')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Patrón de hojas (círculos decorativos)
      ctx.globalAlpha = 0.15
      for (let i = 0; i < 80; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 8 + 2, 0, Math.PI * 2)
        ctx.fillStyle = '#f1c40f'
        ctx.fill()
      }
      ctx.globalAlpha = 1
      
      // Borde decorativo
      ctx.strokeStyle = '#f1c40f'
      ctx.lineWidth = 6
      ctx.strokeRect(15, 15, width - 30, height - 30)
      
      // Segunda línea de borde
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20, width - 40, height - 40)
      
      // Avatar (si hay imagen)
      if (avatarUrl && typeof avatarUrl === 'string') {
        try {
          let avatarBuffer
          if (avatarUrl.startsWith('http')) {
            const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' })
            avatarBuffer = Buffer.from(response.data)
          } else if (fs.existsSync(avatarUrl)) {
            avatarBuffer = fs.readFileSync(avatarUrl)
          }
          
          if (avatarBuffer) {
            const avatar = await loadImage(avatarBuffer)
            const avatarSize = 70
            ctx.save()
            ctx.beginPath()
            ctx.arc(70, 70, avatarSize / 2, 0, Math.PI * 2)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(avatar, 35, 35, avatarSize, avatarSize)
            ctx.restore()
            
            // Círculo alrededor del avatar
            ctx.beginPath()
            ctx.arc(70, 70, avatarSize / 2 + 3, 0, Math.PI * 2)
            ctx.strokeStyle = '#f1c40f'
            ctx.lineWidth = 3
            ctx.stroke()
          }
        } catch (e) {
          // Si falla la imagen, continuar sin avatar
        }
      }
      
      // Nombre del autor
      ctx.font = `bold 24px "Segoe UI", "Arial", sans-serif`
      ctx.fillStyle = '#f1c40f'
      ctx.shadowBlur = 3
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.fillText(author, 115, 75)
      
      // Línea decorativa bajo el nombre
      ctx.beginPath()
      ctx.moveTo(115, 90)
      ctx.lineTo(280, 90)
      ctx.strokeStyle = '#f1c40f'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Texto del quote
      ctx.font = `italic 28px "Segoe UI", "Arial", sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // Envolver texto en líneas
      const maxWidth = width - 80
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
      
      const lineHeight = 45
      const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2 + 40
      
      lines.forEach((line, i) => {
        ctx.fillText(line, width / 2, startY + (i * lineHeight))
      })
      
      // Comillas decorativas
      ctx.font = `60px "Segoe UI", "Arial", sans-serif`
      ctx.fillStyle = '#f1c40f'
      ctx.globalAlpha = 0.5
      ctx.fillText('"', 40, 120)
      ctx.fillText('"', width - 70, height - 100)
      ctx.globalAlpha = 1
      
      // Decoración inferior
      ctx.font = `24px "Segoe UI Emoji"`
      ctx.fillStyle = '#f1c40f'
      ctx.fillText('🍃', width - 50, height - 35)
      ctx.fillText('💚', 50, height - 35)
      
      ctx.shadowBlur = 0
      
      resolve(canvas.toBuffer('image/png'))
    } catch (err) {
      reject(err)
    }
  })
}