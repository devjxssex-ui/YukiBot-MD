import chalk from 'chalk';
import { getUser, getGroup, getSettings, addExp } from './database.js';
import moment from 'moment-timezone';

// 🍃 Función principal para inicializar datos del usuario y grupo
export default async function initDB(m, client) {
  try {
    const sender = m.sender;
    const chatId = m.key.remoteJid;
    const isGroup = m.isGroup || chatId.endsWith('@g.us');
    const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.lid;
    
    // 🍃 Inicializar configuración del bot
    const settings = getSettings(botJid);
    if (settings.owner.length === 0 && global.owner) {
      settings.owner = global.owner.map(num => num + '@s.whatsapp.net');
      settings.botname = global.dev?.includes('Rock Lee') ? 'Rock Lee' : 'Rock Lee Bot';
    }
    
    // 🍃 Inicializar usuario
    const user = getUser(sender);
    if (!user.name || user.name !== m.pushName) {
      user.name = m.pushName || 'Ninja Sin Nombre';
    }
    if (!user.registerDate) {
      user.registerDate = Date.now();
      console.log(chalk.green(`🍃 Nuevo ninja: ${chalk.yellow(user.name)} (${chalk.cyan(sender)})`));
    }
    
    // 🍃 Verificar si es admin del bot (owner)
    const isOwner = settings.owner.includes(sender);
    if (isOwner && !user.isOwner) {
      user.isOwner = true;
      console.log(chalk.gold(`🍃 El sensei ${user.name} ha entrado al dojo`));
    }
    
    // 🍃 Inicializar grupo si es grupo
    if (isGroup) {
      const group = getGroup(chatId);
      if (!group.name) {
        try {
          const metadata = await client.groupMetadata(chatId);
          group.name = metadata.subject || 'Dojo Sin Nombre';
          console.log(chalk.magenta(`🍃 Dojo cargado: ${chalk.yellow(group.name)}`));
        } catch (e) {
          group.name = 'Dojo Desconocido';
        }
      }
      
      // 🍃 Verificar si el bot está en el grupo
      const metadata = await client.groupMetadata(chatId).catch(() => null);
      if (metadata) {
        const botInGroup = metadata.participants.some(p => 
          p.id === botJid || p.phoneNumber === botJid.split('@')[0]
        );
        if (!botInGroup) {
          console.log(chalk.yellow(`🍃 El ninja fue eliminado del dojo: ${group.name}`));
        }
      }
    }
    
    // 🍃 Agregar experiencia por mensaje
    const expGained = Math.floor(Math.random() * 15) + 5;
    const result = addExp(sender, expGained);
    
    if (result.leveledUp) {
      // 🍃 Mensaje de subida de nivel
      const rank = getUserRank(sender);
      const levelUpMsg = `🍃 *¡FELICITACIONES!* 🍃\n\n` +
                        `💪 *${user.name}* ha alcanzado el nivel *${result.newLevel}*\n` +
                        `🥋 Rango: *${rank}*\n\n` +
                        `💚 *"El trabajo duro vence al talento!"*`;
      
      await client.sendMessage(chatId, { text: levelUpMsg }, { quoted: m }).catch(() => {});
      console.log(chalk.green(`🍃 ${user.name} subió al nivel ${result.newLevel} (${rank})`));
    }
    
    // 🍃 Actualizar estadísticas del usuario
    user.lastSeen = Date.now();
    user.lastMessage = m.body?.slice(0, 50) || '';
    
    // 🍃 Actualizar estadísticas del grupo
    if (isGroup) {
      const group = getGroup(chatId);
      group.stats.totalMessages++;
      group.stats.activeUsers.add(sender);
    }
    
    // 🍃 Verificar premium expirado
    if (user.premium && user.premiumDate && user.premiumDate < Date.now()) {
      user.premium = false;
      user.premiumDate = null;
      console.log(chalk.yellow(`🍃 Premium expirado para ${user.name}`));
    }
    
    // 🍃 Verificar si el usuario está baneado
    if (user.banned && user.bannedReason) {
      console.log(chalk.red(`🍃 Usuario baneado: ${user.name} - Razón: ${user.bannedReason}`));
    }
    
    return { user, settings };
    
  } catch (error) {
    console.error(chalk.red(`❌ Error en initDB: ${error.message}`));
    return null;
  }
}

// 🍃 Función para obtener el rango del usuario
function getUserRank(userId) {
  const user = getUser(userId);
  const ranks = [
    { name: '🥋 Genin', minLevel: 1 },
    { name: '🍃 Chūnin', minLevel: 10 },
    { name: '⚡ Jōnin', minLevel: 25 },
    { name: '🔥 Sannin', minLevel: 50 },
    { name: '👑 Kage', minLevel: 75 },
    { name: '💎 Leyenda', minLevel: 100 }
  ];
  
  let rank = ranks[0].name;
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (user.level >= ranks[i].minLevel) {
      rank = ranks[i].name;
      break;
    }
  }
  return rank;
}

// 🍃 Función para obtener estadísticas rápidas
export function getQuickStats(userId) {
  const user = getUser(userId);
  const rank = getUserRank(userId);
  const expNeeded = user.level * 100;
  const expProgress = Math.floor((user.exp / expNeeded) * 100);
  
  return {
    name: user.name,
    level: user.level,
    exp: user.exp,
    expNeeded: expNeeded,
    expProgress: expProgress,
    rank: rank,
    commands: user.stats?.totalCommands || 0,
    messages: user.stats?.totalMessages || 0
  };
}

// 🍃 Función para verificar si el usuario es premium
export function isPremium(userId) {
  const user = getUser(userId);
  return user.premium && (!user.premiumDate || user.premiumDate > Date.now());
}

// 🍃 Función para dar premium a un usuario
export function givePremium(userId, days = 30) {
  const user = getUser(userId);
  user.premium = true;
  user.premiumDate = Date.now() + (days * 24 * 60 * 60 * 1000);
  console.log(chalk.green(`🍃 ${user.name} es ahora Premium por ${days} días`));
  return user;
}

// 🍃 Función para banear usuario
export function banUser(userId, reason = 'Violación de reglas') {
  const user = getUser(userId);
  user.banned = true;
  user.bannedReason = reason;
  console.log(chalk.red(`🍃 Usuario baneado: ${user.name} - ${reason}`));
  return user;
}

// 🍃 Función para desbanear usuario
export function unbanUser(userId) {
  const user = getUser(userId);
  user.banned = false;
  user.bannedReason = '';
  console.log(chalk.green(`🍃 Usuario desbaneado: ${user.name}`));
  return user;
}
