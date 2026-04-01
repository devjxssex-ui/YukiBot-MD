// setcurrency.js - Configurar moneda del bot estilo Rock Lee 🍃
export default {
  command: ['setbotcurrency', 'setcurrency', 'moneda', 'cambiar moneda'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar la moneda"*`)
      }
      
      const value = args.join(' ').trim()
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR MONEDA* 🍃
        
❓ Uso: *${usedPrefix + command} <nombre de la moneda>*

📌 Ejemplos:
┊ *${usedPrefix + command} Ryō*
┊ *${usedPrefix + command} ¥*
┊ *${usedPrefix + command} Monedas*

💚 *"Un ninja elige su tesoro con sabiduría"*`)
      }
      
      // Validar que no tenga caracteres raros
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(value)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre de la moneda no puede contener: *< > : " / \\ | ? *\n\n💚 *"Un ninja usa nombres con sabiduría"*`)
      }
      
      // Limitar longitud
      if (value.length > 30) {
        return m.reply(`🍃 *NOMBRE DEMASIADO LARGO* 🍃\n\n❌ El nombre de la moneda no puede tener más de *30 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa palabras precisas"*`)
      }
      
      const oldCurrency = config.currency || 'Ryō'
      config.currency = value
      
      const successMsg = `🍃 *MONEDA ACTUALIZADA* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Tesoro del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.botname || 'Rock Lee'}
┊  *Moneda anterior:* ${oldCurrency}
┊  *Nueva moneda:* ${value}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora la economía del bot usará ${value}*
┊➤ *Usa ${usedPrefix}bal para ver tu saldo*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${value === 'Ryō' || value === '¥' ? 'La moneda ninja original ha sido restaurada' : 'Una nueva era económica comienza en el dojo'}"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setcurrency:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar la moneda.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}