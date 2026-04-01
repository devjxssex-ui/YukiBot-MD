// suggest.js - Enviar reportes y sugerencias estilo Rock Lee 🍃
export default {
  command: ['report', 'reporte', 'sug', 'suggest', 'feedback', 'opinion'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      const texto = text.trim()
      const now = Date.now()
      const cooldown = global.db.data.users[m.sender].sugCooldown || 0
      const restante = cooldown - now
      
      // 🍃 Verificar cooldown (24 horas)
      if (restante > 0) {
        const tiempoRestante = msToTime(restante)
        return m.reply(`🍃 *ESPERA NINJA* 🍃\n\n⏳ Debes esperar *${tiempoRestante}* para enviar otro mensaje.\n\n💚 *"La paciencia es parte del entrenamiento"*`)
      }
      
      if (!texto) {
        return m.reply(`🍃 *ENVIAR FEEDBACK* 🍃
        
❓ Uso: *${usedPrefix + command} <mensaje>*

📌 Ejemplos:
┊ *${usedPrefix + command} El bot es increíble!*
┊ *${usedPrefix + command} Me gustaría un comando de anime*

💚 *"Tu opinión ayuda al dojo a mejorar"*`)
      }
      
      if (texto.length < 10) {
        return m.reply(`🍃 *MENSAJE CORTO* 🍃\n\n❌ Tu mensaje es demasiado corto (mínimo 10 caracteres).\n\n📌 *Actual:* ${texto.length} caracteres\n\n💚 *"Explica mejor tu idea para que el sensei la entienda"*`)
      }
      
      if (texto.length > 1000) {
        return m.reply(`🍃 *MENSAJE LARGO* 🍃\n\n❌ Tu mensaje es demasiado largo (máximo 1000 caracteres).\n\n📌 *Actual:* ${texto.length} caracteres\n\n💚 *"Un ninja es claro y conciso"*`)
      }
      
      const fecha = new Date()
      const fechaLocal = fecha.toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      const esReporte = ['report', 'reporte'].includes(command)
      const tipo = esReporte ? '📢 REPORTE' : '💡 SUGERENCIA'
      const tipoEmoji = esReporte ? '⚠️' : '✨'
      const user = m.pushName || 'Ninja Desconocido'
      const numero = m.sender.split('@')[0]
      const pp = await client.profilePictureUrl(m.sender, 'image').catch(() => global.defaultProfileIcon || 'https://files.catbox.moe/7m6zl6.jpg')
      
      // 🍃 Mensaje para los owners
      const reportMsg = `🍃 *${tipo} NINJA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Feedback del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* ${user}
┊  *Número:* wa.me/${numero}
┊  *Fecha:* ${fechaLocal}
┊┈─────̇─̇─̇─────◯◝
┊「 *Mensaje* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  ${texto}
┊┈─────̇─̇─̇─────◯◝
┊➤ ${esReporte ? 'Un ninja reporta para mejorar el dojo' : 'Un ninja comparte su sabiduría'}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${esReporte ? 'Atiende este reporte con honor' : 'Considera esta sugerencia con sabiduría'}"*`
      
      // 🍃 Enviar a todos los owners
      for (const num of global.owner) {
        try {
          await global.client.sendContextInfoIndex(`${num}@s.whatsapp.net`, reportMsg, {}, null, false, null, { 
            banner: pp, 
            title: tipo, 
            body: `${tipoEmoji} Un ninja tiene algo que decir`,
            redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"]?.link || 'https://github.com/devjxssex-ui/YukiBot-MD' 
          })
        } catch {}
      }
      
      // 🍃 Guardar cooldown (24 horas)
      if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
      global.db.data.users[m.sender].sugCooldown = now + 24 * 60 * 60 * 1000
      
      // 🍃 Mensaje de confirmación
      const confirmMsg = `🍃 *FEEDBACK ENVIADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Mensaje recibido* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Tipo:* ${esReporte ? '📢 Reporte' : '💡 Sugerencia'}
┊  *Estado:* ✅ Enviado al sensei
┊  *Próximo envío:* En 24 horas
┊┈─────̇─̇─̇─────◯◝
┊➤ *Gracias por ayudarnos a mejorar el dojo*
┊➤ *Tu voz es importante para la comunidad*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${esReporte ? 'Un ninja reporta con honor' : 'La sabiduría ninja se comparte'}"*`
      
      m.reply(confirmMsg)
      
    } catch (e) {
      console.error('Error en suggest:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al enviar tu mensaje.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}

const msToTime = (duration) => {
  if (duration <= 0) return '0 segundos'
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))
  
  const parts = []
  if (days > 0) parts.push(`${days} día${days > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`)
  return parts.join(', ')
}