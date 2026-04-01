// gp.js - Información del grupo estilo Rock Lee 🍃
import ws from 'ws';
import fs from 'fs';

export default {
  command: ['gp', 'groupinfo', 'infogrupo', 'dojoinfo'],
  category: 'grupo',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const from = m.chat
      const groupMetadata = m.isGroup ? await client.groupMetadata(from).catch((e) => {}) : ''
      
      if (!groupMetadata) {
        return m.reply(`🍃 *NO ES UN DOJO* 🍃\n\n❌ Este comando solo puede usarse en grupos.\n\n💚 *"Un ninja entrena en comunidad"*`)
      }
      
      const groupName = groupMetadata.subject;
      const groupBanner = await client.profilePictureUrl(m.chat, 'image').catch(() => global.defaultProfileIcon || 'https://files.catbox.moe/7m6zl6.jpg')
      const groupCreator = groupMetadata.owner ? '@' + groupMetadata.owner.split('@')[0] : 'Desconocido';
      const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const totalParticipants = groupMetadata.participants.length;
      const chatId = m.chat;
      const chat = global.db.data.chats[chatId] || {};
      const chatUsers = chat.users || {};
      const botId = client.user.id.split(':')[0] + "@s.whatsapp.net";
      const botSettings = global.db.data.settings[botId] || {};
      const botname = botSettings.botname || 'Rock Lee Bot';
      const monedas = botSettings.currency || 'Ryō';
      
      let totalCoins = 0;
      let registeredUsersInGroup = 0;
      
      const resolvedUsers = await Promise.all(
        groupMetadata.participants.map(async (participant) => {
          return { ...participant, phoneNumber: participant.phoneNumber, jid: participant.jid };
        })
      );
      
      resolvedUsers.forEach((participant) => {
        const fullId = participant.phoneNumber || participant.jid || participant.id;
        const user = chatUsers[fullId];
        if (user) {
          registeredUsersInGroup++;
          totalCoins += Number(user.coins) || 0;
        }
      });
      
      // 🍃 Obtener datos de personajes
      let totalCharacters = 0
      let claimedCount = 0
      try {
        const charactersFilePath = './lib/characters.json'
        if (fs.existsSync(charactersFilePath)) {
          const data = await fs.promises.readFile(charactersFilePath, 'utf-8')
          const structure = JSON.parse(data)
          const allCharacters = Object.values(structure).flatMap(s => Array.isArray(s.characters) ? s.characters : [])
          totalCharacters = allCharacters.length
          claimedIDs = Object.entries(global.db.data.chats[m.chat]?.characters || {}).filter(([, c]) => c.user).map(([id]) => id)
          claimedCount = claimedIDs.length
        }
      } catch (e) {
        // Si no hay archivo, continuar sin datos
      }
      
      const claimRate = totalCharacters > 0 ? ((claimedCount / totalCharacters) * 100).toFixed(2) : '0.00'
      const rawPrimary = typeof chat.primaryBot === 'string' ? chat.primaryBot : '';
      const botprimary = rawPrimary.endsWith('@s.whatsapp.net') ? `@${rawPrimary.split('@')[0]}` : 'Aleatorio';
      
      // 🍃 Configuraciones con emojis
      const settings = {
        bot: chat.isBanned ? '🔇 Desactivado' : '🔊 Activado',
        antilinks: chat.antilinks ? '✅ Activado' : '❌ Desactivado',
        welcome: chat.welcome ? '✅ Activado' : '❌ Desactivado',
        goodbye: chat.goodbye ? '✅ Activado' : '❌ Desactivado',
        alerts: chat.alerts ? '✅ Activado' : '❌ Desactivado',
        gacha: chat.gacha ? '✅ Activado' : '❌ Desactivado',
        economy: chat.economy ? '✅ Activado' : '❌ Desactivado',
        nsfw: chat.nsfw ? '✅ Activado' : '❌ Desactivado',
        adminmode: chat.adminonly ? '✅ Activado' : '❌ Desactivado',
        botprimary: botprimary
      };
      
      // 🍃 Calcular porcentaje de actividad
      const activityRate = totalParticipants > 0 ? ((registeredUsersInGroup / totalParticipants) * 100).toFixed(1) : '0'
      
      // 🍃 Mensaje de información
      let message = `🍃 *INFORMACIÓN DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Fundador:* ${groupCreator}
┊  *Bot principal:* ${settings.botprimary}
┊  *Administradores:* ${groupAdmins.length} 🛡️
┊  *Ninjas totales:* ${totalParticipants} 🥷
┊  *Ninjas registrados:* ${registeredUsersInGroup} (${activityRate}%)
┊  *Claims en dojo:* ${claimedCount} (${claimRate}%)
┊  *Personajes totales:* ${totalCharacters}
┊  *Tesoro del dojo:* ${totalCoins.toLocaleString()} ${monedas}
┊┈─────̇─̇─̇─────◯◝
┊「 *Configuraciones* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Sensei:* ${settings.bot}
┊  *Anti-enlaces:* ${settings.antilinks}
┊  *Bienvenida:* ${settings.welcome}
┊  *Despedida:* ${settings.goodbye}
┊  *Alertas:* ${settings.alerts}
┊  *Gacha:* ${settings.gacha}
┊  *Economía:* ${settings.economy}
┊  *NSFW:* ${settings.nsfw}
┊  *Modo admin:* ${settings.adminmode}
╰─────────────────╯

💚 *"${activityRate > 80 ? '¡Un dojo lleno de ninjas activos!' : activityRate > 50 ? 'Buen entrenamiento en este dojo' : 'La juventud necesita despertar en este dojo'}"*`
      
      const mentionOw = groupMetadata.owner ? groupMetadata.owner : '';
      const mentions = [rawPrimary, mentionOw].filter(Boolean);
      
      await client.sendContextInfoIndex(m.chat, message.trim(), {}, null, false, mentions, { 
        banner: groupBanner, 
        title: groupName, 
        body: '🍃 Información del dojo',
        redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"]?.link || 'https://github.com/devjxssex-ui/YukiBot-MD' 
      })
      
    } catch (e) {
      console.error('Error en gp:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al obtener la información del dojo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
};