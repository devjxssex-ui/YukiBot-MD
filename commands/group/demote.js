// demote.js - Degradar administradores estilo Rock Lee 🍃
export default {
  command: ['demote', 'degradar', 'quitaradmin'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const mentioned = await m.mentionedJid
      const who = mentioned.length > 0 ? mentioned[0] : m.quoted ? await m.quoted.sender : false
      
      if (!who) {
        return m.reply(`🍃 *DEGRADAR ADMIN* 🍃
        
❓ Uso: *${usedPrefix + command} @usuario*

📌 Ejemplo: *${usedPrefix + command} @usuario*

💚 *"Un ninja no pierde su rango sin motivo"*`)
      }
      
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      const participant = groupMetadata.participants.find((p) => p.phoneNumber === who || p.id === who || p.lid === who || p.jid === who)
      const userName = global.db.data.users[who]?.name || who.split('@')[0]
      
      // 🍃 Verificar si es administrador
      if (!participant?.admin) {
        return client.sendMessage(m.chat, { 
          text: `🍃 *NO ES ADMIN* 🍃\n\n❌ *@${who.split('@')[0]}* no es administrador del dojo *${groupName}*.\n\n💚 *"Solo se puede degradar a quien tiene rango"*`, 
          mentions: [who] 
        }, { quoted: m })
      }
      
      // 🍃 Verificar creador del grupo
      if (who === groupMetadata.owner) {
        return m.reply(`🍃 *NO SE PUEDE DEGRADAR* 🍃\n\n❌ No puedes degradar al *Creador del dojo*.\n\n💚 *"El fundador del dojo tiene un lugar sagrado"*`)
      }
      
      // 🍃 Verificar que no sea el bot
      if (who === client.user.jid) {
        return m.reply(`🍃 *NO SE PUEDE DEGRADAR* 🍃\n\n❌ No puedes degradar al *Sensei* del bot.\n\n💚 *"El sensei siempre mantiene su rango"*`)
      }
      
      await m.reply(`🍃 *DEGRADANDO NINJA* 🍃\n\n⏳ Procesando técnica de deshonor...\n\n💚 *"Con gran poder viene gran responsabilidad"*`)
      
      await client.groupParticipantsUpdate(m.chat, [who], 'demote')
      
      const successMsg = `🍃 *NINJA DEGRADADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* @${who.split('@')[0]}
┊  *Rango anterior:* Administrador
┊  *Nuevo rango:* Ninja regular
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ha sido degradado de su cargo*
┊➤ *Oportunidad para entrenar y recuperar su honor*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${userName}, el camino del ninja requiere humildad"*`
      
      await client.sendMessage(m.chat, { text: successMsg, mentions: [who] }, { quoted: m })
      
    } catch (e) {
      console.error('Error en demote:', e)
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al degradar al administrador.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}