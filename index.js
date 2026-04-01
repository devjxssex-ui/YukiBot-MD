import "./settings.js";
import main from './main.js';
import events from './commands/events.js';
import { Browsers, makeWASocket, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, jidDecode, DisconnectReason } from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import os from "os";
import { smsg } from "./lib/message.js";
import db from "./lib/system/database.js";
import { startSubBot } from './lib/subs.js';
import { exec } from "child_process";

const log = {
  info: (msg) => console.log(chalk.bgGreen.white.bold(`🍃 INFO`), chalk.white(msg)),
  success: (msg) => console.log(chalk.bgGreen.white.bold(`💚 SUCCESS`), chalk.greenBright(msg)),
  warn: (msg) => console.log(chalk.bgYellowBright.black.bold(`⚡ WARNING`), chalk.yellow(msg)),
  warning: (msg) => console.log(chalk.bgYellowBright.black.bold(`🔥 WARNING`), chalk.yellow(msg)),
  error: (msg) => console.log(chalk.bgRed.white.bold(`❌ ERROR`), chalk.redBright(msg))
};

const maxCache = 100;
let phoneNumber = global.botNumber || "";
let phoneInput = "";
const methodCodeQR = process.argv.includes("--qr");
const methodCode = process.argv.includes("code");
const DIGITS = (s = "") => String(s).replace(/\D/g, "");

function normalizePhoneForPairing(input) {
  let s = DIGITS(input);
  if (!s) return "";
  if (s.startsWith("0")) s = s.replace(/^0+/, "");
  if (s.length === 10 && s.startsWith("3")) s = "57" + s;
  if (s.startsWith("52") && !s.startsWith("521") && s.length >= 12) s = "521" + s.slice(2);
  if (s.startsWith("54") && !s.startsWith("549") && s.length >= 11) s = "549" + s.slice(2);
  return s;
}

// ==================== BANNER ÉPICO DE ROCK LEE ====================
console.clear()

cfonts.say("ROCK LEE", {
    font: "block",
    align: "center",
    colors: ["green", "yellow", "#00ff00"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    gradient: ["green", "yellow"]
})

cfonts.say("WHATSAPP BOT", {
    font: "console",
    align: "center",
    colors: ["cyan", "blue"],
    gradient: ["blue", "cyan"]
})

console.log(chalk.green("═".repeat(65)))

const frasesRockLee = [
    "💪 UN NINJA VERDADERO NUNCA SE RINDE!",
    "🍥 EL TRABAJO DURO VENCE AL TALENTO!",
    "⚡ ABRE LAS PUERTAS INTERNAS!",
    "🔥 MAITO GAI SENSEI!",
    "🌿 LA JUVENTUD EXPLOTA!",
    "🥋 8 PUERTAS: PUERTA DE LA MUERTE!",
    "🍜 DAME TU ENERGÍA!",
    "💚 EL PODER DE LA JUVENTUD!"
]

const fraseRandom = frasesRockLee[Math.floor(Math.random() * frasesRockLee.length)]
console.log(chalk.yellow.bold(`\n    " ${fraseRandom} "\n`))
console.log(chalk.green("═".repeat(65)))

console.log(chalk.green.bold("\n    🍃 EL NINJA DE LA HOJA VERDE 🍃\n"))
console.log(chalk.gray("═".repeat(65)))
console.log(chalk.cyan(`\n    📱 Versión: ${global.version || "1.0.0"}`))
console.log(chalk.cyan(`    👤 Owner: ${global.owner?.join(", ") || "Rock Lee"}`))
console.log(chalk.cyan(`    🎯 Estado: Iniciando...\n`))
console.log(chalk.gray("═".repeat(65)))
console.log()

const botTypes = [
  { name: 'SubBot', folder: './Sessions/Subs', starter: startSubBot }
];

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });
global.conns = global.conns || [];
const reconnecting = new Set();

async function loadBots() {
  for (const { name, folder, starter } of botTypes) {
    if (!fs.existsSync(folder)) continue;
    const botIds = fs.readdirSync(folder);
    for (const userId of botIds) {
      const sessionPath = path.join(folder, userId);
      const credsPath = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(credsPath)) continue;
      if (global.conns.some((conn) => conn.userId === userId)) continue;
      if (reconnecting.has(userId)) continue;
      try {
        reconnecting.add(userId);
        await starter(null, null, 'Auto reconexión', false, userId, sessionPath);
      } catch (e) {
        console.log(chalk.gray(`[ 🍃 ] Error iniciando ${name} ${userId}: ${e?.message || e}`));
      } finally {
        reconnecting.delete(userId);
      }
      await new Promise((res) => setTimeout(res, 2500));
    }
  }
  setTimeout(loadBots, 60 * 1000);
}

