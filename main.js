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
  const pushname = m.pushName || 'Guerrero sin nombre';
  
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
  const tipo = settings.type || 'Sub';
  const cleanBotname = rawBotname.replace(/[^a-zA-Z0-9\s]/g, '')
  const namebot = cleanBotname || 'Rock Lee';
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
    console.log(chalk.bold.blue(`╭────────────────────────────···\n│ ${chalk.cyan('Bot')}: ${gradient('lime', 'green')(botJid)}\n│ ${chalk.bold.yellow('Fecha')}: ${gradient('orange', 'yellow')(moment().format('DD/MM/YY HH:mm:ss'))}\n│ ${chalk.bold.blueBright('Usuario')}: ${gradient('cyan', 'blue')(pushname)}\n│ ${chalk.bold.magentaBright('Remitente')}: ${gradient('deepskyblue', 'darkorchid')(sender)}\n${m.isGroup ? '│' + chalk.bold.green(' Grupo') + ': ' + gradient('green', 'lime')(groupName) : '│' + chalk.bold.green(' Privado') + ': ' + gradient('pink', 'magenta')('Chat Privado')}\n${'│' + chalk.bold.magenta(' ID') + ': ' + gradient('violet', 'midnightblue')(m.isGroup ? from : 'Chat Privado')}\n│ ${chalk.bold.cyanBright('TÉCNICA EJECUTADA')}: ${chalk.gray(command ? command : 'Sin técnica')}\n╰────────────────────────────···\n`));
  }
  
  const hasPrefix = settings.prefix === true ? true : (Array.isArray(settings.prefix) ? settings.prefix : typeof settings.prefix === 'string' ? [settings.prefix] : []).some(p => m.text?.startsWith(p));

  if (!isOwners && settings.self) return;  
  if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['allmenu', 'help', 'menu', 'infobot', 'botinfo', 'invite', 'invitar', 'ping', 'speed', 'p', 'status', 'estado', 'report', 'reporte', 'sug', 'suggest', 'token', 'join', 'unir', 'logout', 'reload', 'self', 'setbanner', 'setbotbanner', 'setchannel', 'setbotchannel', 'setbotcurrency', 'setcurrency', 'seticon', 'setboticon', 'setlink', 'setbotlink', 'setbotname', 'setname', 'setbotowner', 'setowner', 'setimage', 'setpfp', 'setprefix', 'setbotprefix', 'setstatus', 'setusername', 'code', 'qr']
    if (!global.owner.map(num => num + '@s.whatsapp.net').includes(sender) && !allowedInPrivateForUsers.includes(command)) return;
  }

  if (chat?.isBanned && !(command === 'bot' && text === 'on') && !global.mods.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`🚫 ¡EL ENTRENAMIENTO ESTÁ DETENIDO! 💥\nActiva el bot con *${usedPrefix}bot on*`);
    return;
  }  

  if (m.text && user.banned && !global.mods.map(num => num + '@s.whatsapp.net').includes(sender)) {
    await m.reply(`💀 ¡HAS SIDO DERROTADO! 💀\nNo puedes usar comandos.\n💪 ¡ENTRENA Y VUELVE MÁS FUERTE!`);
    return;
  }

  const cmdData = global.comandos.get(command);
  if (!cmdData) {
    return m.reply(`💥 ¡${command} NO EXISTE! 💪🔥\n¡USA *${usedPrefix}help* PARA MEJORAR!`);
  }

  try {
    await cmdData.run(client, m, args, usedPrefix, command, text);
  } catch (error) {
    await client.sendMessage(m.chat, { text: `💥 ¡FALLASTE LA TÉCNICA! 💥\n${error}` }, { quoted: m });
  }

  level(m);
};
