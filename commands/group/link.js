// link.js - Obtener enlace del grupo estilo Rock Lee 🍃
export default {
  command: ['link', 'enlace', 'invite', 'invitacion'],
  category: 'grupo',
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const code = await client.groupInviteCode(m.chat)
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      const link = `https://chat.whatsapp.com/${code}`
      
      const teks = `🍃 *ENLACE DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Solicitado por:* @${m.sender.split('@')[0]}
┊  *Enlace:* ${link}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Comparte este enlace con nuevos ninjas*
┊➤ *Usa ${usedPrefix}close para cerrar el dojo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La puerta del dojo está abierta para nuevos guerreros"*`
      
      await client.reply(m.chat, teks, m, { mentions: [m.sender] })
      
    } catch (e) {
      console.error('Error en link:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para obtener el enlace del grupo.\n\n💚 *"Asegúrate de que el sensei sea administrador"*`)
      }
      
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al obtener el enlace del dojo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}