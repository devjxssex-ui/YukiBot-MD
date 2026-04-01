// invite.js - Invitar al bot a grupos estilo Rock Lee 🍃
const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})(?:\s+[0-9]{1,3})?/i;

async function getGroupName(client, chatId) {
  try {
    const metadata = await client.groupMetadata(chatId);
    return metadata.subject || 'Dojo desconocido';
  } catch {
    return 'Chat privado';
  }
}

export default {
  command: ['invite', 'invitar', 'invitacion', 'llamar'],
  category: 'info',
  run: async (client, m, args) => {
    try {
      const user = global.db.data.chats[m.chat].users[m.sender];
      const grupo = m.isGroup ? await getGroupName(client, m.chat) : 'Chat privado';
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
      const botSettings = global.db.data.settings[botId];
      const botname = botSettings.botname || 'Rock Lee Bot';
      const dueño = botSettings.owner;
      const cooldown = 600000; // 10 minutos
      const nextTime = user.jointime + cooldown;
      
      // 🍃 Verificar cooldown
      if (new Date() - user.jointime < cooldown) {
        const remainingTime = msToTime(nextTime - new Date());
        return m.reply(`🍃 *ESPERA NINJA* 🍃\n\n⏳ Debes esperar *${remainingTime}* para enviar otra invitación.\n\n💚 *"La paciencia es parte del entrenamiento"*`);
      }
      
      if (!args || !args.length) {
        return m.reply(`🍃 *INVITAR AL DOJO* 🍃
        
❓ Uso: *${m.usedPrefix}invite <enlace del grupo>*

📌 Ejemplo: *${m.usedPrefix}invite https://chat.whatsapp.com/xxxxxxxxxx*

💚 *"El sensei siempre está listo para nuevos dojos"*`);
      }
      
      const link = args.join(' ');
      const match = link.match(linkRegex);
      
      if (!match || !match[1]) {
        return m.reply(`🍃 *ENLACE INVÁLIDO* 🍃\n\n❌ El enlace ingresado no es válido o está incompleto.\n\n📌 *Formato correcto:* https://chat.whatsapp.com/xxxxxxxxxx\n\n💚 *"Un ninja verifica sus coordenadas"*`);
      }
      
      const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net';
      const botType = isOficialBot ? '👑 Sensei' : '🥷 Aprendiz';
      const pp = await client.profilePictureUrl(m.sender, 'image').catch(() => global.defaultProfileIcon || 'https://files.catbox.moe/7m6zl6.jpg');
      
      // 🍃 Mensaje de solicitud
      const sugg = `🍃 *SOLICITUD NINJA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nueva invitación al dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* ${global.db.data.users[m.sender]?.name || m.pushName || 'Aspirante'}
┊  *Enlace:* ${args.join(' ')}
┊  *Chat:* ${grupo}
┊┈─────̇─̇─̇─────◯◝
┊「 *Info del sensei* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Tipo:* ${botType}
┊  *Nombre:* ${botname}
┊  *Versión:* ${global.version || 'Rock Lee v3.0'}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja comparte el camino con otros"*`
      
      if (typeof sugg !== 'string' || !sugg.trim()) return;
      
      // 🍃 Enviar al dueño o a los owners
      if (isOficialBot) {
        const lista = dueño ? [dueño] : global.owner.map(num => `${num}@s.whatsapp.net`);
        for (const destino of lista) {
          try {
            await global.client.sendContextInfoIndex(destino, sugg, {}, null, false, null, { 
              banner: pp, 
              title: '🍃 Invitación al dojo', 
              body: '✨ Un ninja busca expandir el dojo',
              redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"]?.link || 'https://github.com/devjxssex-ui/YukiBot-MD' 
            });
          } catch {}
        }
      } else {
        const destino = dueño || botId;
        try {
          await global.client.sendContextInfoIndex(destino, sugg, {}, null, false, null, { 
            banner: pp, 
            title: '🍃 Invitación al dojo', 
            body: '✨ Un ninja busca expandir el dojo',
            redes: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"]?.link || 'https://github.com/devjxssex-ui/YukiBot-MD' 
          });
        } catch {}
      }
      
      // 🍃 Mensaje de confirmación
      const successMsg = `🍃 *INVITACIÓN ENVIADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Solicitud ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Estado:* ✅ Enviada al sensei
┊  *Enlace:* ${args.join(' ').slice(0, 40)}${args.join(' ').length > 40 ? '...' : ''}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei revisará tu invitación*
┊➤ *Gracias por expandir el dojo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud explota en nuevas amistades"*`
      
      await client.reply(m.chat, successMsg, m);
      user.jointime = Date.now();
      
    } catch (e) {
      console.error('Error en invite:', e);
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al enviar la invitación.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`);
    }
  },
};

function msToTime(duration) {
  if (duration <= 0) return '0 segundos';
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}, ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  }
  return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
}