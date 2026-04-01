// gach reserved.js - Sistema de rolls para Gacha estilo Rock Lee 🍃
import chalk from 'chalk'

const limpiarRolls = () => {
  try {
    const chats = global.db.data.chats
    const now = Date.now()
    let eliminados = 0
    
    for (const chatId of Object.keys(chats)) {
      const chat = chats[chatId]
      if (!chat.rolls || typeof chat.rolls !== 'object') {
        chat.rolls = {}
        continue
      }
      for (const msgId of Object.keys(chat.rolls)) {
        const roll = chat.rolls[msgId]
        const expirado = roll.expiresAt && now > roll.expiresAt
        const reclamado = roll.claimed === true
        if (expirado || reclamado) {
          delete chat.rolls[msgId]
          eliminados++
        }
      }
    }
    
    if (eliminados > 0) {
      console.log(chalk.green(`🍃 ${eliminados} rolls expirados limpiados del dojo 💚`))
    }
  } catch (e) {
    console.log(chalk.gray('🍃 Error limpiando rolls'))
  }
}

// Limpiar cada 30 minutos (1800000 ms)
setInterval(limpiarRolls, 1800000)
limpiarRolls()

console.log(chalk.cyan(`🍃 Sistema de Gacha activado - ¡Reclama tus personajes! 💚`))