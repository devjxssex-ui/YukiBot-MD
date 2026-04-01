import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import moment from 'moment-timezone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../database.json');

let data = {
  users: {},
  groups: {},
  settings: {},
  stats: {
    commands: 0,
    users: 0,
    groups: 0,
    startTime: Date.now()
  }
};

// 🍃 Función para cargar la base de datos
export function loadDatabase() {
  try {
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      data = JSON.parse(raw);
      console.log(chalk.green(`🍃 Base de datos cargada: ${chalk.bold(Object.keys(data.users).length)} usuarios, ${chalk.bold(Object.keys(data.groups).length)} grupos`));
    } else {
      saveDatabase();
      console.log(chalk.yellow(`🍃 Base de datos creada - ¡El dojo está listo!`));
    }
  } catch (e) {
    console.error(chalk.red(`❌ Error cargando base de datos:`), e);
    saveDatabase();
  }
  return data;
}

// 🍃 Función para guardar la base de datos
export function saveDatabase() {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(chalk.red(`❌ Error guardando base de datos:`), e);
  }
}

// 🍃 Función para obtener/crear usuario
export function getUser(userId) {
  if (!data.users[userId]) {
    data.users[userId] = {
      id: userId,
      name: '',
      exp: 0,
      level: 1,
      money: 100,
      premium: false,
      premiumDate: null,
      banned: false,
      bannedReason: '',
      registered: false,
      registerDate: null,
      lastDaily: 0,
      lastWork: 0,
      lastRob: 0,
      lastClaim: 0,
      lastTrain: 0,
      stats: {
        totalCommands: 0,
        totalMessages: 0,
        totalExp: 0
      },
      inventory: {
        items: [],
        weapons: [],
        armor: []
      }
    };
    data.stats.users++;
    console.log(chalk.cyan(`🍃 Nuevo ninja registrado: ${chalk.yellow(userId)}`));
    saveDatabase();
  }
  return data.users[userId];
}

// 🍃 Función para obtener/crear grupo
export function getGroup(groupId) {
  if (!data.groups[groupId]) {
    data.groups[groupId] = {
      id: groupId,
      name: '',
      settings: {
        antiLink: false,
        antiBadword: false,
        antiSpam: false,
        welcome: true,
        goodbye: true,
        leveling: true,
        economy: true,
        nsfw: false,
        game: true,
        botEnabled: true,
        adminOnly: false,
        language: 'es',
        prefix: ['!', '.', '#', '/']
      },
      stats: {
        totalMessages: 0,
        totalCommands: 0,
        activeUsers: new Set()
      },
      welcomeMessage: '🍃 *Bienvenido al dojo!* @user\n💚 *"La juventud explota!"*',
      goodbyeMessage: '🍃 @user ha dejado el dojo\n💪 *"Sigue entrenando duro!"*'
    };
    data.stats.groups++;
    console.log(chalk.magenta(`🍃 Nuevo dojo creado: ${chalk.yellow(groupId)}`));
    saveDatabase();
  }
  return data.groups[groupId];
}

// 🍃 Función para obtener/crear configuración del bot
export function getSettings(botId) {
  if (!data.settings[botId]) {
    data.settings[botId] = {
      botname: 'Rock Lee',
      namebot: 'Rock Lee Bot',
      type: 'Ninja',
      owner: [],
      prefix: ['!', '.', '#', '/'],
      self: false,
      onlyOwner: false,
      botEnabled: true,
      language: 'es',
      currency: '¥ Ryō',
      icon: '',
      banner: '',
      link: '',
      channel: '',
      newsletter_id: '',
      nameid: '',
      status: '🍃 ¡La juventud explota! 💚',
      commandsExecuted: 0,
      usersCount: 0,
      groupsCount: 0,
      uptime: Date.now()
    };
    saveDatabase();
    console.log(chalk.green(`🍃 Configuración del bot inicializada`));
  }
  return data.settings[botId];
}

