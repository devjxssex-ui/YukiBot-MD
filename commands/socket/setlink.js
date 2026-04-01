// setlink.js - Configurar enlace del bot estilo Rock Lee 🍃
export default {
  command: ['setlink', 'setbotlink', 'enlace', 'cambiarlink'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar el enlace oficial"*`)
      }
      
      const value = args.join(' ').trim()
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR ENLACE* 🍃
        
❓ Uso: *${m.usedPrefix}setlink <url>*\n
📌 Ejemplo:
┊ *${m.usedPrefix}setlink https://github.com/devjxssex-ui/YukiBot-MD*
┊ *${m.usedPrefix}setlink https://whatsapp.com/channel/0029VbCogMA4IBh8kqwcES2c*

💚 *"Un ninja siempre comparte su camino"*`)
      }
      
      // 🍃 Validar formato de URL
      if (!/^https?:\/\//i.test(value)) {
        return m.reply(`🍃 *URL INVÁLIDA* 🍃\n\n❌ El enlace debe comenzar con *http://* o *https://*\n\n📌 Ejemplo: *${m.usedPrefix}setlink https://github.com/...*\n\n💚 *"Un ninja verifica sus coordenadas"*`)
      }
      
      // 🍃 Validar longitud máxima
      if (value.length > 500) {
        return m.reply(`🍃 *URL DEMASIADO LARGA* 🍃\n\n❌ El enlace no puede tener más de *500 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa enlaces cortos y precisos"*`)
      }
      
      const oldLink = config.link || 'No configurado'
      config.link = value
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *ENLACE ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Ruta del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Enlace anterior:* ${oldLink.length > 50 ? oldLink.slice(0, 47) + '...' : oldLink}
┊  *Nuevo enlace:* ${value.length > 50 ? value.slice(0, 47) + '...' : value}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora el bot mostrará este enlace en el menú*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo camino para los ninjas que buscan al sensei"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setlink:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar el enlace.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}