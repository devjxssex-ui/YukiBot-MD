// open.js - Abrir el dojo (grupo) estilo Rock Lee 🍃
export default {
  command: ['open', 'abrir', 'desbloquear'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const timeout = args[0] ? msParser(args[0]) : 0
      
      if (args[0] && !timeout) {
        return client.reply(m.chat, `🍃 *FORMATO INVÁLIDO* 🍃\n\n❓ Usa: *${usedPrefix + command} <tiempo>*\n\n📌 Ejemplos:\n┊ *${usedPrefix + command} 10s* (10 segundos)\n┊ *${usedPrefix + command} 5m* (5 minutos)\n┊ *${usedPrefix + command} 2h* (2 horas)\n┊ *${usedPrefix + command} 1d* (1 día)\n\n💚 *"Un ninja usa el tiempo con sabiduría"*`, m)
      }
      
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupAnnouncement = groupMetadata.announce
      const groupName = groupMetadata.subject || 'este dojo'
      
      if (groupAnnouncement === false) {
        return client.reply(m.chat, `🍃 *DOJO ABIERTO* 🍃\n\n🔓 El dojo *${groupName}* ya está abierto.\n\n💚 *"Las puertas ya están abiertas para todos"*`, m)
      }
      
      const applyAction = async () => {
        await client.groupSettingUpdate(m.chat, 'not_announcement')
        const successMsg = `🍃 *DOJO ABIERTO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* 🔓 Abierto
┊  *Acceso:* Todos los ninjas pueden hablar
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha abierto las puertas del dojo*
┊➤ *Usa ${usedPrefix}close para cerrar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La comunidad ninja se reúne para entrenar"*`
        return client.reply(m.chat, successMsg, m)
      }
      
      if (timeout > 0) {
        const tiempoStr = clockString(timeout)
        await client.reply(m.chat, `🍃 *ABRIENDO DOJO* 🍃
        
⏳ El dojo se abrirá en *${tiempoStr}*.

💚 *"La paciencia es parte del entrenamiento"*`, m)
        
        setTimeout(async () => {
          try {
            const md = await client.groupMetadata(m.chat)
            if (md.announce === false) return
            await applyAction()
          } catch {}
        }, timeout)
      } else {
        await applyAction()
      }
      
    } catch (e) {
      console.error('Error en open:', e)
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al abrir el dojo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}

function msParser(str) {
  const match = str.match(/^(\d+)([smhd])$/i)
  if (!match) return null
  const num = parseInt(match[1])
  const unit = match[2].toLowerCase()
  switch (unit) {
    case 's': return num * 1000
    case 'm': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    default: return null
  }
}

function clockString(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  let parts = []
  if (d > 0) parts.push(`${d} ${d === 1 ? 'día' : 'días'}`)
  if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
  if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`)
  if (s > 0) parts.push(`${s} ${s === 1 ? 'segundo' : 'segundos'}`)
  return parts.join(' ')
}