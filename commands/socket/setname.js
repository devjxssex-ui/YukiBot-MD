// setname.js - Configurar nombre del bot estilo Rock Lee 🍃
export default {
  command: ['setbotname', 'setname', 'nombre', 'cambiarnombre'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar el nombre del sensei"*`)
      }
      
      const value = args.join(' ').trim()
      
      if (!value) {
        return m.reply(`🍃 *CONFIGURAR NOMBRE* 🍃
        
❓ Uso: *${usedPrefix + command} <nombre corto> / <nombre largo>*\n
📌 Ejemplos:
┊ *${usedPrefix + command} Rock / Rock Lee Bot*
┊ *${usedPrefix + command} RL / Rock Lee - El ninja de la hoja verde*

💚 *"Un ninja elige su nombre con honor"*`)
      }
      
      // 🍃 Procesar formato
      const formatted = value.replace(/\s*\/\s*/g, '/')
      let [short, long] = formatted.includes('/') ? formatted.split('/') : [value, value]
      
      if (!short || !long) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ Usa el formato: *Nombre Corto / Nombre Largo*\n\n📌 Ejemplo: *${usedPrefix + command} Rock / Rock Lee Bot*\n\n💚 *"Un ninja usa el formato correcto"*`)
      }
      
      short = short.trim()
      long = long.trim()
      
      // 🍃 Validar nombre corto (sin espacios)
      if (/\s/.test(short)) {
        return m.reply(`🍃 *NOMBRE CORTO INVÁLIDO* 🍃\n\n❌ El nombre corto no puede contener espacios.\n\n📌 Ejemplo: *Rock* no *Rock Lee*\n\n💚 *"Un ninja usa nombres cortos y poderosos"*`)
      }
      
      // 🍃 Validar longitud
      if (short.length > 20) {
        return m.reply(`🍃 *NOMBRE CORTO DEMASIADO LARGO* 🍃\n\n❌ El nombre corto no puede tener más de *20 caracteres*.\n\n📌 *Actual:* ${short.length} caracteres\n\n💚 *"Un ninja usa nombres concisos"*`)
      }
      
      if (long.length > 50) {
        return m.reply(`🍃 *NOMBRE LARGO DEMASIADO LARGO* 🍃\n\n❌ El nombre largo no puede tener más de *50 caracteres*.\n\n📌 *Actual:* ${long.length} caracteres\n\n💚 *"Un ninja usa nombres con sabiduría"*`)
      }
      
      // 🍃 Validar caracteres prohibidos
      const invalidChars = /[<>:"/\\|?*]/g
      if (invalidChars.test(short) || invalidChars.test(long)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre no puede contener: *< > : " / \\ | ? *\n\n💚 *"Un ninja elige nombres con honor"*`)
      }
      
      const oldShort = config.namebot || 'Rock'
      const oldLong = config.botname || 'Rock Lee Bot'
      
      config.namebot = short
      config.botname = long
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *NOMBRE ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nombre del sensei* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Nombre anterior:* ${oldShort}
┊  *Nombre nuevo:* ${short}
┊┈─────̇─̇─̇─────◯◝
┊  *Título anterior:* ${oldLong.length > 40 ? oldLong.slice(0, 37) + '...' : oldLong}
┊  *Título nuevo:* ${long.length > 40 ? long.slice(0, 37) + '...' : long}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha renovado su identidad*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${short} - ${long.includes('Rock') || long.includes('Lee') ? '¡Un nombre digno de un ninja legendario!' : 'Un nuevo nombre para un nuevo comienzo'}"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setname:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el nombre del bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}