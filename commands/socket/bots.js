// bots.js - Ver bots activos estilo Rock Lee 🍃
import fs from 'fs';
import path from 'path';
import ws from 'ws';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default {
  command: ['bots', 'sockets', 'ninjas', 'activos'],
  category: 'socket',
  run: async (client, m) => {
    try {
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const bot = global.db.data.settings[botId]
      const botname = bot?.botname || 'Rock Lee Bot'
      const namebot = bot?.namebot || 'Rock Lee'
      const banner = bot?.icon || ''
      const from = m.key.remoteJid
      const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch(() => {}) : ''
      const groupParticipants = groupMetadata?.participants?.map((p) => p.phoneNumber || p.jid || p.lid || p.id) || []
      const mainBotJid = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
      const isMainBotInGroup = groupParticipants.includes(mainBotJid)
      
      const basePath = path.join(dirname, '../../Sessions')
      const getBotsFromFolder = (folderName) => {
        const folderPath = path.join(basePath, folderName)
        if (!fs.existsSync(folderPath)) return []
        return fs.readdirSync(folderPath).filter((dir) => {
          const credsPath = path.join(folderPath, dir, 'creds.json')
          return fs.existsSync(credsPath)
        }).map((id) => id.replace(/\D/g, ''))
      }
      
      const subs = getBotsFromFolder('Subs')
      const categorizedBots = { Owner: [], Sub: [] }
      const mentionedJid = []
      
      const formatBot = (number, label) => {
        const jid = number + '@s.whatsapp.net'
        if (!groupParticipants.includes(jid)) return null
        mentionedJid.push(jid)
        const data = global.db.data.settings[jid]
        const name = data?.namebot || 'Ninja'
        const handle = `@${number}`
        return `┊  🥷 ${label} *${name}* › ${handle}`
      }
      
      if (global.db.data.settings[mainBotJid]) {
        const name = global.db.data.settings[mainBotJid].namebot || 'Rock Lee'
        const handle = `@${mainBotJid.split('@')[0]}`
        if (isMainBotInGroup) {
          mentionedJid.push(mainBotJid)
          categorizedBots.Owner.push(`┊  👑 Sensei *${name}* › ${handle}`)
        }
      }
      
      subs.forEach((num) => {
        const line = formatBot(num, 'Sub')
        if (line) categorizedBots.Sub.push(line)
      })
      
      const totalCounts = {
        Owner: global.db.data.settings[mainBotJid] ? 1 : 0,
        Sub: subs.length,
      }
      const totalBots = totalCounts.Owner + totalCounts.Sub
      const totalInGroup = categorizedBots.Owner.length + categorizedBots.Sub.length
      
      // 🍃 Mensaje estilo Rock Lee
      let message = `🍃 *DOJO DE NINJAS* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Bots activos* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  👑 Senseis: ${totalCounts.Owner}
┊  🥷 Subs: ${totalCounts.Sub}
┊  🎯 Total: ${totalBots}
┊┈─────̇─̇─̇─────◯◝
┊  📍 *En este dojo:* ${totalInGroup}
┊︶︶︶︶︶︶︶︶︶︶︶`
      
      for (const category of ['Owner', 'Sub']) {
        if (categorizedBots[category].length) {
          message += '\n' + categorizedBots[category].join('\n')
        }
      }
      
      message += `\n╰─────────────────╯

💚 *"${totalBots === 1 ? 'Un ninja solitario, pero poderoso' : totalBots > 5 ? '¡Un ejército ninja! La juventud explota' : 'Juntos somos más fuertes'}"*`
      
      await client.sendContextInfoIndex(m.chat, message, {}, m, true, mentionedJid)
      
    } catch (e) {
      console.error('Error en bots:', e);
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al listar los bots activos.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`)
    }
  },
};