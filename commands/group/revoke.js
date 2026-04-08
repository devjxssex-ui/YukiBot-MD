
// revoke.js - Restablecer enlace del dojo estilo Rock Lee 🍃
export default {
  command: ['revoke', 'restablecer', 'resetlink', 'nuevoenlace'],
  category: 'grupo',
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupName = groupMetadata.subject || 'este dojo'
      
      await m.reply(`🍃 *RESTABLECIENDO ENLACE* 🍃\n\n⏳ Generando nueva puerta de entrada al dojo...\n\n📌 *Dojo:* ${groupName}\n\n💚 *"Un nuevo camino para nuevos ninjas"*`)
      await m.react('🕒')
      
      await client.groupRevokeInvite(m.chat)
      const code = await client.groupInviteCode(m.chat)
      const link = `https://chat.whatsapp.com/${code}`
      
      const teks = `🍃 *NUEVO ENLACE DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Solicitado por:* @${m.sender.split('@')[0]}
┊  *Nuevo enlace:* ${link}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El enlace anterior ya no funciona*
┊➤ *Comparte este nuevo enlace con los nuevos ninjas*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La puerta del dojo se ha renovado"*`
      
      await client.reply(m.chat, teks, m, { mentions: [m.sender] })
      await m.react('✅')
      
    } catch (e) {
      console.error('Error en revoke:', e)
      await m.react('❌')
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('admin')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No tengo permisos para restablecer el enlace del grupo.\n\n💚 *"Asegúrate de que el sensei sea administrador"*`)
      }
      
      await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al restablecer el enlace del dojo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}