// 🍃 Función para actualizar estadísticas del usuario
export function updateUserStats(userId, command = false) {
  const user = getUser(userId);
  if (command) {
    user.stats.totalCommands++;
    data.stats.commands++;
  }
  user.stats.totalMessages++;
  user.exp += Math.floor(Math.random() * 20) + 5;
  
  // Subir de nivel
  const expNeeded = user.level * 100;
  if (user.exp >= expNeeded) {
    user.level++;
    user.exp -= expNeeded;
    console.log(chalk.green(`🍃 ${userId} ascendió al nivel ${user.level}! 💪`));
    return { leveledUp: true, newLevel: user.level };
  }
  saveDatabase();
  return { leveledUp: false };
}

// 🍃 Función para actualizar estadísticas del grupo
export function updateGroupStats(groupId) {
  const group = getGroup(groupId);
  group.stats.totalMessages++;
  saveDatabase();
}

// 🍃 Función para agregar experiencia al usuario
export function addExp(userId, amount) {
  const user = getUser(userId);
  user.exp += amount;
  user.stats.totalExp += amount;
  
  const expNeeded = user.level * 100;
  if (user.exp >= expNeeded) {
    user.level++;
    user.exp -= expNeeded;
    console.log(chalk.green(`🍃 ${userId} subió al nivel ${user.level}! 💪`));
    saveDatabase();
    return { leveledUp: true, newLevel: user.level, exp: user.exp };
  }
  saveDatabase();
  return { leveledUp: false, exp: user.exp };
}

// 🍃 Función para obtener el rango del usuario
export function getUserRank(userId) {
  const user = getUser(userId);
  const ranks = [
    { name: 'Genin', minLevel: 1 },
    { name: 'Chūnin', minLevel: 10 },
    { name: 'Jōnin', minLevel: 25 },
    { name: 'Sannin', minLevel: 50 },
    { name: 'Kage', minLevel: 75 },
    { name: 'Leyenda', minLevel: 100 }
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

// 🍃 Función para obtener el top de usuarios
export function getTopUsers(limit = 10, by = 'exp') {
  const users = Object.values(data.users);
  const sorted = users.sort((a, b) => {
    if (by === 'exp') return b.exp - a.exp;
    if (by === 'level') return b.level - a.level;
    if (by === 'commands') return b.stats.totalCommands - a.stats.totalCommands;
    return 0;
  });
  return sorted.slice(0, limit);
}

// 🍃 Función para obtener estadísticas del bot
export function getBotStats() {
  const uptime = Date.now() - (data.stats.startTime || Date.now());
  const hours = Math.floor(uptime / 3600000);
  const minutes = Math.floor((uptime % 3600000) / 60000);
  const seconds = Math.floor((uptime % 60000) / 1000);
  
  return {
    users: Object.keys(data.users).length,
    groups: Object.keys(data.groups).length,
    commands: data.stats.commands || 0,
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    startTime: data.stats.startTime
  };
}

// 🍃 Función para reiniciar estadísticas
export function resetStats() {
  data.stats = {
    commands: 0,
    users: Object.keys(data.users).length,
    groups: Object.keys(data.groups).length,
    startTime: Date.now()
  };
  saveDatabase();
  console.log(chalk.green(`🍃 Estadísticas reiniciadas - ¡Nuevo entrenamiento!`));
}

// 🍃 Guardar datos cada 5 minutos
setInterval(() => {
  saveDatabase();
  console.log(chalk.gray(`🍃 Base de datos guardada automáticamente`));
}, 300000);

// 🍃 Exportar todo
export default {
  loadDatabase,
  saveDatabase,
  getUser,
  getGroup,
  getSettings,
  updateUserStats,
  updateGroupStats,
  addExp,
  getUserRank,
  getTopUsers,
  getBotStats,
  resetStats,
  data
};
