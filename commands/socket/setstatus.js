// setstatus.js - Configurar estado del bot estilo Rock Lee 🍃
export default {
  command: ['setstatus', 'estado', 'cambiarestado', 'frase'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede definir el lema"*`)
      }
      
      const value = args.join(' ').trim()
      
      if (!value) {
        // 🍃 Mostrar frases motivacionales de Rock Lee como ejemplo
        const frasesEjemplo = [
          '💪 Un ninja verdadero nunca se rinde!',
          '🍥 El trabajo duro vence al talento!',
          '⚡ Abre las puertas internas!',
          '🔥 Maito Gai sensei!',
          '🌿 La juventud explota!',
          '🥋 8 puertas: Puerta de la Muerte!',
          '💚 El poder de la juventud!'
        ]
        const ejemplo = frasesEjemplo[Math.floor(Math.random() * frasesEjemplo.length)]
        
        return m.reply(`🍃 *CAMBIAR ESTADO* 🍃
        
❓ Uso: *${usedPrefix + command} <frase o estado>*

📌 Ejemplos:
┊ *${usedPrefix + command} ${ejemplo}*
┊ *${usedPrefix + command} Rock Lee - El ninja de la hoja verde*

💚 *"El sensei inspira con sus palabras"*`)
      }
      
      // 🍃 Validar longitud máxima (100 caracteres para estado de WhatsApp)
      if (value.length > 100) {
        return m.reply(`🍃 *ESTADO DEMASIADO LARGO* 🍃\n\n❌ El estado no puede tener más de *100 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa palabras sabias y concisas"*`)
      }
      
      // 🍃 Validar caracteres prohibidos (evitar problemas)
      const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g
      if (invalidChars.test(value)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El estado contiene caracteres no permitidos.\n\n💚 *"Un ninja usa palabras con honor"*`)
      }
      
      const oldStatus = config.status || 'No configurado'
      
      await m.reply(`🍃 *ACTUALIZANDO ESTADO* 🍃\n\n⏳ Procesando técnica de motivación...\n\n💚 *"La juventud se expresa con palabras"*`)
      
      await client.updateProfileStatus(value)
      config.status = value
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *ESTADO ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Lema del sensei* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Estado anterior:* ${oldStatus.length > 40 ? oldStatus.slice(0, 37) + '...' : oldStatus}
┊  *Nuevo estado:* ${value.length > 40 ? value.slice(0, 37) + '...' : value}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha compartido un nuevo lema*
┊➤ *Todos los ninjas pueden verlo en su perfil*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${value.includes('Rock') || value.includes('ninja') || value.includes('juventud') ? '¡Un lema digno de un verdadero ninja!' : 'El dojo resuena con nuevas palabras'}"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setstatus:', e)
      
      // 🍃 Mensaje de error específico para problemas de WhatsApp
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('permission')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No se pudo cambiar el estado. El bot necesita permisos.\n\n💚 *"Un ninja respeta las reglas del dojo"*`)
      }
      
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el estado.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}