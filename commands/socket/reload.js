// reload.js - Reiniciar sub-bots estilo Rock Lee 🍃
import { startSubBot } from '../../lib/subs.js';
import fs from 'fs';
import path from 'path';
import { jidDecode } from '@whiskeysockets/baileys';

export default {
  command: ['reload', 'reiniciar', 'resetear'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const rawId = client.user?.id || ''
      const decoded = jidDecode(rawId)
      const cleanId = decoded?.user || rawId.split('@')[0]
      const sessionTypes = ['Subs']
      const basePath = 'Sessions'
      const sessionPath = sessionTypes.map((type) => path.join(basePath, type, cleanId)).find((p) => fs.existsSync(p))
      
      if (!sessionPath) {
        return m.reply(`🍃 *NO ES UN SUB-BOT* 🍃\n\n❌ Este comando solo puede ser usado desde una instancia de *Sub-Bot*.\n\n💚 *"El bot principal no necesita reiniciarse así"*`)
      }
      
      const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net' || ''
      const botSettings = global.db.data.settings[botId] || {}
      const isOficialBot = botId === global.client.user.id.split(':')[0] + '@s.whatsapp.net'
      const botType = isOficialBot ? 'Principal/Owner' : 'Sub Bot'
      const phone = args[0] ? args[0].replace(/\D/g, '') : m.sender.split('@')[0]
      const chatId = m.chat
      
      await m.reply(`🍃 *REINICIANDO NINJA* 🍃\n\n⏳ Procesando técnica de renovación...\n\n📌 *Ninja:* @${cleanId}\n📌 *Tipo:* ${botType}\n\n💚 *"Un ninja renace más fuerte cada día"*`, { mentions: [m.sender] })
      
      if (botType === 'Sub Bot') {
        startSubBot(m, client, `🍃 *NINJA RENACIDO* 🍃\n\n✅ Sesión del sub-bot reiniciada correctamente.\n\n💚 *"La juventud nunca muere"*`, false, phone, chatId, {}, true)
      }
      
      const successMsg = `🍃 *NINJA REINICIADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Renovación ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* @${cleanId}
┊  *Tipo:* ${botType}
┊  *Estado:* ✅ Reiniciado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El ninja ha renovado sus técnicas*
┊➤ *Listo para nuevas aventuras*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${botType === 'Sub Bot' ? 'Un ninja siempre puede renacer' : 'El sensei nunca necesita reiniciarse'}"*`
      
      await client.reply(m.chat, successMsg, m, { mentions: [m.sender] })
      
    } catch (e) {
      console.error('Error en reload:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al reiniciar el sub-bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}