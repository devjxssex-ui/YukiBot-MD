// menu.js - Menú de comandos estilo Rock Lee 🍃
import fetch from 'node-fetch';
import { getDevice } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';
import moment from 'moment-timezone';
import { bodyMenu, menuObject } from '../../lib/commands.js';

function normalize(text = '') {
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  return text.endsWith('s') ? text.slice(0, -1) : text;
}

export default {
  command: ['allmenu', 'help', 'menu', 'comandos', 'ayuda'],
  category: 'info',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const now = new Date();
      const mexicoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' }));
      const tiempo = mexicoTime.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
      const tempo = moment.tz('America/Mexico_City').format('hh:mm A');
      const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net';
      const botSettings = global.db.data.settings[botId] || {};
      const botname = botSettings.botname || 'Rock Lee Bot';
      const namebot = botSettings.namebot || 'Rock Lee';
      const banner = botSettings.banner || global.defaultBanner || 'https://files.catbox.moe/ikre9z.jpg';
      const owner = botSettings.owner || '';
      const canalId = botSettings.id || '';
      const canalName = botSettings.nameid || 'Rock Lee Oficial';
      const prefix = botSettings.prefix;
      const link = botSettings.link || 'https://github.com/devjxssex-ui/YukiBot-MD';
      
      // 🍃 Enlaces de grupos oficiales
      const grupoOficial = 'https://chat.whatsapp.com/EndrcCsriueBIsd4r5RvLr';
      const grupoComunidad = 'https://chat.whatsapp.com/FKDOZ6q46EY9Xo5PuvUYT4';
      
      const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net';
      const botType = isOficialBot ? '👑 Sensei' : '🥷 Aprendiz';
      const users = Object.keys(global.db.data.users).length;
      const device = getDevice(m.key.id);
      const sender = global.db.data.users[m.sender]?.name || m.pushName || 'Aspirante';
      const time = client.uptime ? formatearMs(Date.now() - client.uptime) : "Desconocido";
      
      const alias = {
        anime: ['anime', 'reacciones'],
        downloads: ['downloads', 'descargas'],
        economia: ['economia', 'economy', 'eco'],
        gacha: ['gacha', 'rpg'],
        grupo: ['grupo', 'group'],
        nsfw: ['nsfw', '+18'],
        profile: ['profile', 'perfil'],
        sockets: ['sockets', 'bots'],
        stickers: ['stickers', 'sticker'],
        utils: ['utils', 'utilidades', 'herramientas']
      };
      
      const input = normalize(args[0] || '');
      const cat = Object.keys(alias).find(k => alias[k].map(normalize).includes(input));
      const category = `${cat ? ` para *${cat}*` : ''}`
      
      if (args[0] && !cat) {      
        return m.reply(`🍃 *CATEGORÍA NO ENCONTRADA* 🍃
        
❌ La categoría *${args[0]}* no existe.

📌 *Categorías disponibles:* ${Object.keys(alias).join(', ')}

💡 *Ejemplos:* 
┊ *${usedPrefix}menu anime*
┊ *${usedPrefix}menu downloads*
┊ *${usedPrefix}menu* (ver todas)

💚 *"Un ninja conoce todas las técnicas"*`);
      }
      
      const sections = menuObject;
      const content = cat ? String(sections[cat] || '') : Object.values(sections).map(s => String(s || '')).join('\n\n');
      let menu = bodyMenu ? String(bodyMenu || '') + '\n\n' + content : content;
      
      // 🍃 Agregar enlaces de grupos al menú
      const gruposInfo = `
🍃 *COMUNIDAD NINJA* 🍃

╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Únete a la comunidad* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Grupo Oficial:* ${grupoOficial}
┊  *Comunidad:* ${grupoComunidad}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Comparte técnicas, aprende y entrena*
┊➤ *La juventud explota en comunidad*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Juntos somos más fuertes"*`
      
      const replacements = {
        $owner: owner ? (!isNaN(owner.replace(/@s\.whatsapp\.net$/, '')) ? global.db.data.users[owner]?.name || owner.split('@')[0] : owner) : 'Oculto por privacidad',
        $botType: botType,
        $device: device,
        $tiempo: tiempo,
        $tempo: tempo,
        $users: users.toLocaleString(),
        $link: link,
        $cat: category,
        $sender: sender,
        $botname: botname,
        $namebot: namebot,
        $prefix: usedPrefix,
        $uptime: time,
        $grupoOficial: grupoOficial,
        $grupoComunidad: grupoComunidad
      };
      
      for (const [key, value] of Object.entries(replacements)) {
        menu = menu.replace(new RegExp(`\\${key}`, 'g'), value);
      }
      
      // 🍃 Agregar grupos al final si no están en bodyMenu
      if (!menu.includes('COMUNIDAD NINJA')) {
        menu += '\n\n' + gruposInfo;
      }
      
      const mentionedJid = [m.sender].filter(jid => jid && jid.includes('@'));
      
      await client.sendMessage(m.chat, banner.includes('.mp4') || banner.includes('.webm') ? {
        video: { url: banner },
        gifPlayback: true,
        caption: menu,
        contextInfo: {
          mentionedJid: mentionedJid,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalId,
            serverMessageId: '',
            newsletterName: canalName
          }
        }
      } : {
        text: menu,
        contextInfo: {
          mentionedJid: mentionedJid,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: canalId,
            serverMessageId: '',
            newsletterName: canalName
          },
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
      }, { quoted: m });
      
    } catch (e) {
      console.error('Error en menu:', e);
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al mostrar el menú.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
};

function formatearMs(ms) {
  const segundos = Math.floor(ms / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  return [dias && `${dias}d`, `${horas % 24}h`, `${minutos % 60}m`, `${segundos % 60}s`].filter(Boolean).join(" ");
}