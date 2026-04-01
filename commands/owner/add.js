// add.js - Añadir monedas o experiencia estilo Rock Lee 🍃
import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['addcoin', 'addxp', 'darcoins', 'darxp'],
  isOwner: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const mentioned = m.mentionedJid
      const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : null)
      const who = await resolveLidToRealJid(who2, client, m.chat)
      const bot = global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net']
      const currency = bot.currency || 'Ryō'
      
      // 🍃 AÑADIR MONEDAS
      if (command === 'addcoin' || command === 'darcoins') {
        if (!who) {
          return client.reply(m.chat, `🍃 *AÑADIR MONEDAS* 🍃\n\n❓ Menciona al ninja o cita su mensaje.\n\n📌 Ejemplo: *${usedPrefix + command} @usuario 100*\n\n💚 *"Un ninja comparte su tesoro"*`, m)
        }
        
        const coinTxt = args.find(arg => !isNaN(arg) && !arg.includes('@'))
        if (!coinTxt) {
          return client.reply(m.chat, `🍃 *CANTIDAD REQUERIDA* 🍃\n\n❓ Ingresa la cantidad de *${currency}* que deseas añadir.\n\n📌 Ejemplo: *${usedPrefix + command} @usuario 100*\n\n💚 *"La generosidad es virtud ninja"*`, m)
        }
        
        if (isNaN(coinTxt)) {
          return client.reply(m.chat, `🍃 *SOLO NÚMEROS* 🍃\n\n❌ Solo se permiten números para la cantidad.\n\n💚 *"Un ninja usa números precisos"*`, m)
        }
        
        await m.react('🕒')
        const dmt = parseInt(coinTxt)
        
        if (dmt < 1) {
          await m.react('❌')
          return client.reply(m.chat, `🍃 *CANTIDAD MÍNIMA* 🍃\n\n❌ Mínimo es *1 ${currency}*\n\n💚 *"Cada moneda cuenta en el entrenamiento"*`, m)
        }
        
        if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = { users: {} }
        if (!global.db.data.chats[m.chat].users) global.db.data.chats[m.chat].users = {}
        const userData = global.db.data.chats[m.chat].users
        if (!userData[who]) {
          userData[who] = { coins: 0 }
        }
        
        userData[who].coins += dmt
        await m.react('✅')
        
        const successMsg = `🍃 *TESORO ENTREGADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Recompensa ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Cantidad:* ${dmt} ${currency}
┊  *Destinatario:* @${who.split('@')[0]}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El tesoro ha sido entregado*
┊➤ *Usa !bal para ver tu saldo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${dmt > 500 ? '¡Un tesoro digno de un gran ninja!' : 'La generosidad fortalece el dojo'}"*`
        
        return client.reply(m.chat, successMsg, m, { mentions: [who] })
      }
      
      // 🍃 AÑADIR EXPERIENCIA
      if (command === 'addxp' || command === 'darxp') {
        if (!who) {
          return client.reply(m.chat, `🍃 *AÑADIR EXPERIENCIA* 🍃\n\n❓ Menciona al ninja o cita su mensaje.\n\n📌 Ejemplo: *${usedPrefix + command} @usuario 50*\n\n💚 *"El sensei reconoce el esfuerzo"*`, m)
        }
        
        const xpTxt = args.find(arg => !isNaN(arg) && !arg.includes('@'))
        if (!xpTxt) {
          return client.reply(m.chat, `🍃 *CANTIDAD REQUERIDA* 🍃\n\n❓ Ingresa la cantidad de *XP* que deseas añadir.\n\n📌 Ejemplo: *${usedPrefix + command} @usuario 50*\n\n💚 *"La experiencia se gana con entrenamiento"*`, m)
        }
        
        if (isNaN(xpTxt)) {
          return client.reply(m.chat, `🍃 *SOLO NÚMEROS* 🍃\n\n❌ Solo se permiten números para la experiencia.\n\n💚 *"Un ninja usa números precisos"*`, m)
        }
        
        await m.react('🕒')
        const xp = parseInt(xpTxt)
        
        if (xp < 1) {
          await m.react('❌')
          return client.reply(m.chat, `🍃 *CANTIDAD MÍNIMA* 🍃\n\n❌ Mínimo de experiencia es *1 XP*\n\n💚 *"Cada XP cuenta en el camino ninja"*`, m)
        }
        
        if (!global.db.data.users) global.db.data.users = {}
        const userData = global.db.data.users
        if (!userData[who]) {
          userData[who] = { exp: 0, level: 1 }
        }
        
        const oldExp = userData[who].exp || 0
        const oldLevel = userData[who].level || 1
        userData[who].exp = (userData[who].exp || 0) + xp
        
        // Verificar subida de nivel
        const expNeeded = (userData[who].level || 1) * 100
        let leveledUp = false
        while (userData[who].exp >= expNeeded) {
          userData[who].exp -= expNeeded
          userData[who].level = (userData[who].level || 1) + 1
          leveledUp = true
        }
        
        await m.react('✅')
        
        let levelUpMsg = ''
        if (leveledUp) {
          levelUpMsg = `\n\n✨ *¡SUBIDA DE NIVEL!* ✨\n📈 Nivel ${oldLevel} → ${userData[who].level}`
        }
        
        const successMsg = `🍃 *EXPERIENCIA ENTREGADA* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Entrenamiento ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Cantidad:* +${xp} XP
┊  *Destinatario:* @${who.split('@')[0]}
┊  *Experiencia total:* ${userData[who].exp} XP
┊  *Nivel actual:* ${userData[who].level}${levelUpMsg}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei reconoce tu esfuerzo*
┊➤ *Sigue entrenando duro*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${xp > 100 ? '¡Un gran salto en el entrenamiento!' : 'Cada paso cuenta en el camino ninja'}"*`
        
        return client.reply(m.chat, successMsg, m, { mentions: [who] })
      }
      
    } catch (error) {
      console.error(error)
      await m.react('❌')
      return client.reply(m.chat, `🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un problema al añadir la recompensa.\n\n📌 *Detalle:* ${error.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`, m)
    }
  }
}