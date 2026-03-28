import "./settings.js"
import main from './main.js'
import events from './commands/events.js'
import { Browsers, makeWASocket, makeCacheableSignalKeyStore, useMultiFileAuthState, fetchLatestBaileysVersion, jidDecode, DisconnectReason } from "@whiskeysockets/baileys";
import cfonts from 'cfonts';
import pino from "pino";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readlineSync from "readline-sync";
import { smsg } from "./lib/message.js";
import db from "./lib/system/database.js";
import { startSubBot } from './lib/subs.js';
import { exec } from "child_process";

const estiloLee = (texto) => {
  return `💪🔥 ¡${texto.toUpperCase()}! ¡EL PODER DE LA JUVENTUD NUNCA SE RINDE!`;
};

const log = {
  info: (msg) => console.log(chalk.bgBlue.white.bold(`INFO`), chalk.white(msg)),
  success: (msg) => console.log(chalk.bgGreen.white.bold(`SUCCESS`), chalk.greenBright(msg)),
  warn: (msg) => console.log(chalk.bgYellowBright.blueBright.bold(`WARNING`), chalk.yellow(msg)),
  error: (msg) => console.log(chalk.bgRed.white.bold(`ERROR`), chalk.redBright(msg)),
};

const { say } = cfonts

console.log(chalk.magentaBright('\n❀ Iniciando...'))
say('Rock Lee', {
  align: 'center',
  gradient: ['green', 'yellow']
})
say('Trabajo duro de Devjxssex', {
  font: 'console',
  align: 'center',
  gradient: ['green', 'white']
})

const BOT_TYPES = [
  { name: 'SubBot', folder: './Sessions/Subs', starter: startSubBot }
]

if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp', { recursive: true });
global.conns = global.conns || []

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
  const { version } = await fetchLatestBaileysVersion()
  const logger = pino({ level: "silent" })

  const client = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.macOS('Chrome'),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
  })

  global.client = client
  client.ev.on("creds.update", saveCreds)

  client.ev.on("connection.update", async (update) => {
    const { qr, connection } = update    

    if (qr) {
      console.log(chalk.green.bold("💥 ¡ESCANEA EL QR Y DEMUESTRA TU PODER!"))
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      const userName = client.user.name || "Guerrero"
      console.log(estiloLee(`conectado a ${userName}`))
    }

    if (connection === "close") {
      console.log(estiloLee("la conexión se perdió, pero volveré más fuerte"))
      startBot()
    }
  })

  client.ev.on("messages.upsert", async ({ messages }) => {
    try {
      let m = messages[0]
      if (!m.message) return

      m = await smsg(client, m)
      main(client, m, messages)
    } catch (err) {
      console.log(err)
    }
  })

  await events(client)
}

(async () => {
  global.loadDatabase()
  console.log(chalk.gray('[ ✿ ] Base de datos lista.'))
  await startBot()
})()
