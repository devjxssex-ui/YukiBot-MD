// setusername.js - Configurar nombre de usuario del bot estilo Rock Lee 🍃
export default {
  command: ['setusername', 'setnombre', 'nombreusuario', 'cambiarnombrewa'],
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
        // 🍃 Mostrar nombres sugeridos de Rock Lee
        const nombresSugeridos = [
          '🍃 Rock Lee',
          '💚 Rock Lee - El ninja de la hoja verde',
          '⚡ Rock Lee 🥋',
          '🔥 Maito Gai sensei',
          '🌿 El poder de la juventud',
          '🥋 Rock Lee 🍃',
          '💪 El ninja que nunca se rinde'
        ]
        const ejemplo = nombresSugeridos[Math.floor(Math.random() * nombresSugeridos.length)]
        
        return m.reply(`🍃 *CAMBIAR NOMBRE* 🍃
        
❓ Uso: *${usedPrefix + command} <nombre de usuario>*

📌 Ejemplos:
┊ *${usedPrefix + command} ${ejemplo}*
┊ *${usedPrefix + command} Rock Lee Bot*

💚 *"El sensei elige su nombre con honor"*`)
      }
      
      // 🍃 Validar longitud máxima (25 caracteres para nombre de WhatsApp)
      if (value.length > 25) {
        return m.reply(`🍃 *NOMBRE DEMASIADO LARGO* 🍃\n\n❌ El nombre de usuario no puede tener más de *25 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja usa nombres cortos y poderosos"*`)
      }
      
      // 🍃 Validar longitud mínima
      if (value.length < 3) {
        return m.reply(`🍃 *NOMBRE DEMASIADO CORTO* 🍃\n\n❌ El nombre de usuario debe tener al menos *3 caracteres*.\n\n📌 *Actual:* ${value.length} caracteres\n\n💚 *"Un ninja merece un nombre con honor"*`)
      }
      
      // 🍃 Validar caracteres prohibidos
      const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F<>:"/\\|?*]/g
      if (invalidChars.test(value)) {
        return m.reply(`🍃 *CARACTERES NO VÁLIDOS* 🍃\n\n❌ El nombre contiene caracteres no permitidos.\n\n📌 *Evita:* < > : " / \\ | ? *\n\n💚 *"Un ninja elige su nombre con sabiduría"*`)
      }
      
      const oldName = config.waname || client.user.name || 'Sin nombre'
      
      await m.reply(`🍃 *ACTUALIZANDO NOMBRE* 🍃\n\n⏳ Procesando técnica de renombre...\n\n💚 *"La juventud se renueva con cada nombre"*`)
      
      await client.updateProfileName(value)
      config.waname = value
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *NOMBRE ACTUALIZADO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nombre del sensei* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Nombre anterior:* ${oldName.length > 30 ? oldName.slice(0, 27) + '...' : oldName}
┊  *Nuevo nombre:* ${value}
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha renovado su identidad*
┊➤ *Todos los ninjas verán el nuevo nombre*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${value.includes('Rock') || value.includes('Lee') ? '¡Un nombre digno del ninja de la hoja verde!' : 'Un nuevo nombre para un nuevo camino'}"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en setusername:', e)
      
      // 🍃 Mensaje de error específico
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('permission')) {
        return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No se pudo cambiar el nombre. El bot necesita permisos.\n\n💚 *"Un ninja respeta las reglas del dojo"*`)
      }
      
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el nombre.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}