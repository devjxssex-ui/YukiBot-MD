import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

// 🍃 ROCK LEE BOT - CONFIGURACIÓN NINJA 🍃

// 💚 DUEÑO DEL DOJO (solo tu número)
global.owner = ['527751962946']  // Tu número de WhatsApp

// 🍃 CONFIGURACIÓN DEL BOT
global.botNumber = ''
global.sessionName = 'Sessions/Owner'
global.version = '🍃 Rock Lee Bot v3.0 - El ninja de la hoja verde 🌿'
global.dev = "© Powered by Rock Lee 🍃💚"

// 🍃 REDES Y CANAL OFICIAL (sin APIs)
global.links = {
  channel: "https://whatsapp.com/channel/0029VbCogMA4IBh8kqwcES2c",
  github: "",
  gmail: "devjxssex@gmail.com"
}

// 🍃 CANAL OFICIAL DE ROCK LEE
global.my = {
  ch: '120363401404146384@newsletter',
  name: '. ₊ ⊹ ʀօƈӄ ʟɛɛ . ⟡ . օʄʄɨƈɨǟʟ ƈɦǟ̈̄ռռɛʟ . ݁₊ ⊹ . ݁ ⊹',
}

// 🍃 MENSAJES DE PERMISOS CON ESTILO NINJA
global.mess = {
  socket: '《🍃》 Este comando solo puede ser ejecutado por el *Sensei* (dueño del dojo).',
  admin: '《🍃》 Este comando solo puede ser ejecutado por los *Administradores del Grupo* (ninjas de alto rango).',
  botAdmin: '《🍃》 Este comando solo puede ser ejecutado si el *Bot es Administrador* del grupo.'
}

// 🍃 NO HAY APIs - Todo se hará con SCRAPERS
// El bot usa scrapers locales para obtener información:
// - YouTube: ytdl-core, ytsr
// - TikTok: tiktok-scraper
// - Instagram: instagram-scraper
// - Facebook: fb-downloader
// - Anime: mal-scraper, otakudesu-scraper
// - Música: spotify-url-info
// - Letras: genius-lyrics

global.APIs = {}  // Vacío - sin APIs externas

// 🍃 Iconos por defecto de Rock Lee
global.defaultIcon = 'https://files.catbox.moe/zkerqt.jpg'      // Icono principal (#6)
global.defaultMenuIcon = 'https://files.catbox.moe/twzkhn.jpg'  // Icono para el menú (#2)
global.defaultBanner = 'https://files.catbox.moe/ikre9z.jpg'    // Banner principal
global.defaultWelcomeIcon = 'https://files.catbox.moe/7m6zl6.jpg'   // Icono bienvenida
global.defaultGoodbyeIcon = 'https://files.catbox.moe/kq3qfy.jpg'   // Icono despedida
global.defaultStickerIcon = 'https://files.catbox.moe/66jxvc.jpg'   // Icono stickers
global.defaultProfileIcon = 'https://files.catbox.moe/bqev9u.jpg'   // Icono perfil
global.defaultEconomyIcon = 'https://files.catbox.moe/2io49g.jpg'   // Icono economía

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
