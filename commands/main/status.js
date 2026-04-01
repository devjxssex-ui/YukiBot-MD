// status.js - Estado del bot estilo Rock Lee 🍃
import fs from 'fs'
import os from 'os'
import { sizeFormatter } from 'human-readable'

function getDefaultHostId() {
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME.split('-')[0]
  }
  return 'rocklee-dojo'
}

const format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

export default {
  command: ['status', 'estado', 'stats', 'estadisticas'],
  category: 'info',
  run: async (client, m) => {
    try {
      const hostId = getDefaultHostId()
      const registeredGroups = global.db.data.chats ? Object.keys(global.db.data.chats).length : 0
      const botId = client.user.id.split(':')[0] + "@s.whatsapp.net" || false
      const botSettings = global.db.data.settings[botId] || {}
      const botname = botSettings.botname || 'Rock Lee Bot'
      const userCount = Object.keys(global.db.data.users).length || '0'
      const totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.usedcommands || 0), 0)
      
      // 🍃 Estado del bot
      const estadoBot = `🍃 *ESTADO DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${botname}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninjas registrados:* ${userCount.toLocaleString()} 🥷
┊  *Dojos registrados:* ${registeredGroups.toLocaleString()} 🏯
┊  *Técnicas ejecutadas:* ${toNum(totalCommands)} ⚡
┊  *Host ID:* ${hostId}
┊┈─────̇─̇─̇─────◯◝`
      
      const sistema = os.type()
      const cpu = os.cpus().length
      const ramTotal = format(os.totalmem())
      const ramUsada = format(os.totalmem() - os.freemem())
      const arquitectura = os.arch()
      const uptime = os.uptime()
      const dias = Math.floor(uptime / 86400)
      const horas = Math.floor((uptime % 86400) / 3600)
      const minutos = Math.floor((uptime % 3600) / 60)
      
      // 🍃 Estado del servidor
      const estadoServidor = `┊「 *ESTADO DEL SERVIDOR* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sistema:* ${sistema}
┊  *CPU:* ${cpu} núcleos
┊  *RAM Total:* ${ramTotal}
┊  *RAM Usada:* ${ramUsada}
┊  *Arquitectura:* ${arquitectura}
┊  *Activo:* ${dias}d ${horas}h ${minutos}m
┊┈─────̇─̇─̇─────◯◝`
      
      // 🍃 Memoria Node.js
      const estadoNode = `┊「 *MEMORIA NINJA* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *RAM utilizada:* ${format(process.memoryUsage().rss)}
┊  *Heap reservado:* ${format(process.memoryUsage().heapTotal)}
┊  *Heap usado:* ${format(process.memoryUsage().heapUsed)}
┊  *Módulos nativos:* ${format(process.memoryUsage().external)}
┊  *Buffers:* ${format(process.memoryUsage().arrayBuffers)}
┊┈─────̇─̇─̇─────◯◝`
      
      // 🍃 Frase motivacional según la cantidad de técnicas
      let fraseMotivacional = ''
      if (totalCommands > 10000) {
        fraseMotivacional = '💪 *"¡Un verdadero ninja nunca deja de entrenar!"*'
      } else if (totalCommands > 5000) {
        fraseMotivacional = '⚡ *"La juventud explota en cada comando!"*'
      } else if (totalCommands > 1000) {
        fraseMotivacional = '🌿 *"El camino ninja se forja con cada técnica"*'
      } else {
        fraseMotivacional = '🍥 *"Todo gran ninja comienza desde cero"*'
      }
      
      const mensajeEstado = `${estadoBot}\n${estadoServidor}\n${estadoNode}\n╰─────────────────╯\n\n💚 *${fraseMotivacional}*`
      
      await client.reply(m.chat, mensajeEstado, m)
      
    } catch (e) {
      console.error('Error en status:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al mostrar el estado.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}