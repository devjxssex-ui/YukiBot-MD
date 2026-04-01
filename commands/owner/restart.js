// restart.js - Reiniciar el bot estilo Rock Lee 🍃
export default {
  command: ['restart', 'reiniciar', 'reboot', 'resetbot'],
  category: 'mod',
  isOwner: true,
  run: async (client, m) => {
    try {
      const restartMsg = `🍃 *REINICIANDO NINJA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Reinicio del sistema* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* ⏳ Procesando
┊  *Tiempo:* 3 segundos
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei se retira a meditar*
┊➤ *Volveré más fuerte que antes*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja verdadero renace más fuerte después de cada descanso"*`
      
      await client.reply(m.chat, restartMsg, m)
      
      setTimeout(() => {
        if (process.send) {
          process.send("restart")
        } else {
          process.exit(0)
        }
      }, 3000)
      
    } catch (e) {
      console.error('Error en restart:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al reiniciar el bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}