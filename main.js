import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './commands/antilink.js';
import level from './commands/level.js';
import { getGroupAdmins } from './lib/message.js';

seeCommands();

export default async (client, m) => {
  const sender = m.sender;
  let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || m.message.templateButtonReplyMessage?.selectedId || '';
  if ((m.id.startsWith("3EB0") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return
  initDB(m, client)
  antilink(client, m);

  const from = m.key.remoteJid;
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.lid;
  const chat = global.db.data.chats[m.chat] || {}
  const settings = global.db.data.settings[botJid] || {}
  const user = global.db.data.users[sender] ||= {}
  const users = chat.users[sender] || {}
  const pushname = m.pushName || 'Sin nombre';

  let groupMetadata = null
  let groupAdmins = []
  let groupName = ''
  if (m.isGroup) {
    groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    groupName = groupMetadata?.subject || ''
    groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
  }  
  const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid ) : false
  const isAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender ) : false
  const isOwners = [botJid, ...(settings.owner ? [settings.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(sender);

  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (plugin && typeof plugin.all === "function") {
      try {
        await plugin.all.call(client, m, { client });
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err);
      }
    }
  }

  const today = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  if (!users.stats) users.stats = {};
  if (!users.stats[today]) users.stats[today] = { msgs: 0, cmds: 0 };
  users.stats[today].msgs++;

  const rawBotname = settings.namebot || 'Rock Lee';
  const tipo = settings.type || 'Ninja';
  const cleanBotname = rawBotname.replace(/[^a-zA-Z0-9\s]/g, '')
  const namebot = cleanBotname || 'RockLee';
  const shortForms = [namebot.charAt(0), namebot.split(" ")[0], tipo.split(" ")[0], namebot.split(" ")[0].slice(0, 2), namebot.split(" ")[0].slice(0, 3)];
  const prefixes = shortForms.map(name => `${name}`);
  prefixes.unshift(namebot);
  let prefix;
  if (Array.isArray(settings.prefix) || typeof settings.prefix === 'string') {
    const prefixArray = Array.isArray(settings.prefix) ? settings.prefix : [settings.prefix];
    prefix = new RegExp('^(' + prefixes.join('|') + ')?(' + prefixArray.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i');
  } else if (settings.prefix === true) {
    prefix = new RegExp('^', 'i');
  } else {
    prefix = new RegExp('^(' + prefixes.join('|') + ')?', 'i');
  }
  const strRegex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  let pluginPrefix = client.prefix ? client.prefix : prefix;
  let matchs = pluginPrefix instanceof RegExp ? [[pluginPrefix.exec(m.text), pluginPrefix]] : Array.isArray(pluginPrefix) ? pluginPrefix.map(p => {
    let regex = p instanceof RegExp ? p : new RegExp(strRegex(p));
    return [regex.exec(m.text), regex];
  }) : typeof pluginPrefix === 'string' ? [[new RegExp(strRegex(pluginPrefix)).exec(m.text), new RegExp(strRegex(pluginPrefix))]] : [[null, null]];
  let match = matchs.find(p => p[0]);

  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin) continue;
    if (plugin.disabled) continue;
    if (typeof plugin.before === "function") {
      try {
        if (await plugin.before.call(client, m, { client })) {
          continue;
        }
      } catch (err) {
        console.error(`Error en plugin.all -> ${name}`, err);
      }
    }
  }

  if (!match) return;
  let usedPrefix = (match[0] || [])[0] || '';
  let args = m.text.slice(usedPrefix.length).trim().split(" ");
  let command = (args.shift() || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let text = args.join(' ');
  if (!command) return;

  const chatData = global.db.data.chats[from] || {};
  const consolePrimary = chatData.primaryBot;
  if (m.message || !consolePrimary || consolePrimary === botJid) {
    // 🔥 LOG MEJORADO CON ESTILO ROCK LEE Y IDs COMPLETOS
    const cleanSender = sender.replace("@s.whatsapp.net", "").replace("@g.us", "")
    const cleanBotJid = botJid.replace("@s.whatsapp.net", "")
    const cleanChat = m.isGroup ? from.replace("@g.us", "") : "Chat Privado"
    const chatType = m.isGroup ? "👥 GRUPO" : "💬 PRIVADO"
    
    console.log(chalk.green.bold(`\n🍃 ${"═".repeat(60)}`))
    console.log(chalk.yellow.bold(`⚡ COMANDO RECIBIDO - ROCK LEE STYLE`))
    console.log(chalk.green(`🍃 ${"═".repeat(60)}`))
    console.log(chalk.cyan(`📝 Comando: ${chalk.green.bold(command)}`))
    console.log(chalk.blue(`👤 Usuario: ${pushname}`))
    console.log(chalk.yellow(`🆔 User ID: ${cleanSender}`))
    console.log(chalk.magenta(`💬 Chat ID: ${cleanChat}`))
    console.log(chalk.white(`🏷️ Tipo: ${chatType}`))
    console.log(chalk.gray(`🤖 Bot ID: ${cleanBotJid}`))
    if (m.isGroup) {
      console.log(chalk.green(`📛 Grupo: ${groupName}`))
    }
    if (text) {
      console.log(chalk.gray(`📌 Args: ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}`))
    }
    console.log(chalk.green(`🍃 ${"═".repeat(60)}\n`))
  }

  const hasPrefix = settings.prefix === true ? true : (Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : []).some(p => m.text?.startsWith(p));
  function getAllSessionBots() {
    const sessionDirs = ['./Sessions/Subs']
    let bots = []
    for (const dir of sessionDirs) {
      try {
        const subDirs = fs.readdirSync(path.resolve(dir))
        for (const sub of subDirs) {
          const credsPath = path.resolve(dir, sub, 'creds.json')
          if (fs.existsSync(credsPath)) {
            bots.push(sub + '@s.whatsapp.net')
          }
        }
      } catch {}
    }
    try {
      const ownerCreds = path.resolve('./Sessions/Owner/creds.json')
      if (fs.existsSync(ownerCreds)) {
        const ownerId = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
        bots.push(ownerId)
      }
    } catch {}
    return bots;
  }
  const botprimaryId = chat?.primaryBot
  if (botprimaryId && botprimaryId !== botJid) {
    if (hasPrefix) {
      const participants = m.isGroup ? (await client.groupMetadata(m.chat).catch(() => ({ participants: [] }))).participants : []
      const primaryInGroup = participants.some(p => (p.phoneNumber || p.id) === botprimaryId)
      const isPrimarySelf = botprimaryId === botJid
      const primaryInSessions = getAllSessionBots().includes(botprimaryId)
      if (!primaryInSessions || !primaryInGroup) {
        return
      }
      if ((primaryInSessions && primaryInGroup) || isPrimarySelf) {
        return;
      }
    }
  }

  if (!isOwners && settings.self) return;  
  if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['allmenu', 'help', 'menu', 'infobot', 'botinfo', 'invite', 'invitar', 'ping', 'speed', 'p', 'status', 'estado', 'report', 'reporte', 'sug', 'suggest', 'token', 'join', 'unir', 'logout', 'reload', 'self', 'setbanner', 'setbotbanner', 'setchannel', 'setbotchannel', 'setbotcurrency', 'setcurrency', 'seticon', 'setboticon', 'setlink', 'setbotlink', 'setbotname', 'setname', 'setbotowner', 'setowner', 'setimage', 'setpfp', 'setprefix', 'setbotprefix', 'setstatus', 'setusername', 'code', 'qr']
    if (!global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !allowedInPrivateForUsers.includes(command)) return;
  }
  if (chat?.isBanned && !(command === 'bot' && text === 'on') && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`🍃 *EL NINJA ESTÁ ENTRENANDO* 🍃\n\n> El bot *${settings.botname || "Rock Lee"}* está desactivado en este grupo.\n\n✎ Un *administrador* puede activarlo con:\n» *${usedPrefix}bot on*\n\n💚 *"La juventud nunca falla!"*`);
    return;
  }
  if (m.text && user.banned && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`🍃 *ESTÁS BANEADO* 🍃\n\n> ${user.genre === 'Mujer' ? 'Baneada' : user.genre === 'Hombre' ? 'Baneado' : 'Baneado/a'} del bot.\n\n● *Razón:* ${user.bannedReason || 'Sin especificar'}\n\n💪 *"Un ninja verdadero nunca se rinde, pero debe respetar las reglas"*`);
    return;
  }

  if (!users.stats) users.stats = {};
  if (!users.stats[today]) users.stats[today] = { msgs: 0, cmds: 0 }; 
  if (chat.adminonly && !isAdmins) return;
  const cmdData = global.comandos.get(command);
  if (!cmdData) {
    if (settings.prefix === true) return;
    await client.readMessages([m.key]);
    return m.reply(`🍃 *COMANDO NO ENCONTRADO* 🍃\n\n❌ El comando *${command}* no existe.\n✎ Usa *${usedPrefix}menu* para ver la lista de técnicas ninja.\n\n💚 *"El trabajo duro te llevará más lejos"*`);
  }
  if (cmdData.isOwner && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
    if (settings.prefix === true) return;
    return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei*.\n\n💪 *"Solo el dueño del dojo puede usar esta técnica"*`);
  }
  if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, mess.admin, m);
  if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, mess.botAdmin, m);
  try {
    await client.readMessages([m.key]);
    user.usedcommands = (user.usedcommands || 0) + 1;
    settings.commandsejecut = (settings.commandsejecut || 0) + 1;
    users.usedTime = new Date();
    users.lastCmd = Date.now();
    user.exp = (user.exp || 0) + Math.floor(Math.random() * 100);
    user.name = m.pushName;
    users.stats[today].cmds++;
    await cmdData.run(client, m, args, usedPrefix, command, text);
  } catch (error) {
    console.log(chalk.red(`❌ Error en comando ${command}: ${error.message}`));
    await client.sendMessage(m.chat, { text: `🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al ejecutar *${command}*\n\n📌 *Detalle:* ${error.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero se levanta después de caer"*` }, { quoted: m });
  }
  level(m);
};
