// brat.js - Creador de stickers con texto estilo Brat y Rock Lee 🍃
import axios from 'axios'
import FormData from 'form-data'

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
        
        // Validar que sean emojis
        const emojiRegex = /\p{Emoji}/u
        if (!emojiRegex.test(emoji1) || !emojiRegex.test(emoji2)) {
          return m.reply(`🍃 *EMOJIS INVÁLIDOS* 🍃\n\n❌ Ambos argumentos deben ser emojis.\n\n📌 Ejemplo: *${usedPrefix}${command} 🍃 💚*\n\n💚 *"Un ninja usa los emojis correctamente!"*`)
        }
      }

      await m.reply(`🍃 *CREANDO STICKER* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud nunca falla!"*`)

      let buffer
      
      // 🍃 Llamar a la API correspondiente
      if (command === 'brat') {
        const response = await axios.get(`https://api.siputzx.my.id/api/maker/brat?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' })
        buffer = Buffer.from(response.data)
      } 
      else if (command === 'bratv') {
        const response = await axios.get(`https://api.siputzx.my.id/api/maker/brat2?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' })
        buffer = Buffer.from(response.data)
      }
      else if (command === 'qc') {
        const response = await axios.get(`https://api.siputzx.my.id/api/maker/quotly?text=${encodeURIComponent(text)}&name=${encodeURIComponent(m.pushName || 'Rock Lee')}`, { responseType: 'arraybuffer' })
        buffer = Buffer.from(response.data)
      }
      else if (command === 'emojimix') {
        const response = await axios.get(`https://api.siputzx.my.id/api/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`, { responseType: 'arraybuffer' })
        buffer = Buffer.from(response.data)
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
      
      // 🍃 Mensaje de error personalizado
      let errorMsg = `🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo generar el sticker.\n\n📌 *Detalle:* ${error.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`
      
      if (error.response?.status === 404) {
        errorMsg = `🍃 *API NO DISPONIBLE* 🍃\n\n❌ El servicio de stickers no está disponible.\n\n💚 *"La paciencia es parte del entrenamiento ninja!"*`
      }
      
      m.reply(errorMsg)
    }
  }
}