// ping.js - Medir latencia del bot estilo Rock Lee 🍃
export default {
  command: ['ping', 'p', 'latencia', 'velocidad'],
  category: 'info',
  run: async (client, m) => {
    try {
      const start = Date.now()
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const botSettings = global.db.data.settings[botId] || {}
      const botname = botSettings.namebot || 'Rock Lee'
      
      // 🍃 Mensaje inicial
      const sent = await client.sendMessage(m.chat, { 
        text: `🍃 *CALCULANDO PODER NINJA* 🍃\n\n⏳ Midiendo la velocidad de la juventud...\n\n💚 *"La velocidad es parte del entrenamiento"*`
      }, { quoted: m })
      
      const latency = Date.now() - start
      
      // 🍃 Mensaje de resultado
      let mensaje = ''
      let emoji = ''
      
      if (latency < 100) {
        emoji = '⚡🔥'
        mensaje = '¡Velocidad de la 8va puerta!'
      } else if (latency < 200) {
        emoji = '⚡'
        mensaje = 'Velocidad ninja'
      } else if (latency < 400) {
        emoji = '🌿'
        mensaje = 'Entrenamiento constante'
      } else if (latency < 800) {
        emoji = '🍃'
        mensaje = 'Necesitas más entrenamiento'
      } else {
        emoji = '💚'
        mensaje = 'La juventud necesita descansar'
      }
      
      const resultMsg = `🍃 *PONG!* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Latencia ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* ${botname}
┊  *Latencia:* ${latency}ms ${emoji}
┊  *Estado:* ${mensaje}
┊┈─────̇─̇─̇─────◯◝
┊➤ *"El trabajo duro vence al talento"*
┊➤ *Cuando el talento no trabaja duro*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud explota a ${latency}ms de velocidad!"*`
      
      await client.sendMessage(m.chat, { 
        text: resultMsg, 
        edit: sent.key 
      }, { quoted: m })
      
    } catch (e) {
      console.error('Error en ping:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al medir la latencia.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}