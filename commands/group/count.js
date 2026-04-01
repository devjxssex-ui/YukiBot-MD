// count.js - Contador de mensajes estilo Rock Lee 🍃
import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['count', 'mensajes', 'messages', 'msgcount', 'estadisticas', 'actividad'],
  category: 'grupo',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      const db = global.db.data
      const chatId = m.chat
      const chatData = db.chats[chatId]
      const mentioned = m.mentionedJid
      const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : m.sender)
      const who = await resolveLidToRealJid(who2, client, m.chat)
      
      if (!chatData.users?.[who]) {
        return m.reply(`🍃 *NINJA NO REGISTRADO* 🍃\n\n❌ El ninja mencionado no está registrado en el dojo.\n\n💚 *"Todo ninja comienza su entrenamiento algún día"*`)
      }
      
      const userStats = chatData.users[who].stats || {}
      const userName = global.db.data.users[who]?.name || m.pushName || 'Ninja'
      const now = new Date()
      const daysArg = parseInt(args[0]) || 30
      
      if (daysArg < 1) {
        return m.reply(`🍃 *DÍAS INVÁLIDOS* 🍃\n\n❌ El número de días debe ser al menos *1*.\n\n📌 *Ejemplo:* ${usedPrefix + command} 7\n\n💚 *"Un ninja entrena todos los días"*`)
      }
      
      if (daysArg > 90) {
        return m.reply(`🍃 *DEMASIADOS DÍAS* 🍃\n\n❌ El máximo de días es *90*.\n\n📌 *Ejemplo:* ${usedPrefix + command} 30\n\n💚 *"La disciplina ninja se mide en semanas, no en años"*`)
      }
      
      const cutoff = new Date(now.getTime() - daysArg * 24 * 60 * 60 * 1000)
      const days = Object.entries(userStats)
        .filter(([date]) => new Date(date) >= cutoff)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      
      const totalMsgs = days.reduce((acc, [, d]) => acc + (d.msgs || 0), 0)
      const totalCmds = days.reduce((acc, [, d]) => acc + (d.cmds || 0), 0)
      
      // 🍃 Calcular promedio por día
      const avgPerDay = totalMsgs / daysArg
      
      // 🍃 Clasificar actividad
      let nivelActividad = ''
      let emojiActividad = ''
      if (totalMsgs === 0) {
        nivelActividad = 'En meditación'
        emojiActividad = '🧘'
      } else if (totalMsgs < 10) {
        nivelActividad = 'Genin aprendiz'
        emojiActividad = '🥋'
      } else if (totalMsgs < 50) {
        nivelActividad = 'Chūnin activo'
        emojiActividad = '🍃'
      } else if (totalMsgs < 200) {
        nivelActividad = 'Jōnin veterano'
        emojiActividad = '⚡'
      } else {
        nivelActividad = '¡Leyenda del dojo!'
        emojiActividad = '👑'
      }
      
      let report = `🍃 *ESTADÍSTICAS DEL NINJA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${userName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Rango:* ${emojiActividad} ${nivelActividad}
┊  *Período:* Últimos ${daysArg} días
┊  *Mensajes:* ${totalMsgs.toLocaleString()} 📝
┊  *Comandos:* ${totalCmds.toLocaleString()} ⚡
┊  *Promedio:* ${avgPerDay.toFixed(1)} mensajes/día
┊┈─────̇─̇─̇─────◯◝
┊「 *Historial diario* 」
┊︶︶︶︶︶︶︶︶︶︶︶`
      
      // 🍃 Agregar historial (máximo 10 días para no saturar)
      const daysToShow = days.slice(0, 10)
      for (const [date, d] of daysToShow) {
        const fecha = new Date(date).toLocaleDateString('es-MX', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric',
          timeZone: 'America/Mexico_City'
        })
        const msgCount = d.msgs || 0
        const cmdCount = d.cmds || 0
        const barLength = Math.min(20, Math.floor(msgCount / 5))
        const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength)
        
        report += `\n┊  *${fecha}*\n`
        report += `┊    📝 ${msgCount} msgs | ⚡ ${cmdCount} cmds\n`
        report += `┊    [${bar}]\n`
      }
      
      if (days.length > 10) {
        report += `\n┊  ... y ${days.length - 10} días más`
      }
      
      // 🍃 Frase motivacional según actividad
      let frase = ''
      if (totalMsgs === 0) {
        frase = '💚 *"El silencio también es parte del entrenamiento"*'
      } else if (totalMsgs < 10) {
        frase = '🍃 *"Todo gran ninja comienza desde cero"*'
      } else if (totalMsgs < 50) {
        frase = '⚡ *"La juventud comienza a despertar"*'
      } else if (totalMsgs < 200) {
        frase = '🔥 *"El trabajo duro está dando frutos"*'
      } else {
        frase = '👑 *"¡Un verdadero ninja nunca deja de entrenar!"*'
      }
      
      report += `\n╰─────────────────╯\n\n${frase}`
      
      await client.reply(chatId, report, m, { mentions: [who] })
      
    } catch (e) {
      console.error('Error en count:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al obtener las estadísticas.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}