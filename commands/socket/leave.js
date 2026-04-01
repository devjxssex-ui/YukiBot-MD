// leave.js - Salir de grupos estilo Rock Lee 🍃
export default {
  command: ['leave', 'salir', 'abandonar'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const db = global.db.data
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const isOwner = db.settings[botId]?.owner
      const isSocketOwner = [botId, ...(isOwner ? [isOwner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isSocketOwner) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede ordenar esta técnica"*`)
      }
      
      let groupId = args[0] || m.chat
      let groupName = 'este dojo'
      
      // Obtener nombre del grupo si es posible
      try {
        if (groupId === m.chat && m.isGroup) {
          const metadata = await client.groupMetadata(groupId).catch(() => null)
          if (metadata) groupName = metadata.subject
        }
      } catch {}
      
      await m.reply(`🍃 *ABANDONANDO EL DOJO* 🍃\n\n⏳ Procesando técnica de retiro...\n\n📌 *Abandonando:* ${groupName}\n\n💚 *"Un ninja sabe cuándo es momento de partir"*`)
      
      try {
        await client.groupLeave(groupId)
        
        const successMsg = `🍃 *DOJO ABANDONADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Misión completada* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Dojo:* ${groupName}
┊  *Sensei:* ${db.settings[botId]?.botname || 'Rock Lee'}
┊  *Estado:* ✅ Retirado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El ninja se retira en busca de nuevos caminos*
┊➤ *Siempre estaré entrenando para volver más fuerte*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja verdadero sabe cuándo despedirse"*`
        
        if (groupId === m.chat) {
          await client.sendMessage(groupId, { text: successMsg }).catch(() => {})
        } else {
          await m.reply(successMsg)
        }
        
      } catch (e) {
        const errMsg = String(e.message || e)
        
        if (errMsg.includes('not-authorized') || errMsg.includes('not in group')) {
          await m.reply(`🍃 *NO SE PUDO ABANDONAR* 🍃\n\n❌ El bot ya no está en ese grupo o no tiene permisos.\n\n💚 *"Un ninja no puede abandonar lo que ya dejó"*`)
        } else if (errMsg.includes('last admin')) {
          await m.reply(`🍃 *NO SE PUDO ABANDONAR* 🍃\n\n❌ No se puede abandonar el grupo porque el bot es el *último administrador*.\n\n📌 *Nombra otro administrador antes de irte*\n\n💚 *"Un ninja nunca deja un dojo desprotegido"*`)
        } else {
          await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo abandonar el grupo.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
        }
      }
      
    } catch (e) {
      console.error('Error en leave:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al intentar abandonar el grupo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}