function cleanCache() {
  try {
    const tmpFolder = './tmp';
    if (fs.existsSync(tmpFolder)) {
      const files = fs.readdirSync(tmpFolder);
      let cleaned = 0;
      for (const file of files) {
        try { fs.unlinkSync(path.join(tmpFolder, file)); cleaned++; } catch {}
      }
      if (cleaned > 0) console.log(chalk.gray(`[ 🗑️ ] Cache tmp: ${cleaned} archivos eliminados`));
    }
    const sessionsFolder = './Sessions';
    if (fs.existsSync(sessionsFolder)) {
      const getFolderSizeMB = (dir) => {
        let total = 0;
        for (const file of fs.readdirSync(dir)) {
          try {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            total += stat.isDirectory() ? getFolderSizeMB(filePath) : stat.size;
          } catch {}
        }
        return total / (1024 * 1024);
      };
      const sizeMB = getFolderSizeMB(sessionsFolder);
      if (sizeMB > maxCache) {
        console.log(chalk.yellow(`[ ⚠ ] Sessions ${sizeMB.toFixed(1)}MB — limpiando...`));
        const safeDelete = (dir) => {
          for (const file of fs.readdirSync(dir)) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              safeDelete(filePath);
            } else if (!file.includes('creds') && !file.startsWith('session-')) {
              try { fs.unlinkSync(filePath); } catch {}
            }
          }
        };
        for (const botType of ['Owner', 'Subs']) {
          const botFolder = path.join(sessionsFolder, botType);
          if (fs.existsSync(botFolder)) safeDelete(botFolder);
        }
      }
    }
  } catch (e) {
    console.error(chalk.red('Error en cleanCache: '), e);
  }
}

let opcion;
if (methodCodeQR) {
  opcion = "1";
} else if (methodCode) {
  opcion = "2";
} else if (!fs.existsSync("./Sessions/Owner/creds.json")) {
  opcion = readlineSync.question(chalk.bold.white("\n🍃 Selecciona una opción:\n") + chalk.green("1. 📲 Con código QR\n") + chalk.yellow("2. 🔑 Con código de texto de 8 dígitos\n--> "));
  while (!/^[1-2]$/.test(opcion)) {
    console.log(chalk.bold.redBright(`❌ Opción no válida. Elige 1 o 2.`));
    opcion = readlineSync.question("--> ");
  }
  if (opcion === "2") {
    console.log(chalk.bold.green(`\n📱 Ingresa tu número de WhatsApp con código de país.\n${chalk.bold.yellow("Ejemplo: 527751962946")}\n${chalk.bold.magenta('---> ')}`));
    phoneInput = readlineSync.question("");
    phoneNumber = normalizePhoneForPairing(phoneInput);
  }
}

