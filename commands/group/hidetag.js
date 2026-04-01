// hidetag.js - Mencionar a todos en el dojo estilo Rock Lee 🍃
export default {
  command: ['hidetag', 'tag', 'mencionar', 'llamartodos'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => null) : null
      const groupName = groupMetadata?.subject || 'este dojo'
      
      if (!groupMetadata) {
        return m.reply(`🍃 *NO ES UN DOJO* 🍃\n\n❌ Este comando solo puede usarse en grupos.\n\n💚 *"Un ninja entrena en comunidad"*`)
      }
      
      const groupParticipants = groupMetadata?.participants || []
      const mentions = groupParticipants.map(p => p.jid || p.id || p.lid || p.phoneNumber).filter(Boolean).map(id => client.decodeJid(id))
      
      const userText = (args.join(' ') || '').trim()
      const src = m.quoted || m
      const hasImage = Boolean(src.message?.imageMessage || src.mtype === 'imageMessage' || src.mimetype === 'image' || src.mediaType === 'image')
      const hasVideo = Boolean(src.message?.videoMessage || src.mtype === 'videoMessage' || src.mimetype === 'video' || src.mediaType === 'video')
      const hasAudio = Boolean(src.message?.audioMessage || src.mtype === 'audioMessage' || src.mimetype === 'audio' || src.mediaType === 'audio')
      const hasSticker = Boolean(src.message?.stickerMessage || src.mtype === 'stickerMessage' || src.mimetype === 'sticker' || src.mediaType === 'sticker')
      const isQuoted = Boolean(m.quoted)
      const originalText = (src.caption || src.text || src.body || '').trim()
      
      // 🍃 Mensaje de proceso
      await m.reply(`🍃 *LLAMANDO A LOS NINJAS* 🍃\n\n⏳ Invocando a los ${mentions.length} guerreros del dojo...\n\n💚 *"¡La unión hace la fuerza!"*`)
      
      try {
        if (hasImage || hasVideo) {
          const media = await src.download()
          const options = { quoted: null, mentions }
          
          if (isQuoted) {
            if (hasImage) {
              return client.sendMessage(m.chat, { 
                image: media, 
                ...(originalText ? { caption: `🍃 *Mensaje del sensei:*\n${originalText}` } : {}), 
                ...options 
              })
            } else {
              return client.sendMessage(m.chat, { 
                video: media, 
                mimetype: 'video/mp4', 
                ...(originalText ? { caption: `🍃 *Mensaje del sensei:*\n${originalText}` } : {}), 
                ...options 
              })
            }
          } else {
            const finalText = userText || '🍃 ¡Atención a todos los ninjas del dojo! 💚'
            if (hasImage) {
              return client.sendMessage(m.chat, { 
                image: media, 
                caption: `🍃 *${finalText}*`, 
                ...options 
              })
            } else {
              return client.sendMessage(m.chat, { 
                video: media, 
                mimetype: 'video/mp4', 
                caption: `🍃 *${finalText}*`, 
                ...options 
              })
            }
          }
        }
        
        if (hasAudio) {
          const media = await src.download()
          return client.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/mp4', 
            fileName: 'hidetag.mp3', 
            mentions, 
            ptt: true,
            contextInfo: { mentionedJid: mentions }
          }, { quoted: null })
        }
        
        if (hasSticker) {
          const media = await src.download()
          return client.sendMessage(m.chat, { 
            sticker: media, 
            mentions,
            contextInfo: { mentionedJid: mentions }
          }, { quoted: null })
        }
        
        // 🍃 Mensaje de texto con estilo
        let finalText = ''
        if (isQuoted && originalText) {
          finalText = `🍃 *Mensaje del sensei para el dojo ${groupName}:* 🍃\n\n"${originalText}"\n\n💚 *"La juventud explota en comunidad"*`
          return client.sendMessage(m.chat, { text: finalText, mentions }, { quoted: null })
        }
        
        if (userText) {
          finalText = `🍃 *Mensaje del sensei para el dojo ${groupName}:* 🍃\n\n"${userText}"\n\n💚 *"La juventud explota en comunidad"*`
          return client.sendMessage(m.chat, { text: finalText, mentions }, { quoted: null })
        }
        
        // 🍃 Mensaje por defecto
        finalText = `🍃 *¡ATENCIÓN NINJAS DEL DOJO ${groupName}!* 🍃\n\n💪 *El sensei convoca a todos los guerreros*\n\n📌 *Usa ${usedPrefix}menu para ver las técnicas disponibles*\n\n💚 *"¡La juventud nunca falla!"*`
        return client.sendMessage(m.chat, { text: finalText, mentions }, { quoted: null })
        
      } catch (e) {
        console.error('Error en hidetag:', e)
        return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al enviar el mensaje.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
      }
      
    } catch (e) {
      console.error('Error en hidetag:', e)
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al ejecutar el comando.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}