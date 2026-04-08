// promote.js - Ascender ninjas a administradores estilo Rock Lee 🍃
export default {
  command: ['promote', 'ascender', 'haceradmin', 'subir'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const mentioned = await m.mentionedJid
      const who = mentioned.length > 0 ? mentioned[0] : m.quoted ? await m.quoted.sender : false
      
      if (!who) {
        return m.reply(`🍃 *ASCENDER NINJA* 🍃
        
❓ Uso: *${usedPrefix + command} @usuario*

📌 Ejemplo: *${usedPrefix + command} @usuario*

💚 *"Un ninja honorable merece reconocimiento"*`)
      }
      
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      const participant = groupMetadata.participants.find((p) => p.phoneNumber === who || p.id === who || p.lid === who || p.jid === who)
      const userName = global.db.data.users[who]?.name || who.split('@')[0]
      
      // 🍃 Verificar si ya es administrador
      if (participant?.admin) {
        return client.sendMessage(m.chat, { 
          text: `🍃 *YA ES ADMIN* 🍃\n\n❌ *@${who.split('@')[0]}* ya es administrador del dojo *${groupName}*.\n\n💚 *"El ninja ya tiene rango de líder"*`, 
          mentions: [who] 
        }, { quoted: m })
      }
      
      await m.reply(`🍃 *ASCENDIENDO NINJA* 🍃\n\n⏳ Procesando técnica de ascenso...\n\n📌 *Ninja:* @${who.split('@')[0]}\n📌 *Dojo:* ${groupName}\n\n💚 *"El trabajo duro es recompensado"*`, { mentions: [who] })
      
      await client.groupParticipantsUpdate(m.chat, [who], 'promote')
      
      const successMsg = `🍃 *NINJA ASCENDIDO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* @${who.split('@')[0]}
┊  *Rango anterior:* Ninja regular
┊  *Nuevo rango:* Administrador
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ha sido promovido a administrador del dojo*
┊➤ *Que su liderazgo guíe a los nuevos ninjas*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${userName}, que tu liderazgo sea tan fuerte como tu entrenamiento"*`
      
      await client.sendMessage(m.chat, { text: successMsg, mentions: [who] }, { quoted: m })
      
    } catch (e) {
      console.error('Error en promote:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para ascender a este ninja.\n\n💚 *"Asegúrate de que el sensei tenga los permisos necesarios"*`)
      }
      
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al ascender al ninja.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}