let reconexion = 0;
const intentos = 15;
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();
  const logger = pino({ level: "silent" });
  console.info = () => {};
  console.debug = () => {};
  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Rock Lee Bot'),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
    markOnlineOnConnect: false,  // 🔥 No mostrar "en línea" - Evita "Esperando mensaje"
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
    getMessage: async () => "",
    keepAliveIntervalMs: 45000,
    maxIdleTimeMs: 60000,
    // 🔥 Opciones para evitar "Esperando mensaje"
    options: {
      noPresence: true
    }
  });
  
  // 🔥 Ignorar actualizaciones de presencia (evita "Esperando mensaje")
  sock.ev.on("presence.update", () => {});
  
  global.client = sock;
  sock.isInit = false;
  sock.ev.on("creds.update", saveCreds);

  if (opcion === "2" && !fs.existsSync("./Sessions/Owner/creds.json")) {
    setTimeout(async () => {
      try {
        if (!state.creds.registered) {
          const pairing = await global.client.requestPairingCode(phoneNumber);
          const codeBot = pairing?.match(/.{1,4}/g)?.join("-") || pairing;
          console.log(chalk.bold.green(chalk.bgGreen.black(`🔑 CÓDIGO DE PAREAMIENTO:`)), chalk.bold.white(chalk.yellow(codeBot)));
          console.log(chalk.gray("📱 Ingresa este código en WhatsApp > Ajustes > Dispositivos vinculados\n"));
        }
      } catch (err) {
        console.log(chalk.red("❌ Error al generar código:"), err);
      }
    }, 3000);
  }

  sock.sendText = (jid, text, quoted = "", options) => sock.sendMessage(jid, { text, ...options }, { quoted });
  sock.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update;
    if (qr != 0 && qr != undefined || methodCodeQR) {
      if (opcion == '1' || methodCodeQR) {
        console.log(chalk.green.bold("\n📲 ESCANEA ESTE QR CON WHATSAPP:"));
        console.log(chalk.yellow("📍 WhatsApp > Ajustes > Dispositivos vinculados > Vincular dispositivo\n"));
        qrcode.generate(qr, { small: false });
        console.log(chalk.green("\n⏳ Esperando escaneo...\n"));
      }
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode || 0;
      if (reason === DisconnectReason.loggedOut) {
        log.warning("🔒 Sesión cerrada. Escanea nuevamente...");
        exec("rm -rf ./Sessions/Owner/*");
        process.exit(1);
      } else if (reason === DisconnectReason.forbidden) {
        log.error("❌ Error de conexión, escanea nuevamente...");
        exec("rm -rf ./Sessions/Owner/*");
        process.exit(1);
      } else if (reason === DisconnectReason.multideviceMismatch) {
        log.warning("🔄 Inicia nuevamente");
        exec("rm -rf ./Sessions/Owner/*");
        process.exit(0);
      } else if (reason === DisconnectReason.connectionReplaced) {
        log.warning("⚠️ Primero cierra la sesión actual...");
        return;
      } else {
        reconexion++;
        if (reconexion > intentos) {
          log.error(`❌ Demasiados reintentos (${intentos}). Reinicia manualmente.`);
          process.exit(1);
        }
        const delay = Math.min(3000 * reconexion, 30000);
        if (reason === DisconnectReason.connectionLost) log.warning("🌿 Se perdió la conexión, reconectando...");
        else if (reason === DisconnectReason.connectionClosed) log.warning("🔌 Conexión cerrada, reconectando...");
        else if (reason === DisconnectReason.restartRequired) log.warning("🔄 Reinicio necesario...");
        else if (reason === DisconnectReason.timedOut) log.warning("⏱️ Tiempo agotado, reconectando...");
        else if (reason === DisconnectReason.badSession) log.warning("🗑️ Elimina la sesión y escanea nuevamente...");
        else log.warning(`⚡ Desconexión (${reason}), reconectando...`);
        setTimeout(startBot, delay);
      }
    }

    if (connection === "open") {
      reconexion = 0;
      const userName = sock.user.name || "Rock Lee";
      console.log(chalk.green.bold(`\n✅ ¡BOT CONECTADO! 🍃`));
      console.log(chalk.blue(`📱 Conectado como: ${userName}`));
      console.log(chalk.blue(`🎮 Prefijos: ! . # /`));
      console.log(chalk.green(`\n💚 ¡LA JUVENTUD EXPLOTA! 💚\n`));
    }
    if (isNewLogin) log.info("🆕 Nuevo dispositivo detectado");
    if (receivedPendingNotifications === true) {
      log.warn("⏳ Cargando mensajes pendientes...");
      sock.ev.flush();
    }
  });

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const kay = chatUpdate.messages[0];
      if (!kay?.message) return;
      if (kay.key?.remoteJid === 'status@broadcast') return;
      kay.message = Object.keys(kay.message)[0] === 'ephemeralMessage' ? kay.message.ephemeralMessage.message : kay.message;
      if (kay.key.fromMe && kay.key.id.startsWith('3EB0')) return;
      const m = await smsg(sock, kay);
      main(sock, m, chatUpdate);
    } catch (err) {
      console.log(log.error('Error:'), err);
    }
  });
  try {
    await events(sock, null);
  } catch (err) {
    console.log(chalk.gray(`[ 🍃 ] → ${err}`));
  }

  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    }
    return jid;
  };
}

setInterval(cleanCache, 3 * 60 * 60 * 1000);
cleanCache();

(async () => {
await loadBots(); 
})();

(async () => {
global.loadDatabase()
console.log(chalk.gray('[ 🍃 ] Base de datos cargada correctamente.'))
await startBot();
})();

process.on('uncaughtException', (err) => {
  const msg = err?.message || '';
  if (msg.includes('rate-overlimit') || msg.includes('timed out') || msg.includes('Connection Closed')) return;
  console.error(chalk.red('[uncaughtException]'), msg.slice(0, 120));
});

process.on('unhandledRejection', (reason) => {
  const msg = String(reason?.message || reason || '');
  if (msg.includes('rate-overlimit') || msg.includes('timed out') || msg.includes('Connection Closed')) return;
  console.error(chalk.red('[unhandledRejection]'), msg.slice(0, 120));
});
