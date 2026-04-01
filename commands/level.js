// level.js - Sistema de niveles estilo Rock Lee 🍃
import chalk from 'chalk';

const growth = Math.pow(Math.PI / Math.E, 1.618) * Math.E * 0.75

function xpRange(level, multiplier = global.multiplier || 2) {
  if (level < 0) throw new TypeError('level cannot be negative value')
  level = Math.floor(level)
  const min = level === 0 ? 0 : Math.round(Math.pow(level, growth) * multiplier) + 1
  const max = Math.round(Math.pow(level + 1, growth) * multiplier)
  return { min, max, xp: max - min }
}

function findLevel(xp, multiplier = global.multiplier || 2) {
  if (xp === Infinity) return Infinity
  if (isNaN(xp)) return NaN
  if (xp <= 0) return -1
  let level = 0
  do { level++ } while (xpRange(level, multiplier).min <= xp)
  return --level
}

function canLevelUp(level, xp, multiplier = global.multiplier || 2) {
  if (level < 0) return false
  if (xp === Infinity) return true
  if (isNaN(xp)) return false
  if (xp <= 0) return false
  return level < findLevel(xp, multiplier)
}

// 🍃 Función para obtener nombre de rango según nivel
function getRankName(level) {
  const ranks = [
    { min: 1, name: '🥋 Genin' },
    { min: 10, name: '🍃 Chūnin' },
    { min: 25, name: '⚡ Jōnin' },
    { min: 50, name: '🔥 Sannin' },
    { min: 75, name: '👑 Kage' },
    { min: 100, name: '💎 Leyenda' }
  ]
  let rank = '🥋 Genin'
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (level >= ranks[i].min) {
      rank = ranks[i].name
      break
    }
  }
  return rank
}

// 🍃 Frases motivacionales de Rock Lee
const levelUpQuotes = [
  '💪 "El trabajo duro vence al talento!"',
  '🍥 "Un ninja verdadero nunca se rinde!"',
  '⚡ "Abre las puertas internas!"',
  '🔥 "Maito Gai sensei!"',
  '🌿 "La juventud explota!"',
  '💚 "El poder de la juventud!"',
  '🥋 "Sigue entrenando duro!"'
]

function getRandomQuote() {
  return levelUpQuotes[Math.floor(Math.random() * levelUpQuotes.length)]
}

export default async (m) => {
  try {
    const user = global.db.data.users[m.sender]
    const users = global.db.data.chats[m.chat]?.users?.[m.sender]
    if (!user || !users) return
    
    let before = user.level || 0
    let leveledUp = false
    
    while (canLevelUp(user.level, user.exp, global.multiplier)) {
      user.level++
      leveledUp = true
    }
    
    if (before !== user.level && leveledUp) {
      const coinBonus = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000
      const expBonus = Math.floor(Math.random() * (500 - 100 + 1)) + 100
      
      if (user.level % 5 === 0) {
        users.coins = (users.coins || 0) + coinBonus
        user.exp = (user.exp || 0) + expBonus
      }
      
      const { min, max } = xpRange(user.level, global.multiplier)
      user.minxp = min
      user.maxxp = max
      
      // 🍃 Mensaje de nivelación épico
      const rank = getRankName(user.level)
      const quote = getRandomQuote()
      
      const levelUpMessage = `🍃 *¡FELICITACIONES!* 🍃\n\n` +
        `💪 *${user.name || m.pushName || 'Ninja'}* ha alcanzado el nivel *${user.level}*\n` +
        `🥋 Rango: *${rank}*\n\n` +
        `✨ *Recompensas:*\n` +
        `💰 +${coinBonus.toLocaleString()} Ryō\n` +
        `⭐ +${expBonus} XP\n\n` +
        `💚 *"${quote}"*`
      
      await m.reply(levelUpMessage).catch(() => {})
      
      // Log en consola
      console.log(chalk.green(`🍃 ${user.name || m.pushName} ascendió al nivel ${user.level} (${rank}) 💚`))
    }
  } catch (error) {
    // Silencioso - no romper el flujo
  }
}