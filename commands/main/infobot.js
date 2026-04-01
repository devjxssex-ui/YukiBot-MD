// infobot.js - Información del bot estilo Rock Lee 🍃
import os from 'os';

function rTime(seconds) {
  seconds = Number(seconds)
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const dDisplay = d > 0 ? d + (d === 1 ? " día, " : " días, ") : ""
  const hDisplay = h > 0 ? h + (h === 1 ? " hora, " : " horas, ") : ""
  const mDisplay = m > 0 ? m + (m === 1 ? " minuto, " : " minutos, ") : ""
  const sDisplay = s > 0 ? s + (s === 1 ? " segundo" : " segundos") : ""
  return dDisplay + hDisplay + mDisplay + sDisplay
}

export default {
  command: ['infobot', 'infosocket', 'info', 'estadobot'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
      const botSettings = global.db.data.settings[botId] || {}
      const botname = botSettings.botname || 'Rock Lee Bot'
      const namebot = botSettings.namebot || 'Rock Lee'
      const monedas = botSettings.currency || 'Ryō'
      const banner = botSettings.banner || global.defaultBanner || 'https://files.catbox.moe/ikre9z.jpg'
      const prefijo = botSettings.prefix
      const owner = botSettings.owner
      const canalId = botSettings.id
      const canalName = botSettings.nameid || 'Rock Lee Oficial'
      const canalLink = global.links?.channel || 'https://whatsapp.com/channel/0029VbCogMA4IBh8kqwcES2c'
      const githubLink = global.links?.github || 'https://github.com/devjxssex-ui/YukiBot-MD'
      const link = botSettings.link || githubLink
      
      let desar = 'Oculto'
      if (owner && !isNaN(owner.replace(/@s\.whatsapp\.net$/, ''))) {
        const userData = global.db.data.users[owner]
        desar = userData?.genre || 'Oculto'
      }
      
      const platform = os.type()
      const now = new Date()
      const colombianTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
      const nodeVersion = process.version
      const sistemaUptime = rTime(os.uptime())
      const uptime = process.uptime()
      const uptimeDate = new Date(colombianTime.getTime() - uptime * 1000)
      const formattedUptimeDate = uptimeDate.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/^./, m => m.toUpperCase())
      
      const isOficialBot = botId === global.client.user.id.split(':')[0] + "@s.whatsapp.net"
      const botType = isOficialBot ? '👑 Sensei' : '🥷 Aprendiz'
      
      // 🍃 Mensaje de información
      const message = `🍃 *INFORMACIÓN DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${botname}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre corto:* ${namebot}
┊  *Nombre largo:* ${botname}
┊  *Moneda:* ${monedas}
┊  *Prefijo${Array.isArray(prefijo) && prefijo.length > 1 ? 's' : ''}:* ${prefijo === true ? '`sin prefijos`' : (Array.isArray(prefijo) ? prefijo : [prefijo || '/']).map(p => `\`${p}\``).join(', ')}
┊
┊  *Tipo:* ${botType}
┊  *Plataforma:* ${platform}
┊  *NodeJS:* ${nodeVersion}
┊  *Activo desde:* ${formattedUptimeDate}
┊  *Sistema activo:* ${sistemaUptime}
┊  *${desar === 'Hombre' ? 'Sensei' : desar === 'Mujer' ? 'Sensei' : 'Sensei'}:* ${owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? `@${owner.split('@')[0]}` : owner) : "Oculto por privacidad"}
┊
┊  *GitHub:* ${githubLink}
┊  *Canal oficial:* ${canalLink}
┊  *Enlace:* ${link}
┊
┊  *ID Canal:* ${canalId || 'No configurado'}
╰─────────────────╯

💚 *"${botType === '👑 Sensei' ? 'El sensei guía el camino del dojo' : 'Un aprendiz se prepara para ser sensei'}"*`
      
      // 🍃 Enviar con o sin banner según el formato
      const isVideo = banner.includes('.mp4') || banner.includes('.webm')
      const mentionedJid = [owner, m.sender].filter(jid => jid && jid.includes('@'))
      
      const contextInfo = {
        mentionedJid: mentionedJid,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: canalId,
          serverMessageId: '',
          newsletterName: canalName
        }
      }
      
      if (isVideo) {
        await client.sendMessage(m.chat, {
          video: { url: banner },
          gifPlayback: true,
          caption: message,
          contextInfo: contextInfo
        }, { quoted: m })
      } else {
        await client.sendMessage(m.chat, {
          text: message,
          contextInfo: {
            ...contextInfo,
            externalAdReply: {
              title: botname,
              body: `${namebot} - El ninja de la hoja verde 🍃`,
              showAdAttribution: false,
              thumbnailUrl: banner,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })
      }
      
    } catch (e) {
      console.error('Error en infobot:', e)
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al mostrar la información del bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}