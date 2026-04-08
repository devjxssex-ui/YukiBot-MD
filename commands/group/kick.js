// kick.js - Expulsar ninjas del dojo estilo Rock Lee 🍃
export default {
  command: ['kick', 'expulsar', 'echar', 'banear'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (!m.mentionedJid[0] && !m.quoted) {
        return m.reply(`🍃 *EXPULSAR NINJA* 🍃
        
❓ Uso: *${usedPrefix + command} @usuario* o responde al mensaje del usuario

📌 Ejemplo: *${usedPrefix + command} @usuario*

💚 *"Un ninja que no respeta las reglas debe abandonar el dojo"*`)
      }
      
      let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
      const groupInfo = await client.groupMetadata(m.chat)
      const groupName = groupInfo.subject || 'este dojo'
      const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
      const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
      const participant = groupInfo.participants.find((p) => p.phoneNumber === user || p.jid === user || p.id === user || p.lid === user)
      const userName = global.db.data.users[user]?.name || user.split('@')[0]
      
      // 🍃 Verificar si el usuario está en el grupo
      if (!participant) {
        return client.reply(m.chat, `🍃 *NINJA NO ENCONTRADO* 🍃\n\n❌ *@${user.split('@')[0]}* ya no está en el dojo.\n\n💚 *"El ninja ya ha partido"*`, m, { mentions: [user] })
      }
      
      // 🍃 Verificar que no sea el bot
      if (user === client.decodeJid(client.user.id)) {
        return m.reply(`🍃 *NO SE PUEDE EXPULSAR* 🍃\n\n❌ No puedo expulsar al *Sensei* del bot.\n\n💚 *"El sensei siempre permanece en el dojo"*`)
      }
      
      // 🍃 Verificar que no sea el creador del grupo
      if (user === ownerGroup) {
        return m.reply(`🍃 *NO SE PUEDE EXPULSAR* 🍃\n\n❌ No puedo expulsar al *Fundador del dojo*.\n\n💚 *"El fundador tiene un lugar sagrado"*`)
      }
      
      // 🍃 Verificar que no sea el dueño del bot
      if (user === ownerBot) {
        return m.reply(`🍃 *NO SE PUEDE EXPULSAR* 🍃\n\n❌ No puedo expulsar al *Sensei supremo*.\n\n💚 *"El sensei supremo está por encima de todo"*`)
      }
      
      await m.reply(`🍃 *EXPULSANDO NINJA* 🍃\n\n⏳ Procesando técnica de expulsión...\n\n📌 *Ninja:* @${user.split('@')[0]}\n📌 *Dojo:* ${groupName}\n\n💚 *"Las reglas del dojo son para todos"*`, { mentions: [user] })
      
      await client.groupParticipantsUpdate(m.chat, [user], 'remove')
      
      const successMsg = `🍃 *NINJA EXPULSADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* @${user.split('@')[0]}
┊  *Razón:* Violación de las reglas del dojo
┊  *Estado:* ❌ Expulsado
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ha sido expulsado del dojo*
┊➤ *Que encuentre su camino en otro lugar*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${userName}, que tu camino ninja te lleve a aprender de tus errores"*`
      
      client.reply(m.chat, successMsg, m, { mentions: [user] })
      
    } catch (e) {
      console.error('Error en kick:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para expulsar a este ninja.\n\n💚 *"Asegúrate de que el sensei tenga los permisos necesarios"*`)
      }
      
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al expulsar al ninja.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}