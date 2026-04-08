// options.js - Configurar opciones del dojo estilo Rock Lee 🍃
export default {
  command: [
    'welcome', 'bienvenida',
    'goodbye', 'despedida',
    'alerts', 'alertas',
    'nsfw',
    'antilink', 'antienlaces', 'antilinks',
    'rpg', 'economy', 'economia',
    'gacha',
    'adminonly', 'onlyadmin'
  ],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chatData = global.db.data.chats[m.chat]
      const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
      const groupName = groupMetadata?.subject || 'este dojo'
      const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
      const botname = global.db.data.settings[botId]?.botname || 'Rock Lee Bot'
      
      const stateArg = args[0]?.toLowerCase()
      const validStates = ['on', 'off', 'enable', 'disable', 'activar', 'desactivar']
      
      const mapTerms = {
        antilinks: 'antilinks',
        antienlaces: 'antilinks',
        antilink: 'antilinks',
        welcome: 'welcome',
        bienvenida: 'welcome',
        goodbye: 'goodbye',
        despedida: 'goodbye',
        alerts: 'alerts',
        alertas: 'alerts',
        economy: 'economy',      
        economia: 'economy',
        adminonly: 'adminonly',
        onlyadmin: 'adminonly',
        nsfw: 'nsfw',
        rpg: 'gacha',
        gacha: 'gacha'
      }
      
      const featureNames = {
        antilinks: 'el *AntiEnlace* (protección del dojo)',
        welcome: 'el mensaje de *Bienvenida* (nuevos ninjas)',
        goodbye: 'el mensaje de *Despedida* (ninjas que parten)',
        alerts: 'las *Alertas* (cambios en el dojo)',
        economy: 'los comandos de *Economía* (Ryō y tesoros)',
        gacha: 'los comandos de *Gacha* (reclutar personajes)',
        adminonly: 'el modo *Solo Admin* (solo líderes pueden hablar)',
        nsfw: 'los comandos *NSFW* (contenido adulto)'
      }
      
      const featureTitles = {
        antilinks: '🛡️ AntiEnlace',
        welcome: '🍃 Bienvenida',
        goodbye: '🍂 Despedida',
        alerts: '⚠️ Alertas',
        economy: '💰 Economía',
        gacha: '🎴 Gacha',
        adminonly: '👑 AdminOnly',
        nsfw: '🔞 NSFW'
      }
      
      const normalizedKey = mapTerms[command] || command
      const current = chatData[normalizedKey] === true
      const estadoEmoji = current ? '✅ Activado' : '❌ Desactivado'
      const nombreBonito = featureNames[normalizedKey] || `la función *${normalizedKey}*`
      const titulo = featureTitles[normalizedKey] || normalizedKey
      
      // 🍃 Mostrar estado actual
      if (!stateArg) {
        const infoMsg = `🍃 *${titulo}* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Función:* ${nombreBonito}
┊  *Estado:* ${estadoEmoji}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Activar:* ${usedPrefix + normalizedKey} on
┊➤ *Desactivar:* ${usedPrefix + normalizedKey} off
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja administrador puede cambiar estas configuraciones"*`
        
        return client.reply(m.chat, infoMsg, m)
      }
      
      // 🍃 Validar estado
      if (!validStates.includes(stateArg)) {
        return m.reply(`🍃 *ESTADO NO VÁLIDO* 🍃\n\n❓ Usa: *on*, *off*, *enable*, *disable*, *activar* o *desactivar*\n\n📌 Ejemplo:\n*${usedPrefix}${normalizedKey} on*\n\n💚 *"Un ninja usa los comandos correctamente"*`)
      }
      
      const enabled = ['on', 'enable', 'activar'].includes(stateArg)
      const estadoTexto = enabled ? 'activado' : 'desactivado'
      const emojiEstado = enabled ? '✅' : '❌'
      
      if (chatData[normalizedKey] === enabled) {
        return m.reply(`🍃 *YA ESTABA ${estadoTexto.toUpperCase()}* 🍃\n\n${emojiEstado} *${titulo}* ya estaba *${estadoTexto}* en el dojo.\n\n💚 *"La configuración ya estaba como la deseas"*`)
      }
      
      chatData[normalizedKey] = enabled
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *FUNCIÓN ${estadoTexto.toUpperCase()}* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Dojo: ${groupName}* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Función:* ${nombreBonito}
┊  *Estado:* ${emojiEstado} ${estadoTexto.toUpperCase()}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Has ${estadoTexto} ${nombreBonito}*
┊➤ *${enabled ? 'La protección del dojo está activa' : 'La función ha sido desactivada'}*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${enabled ? 'La seguridad del dojo se fortalece' : 'El sentido común ninja debe prevalecer'}"*`
      
      return m.reply(successMsg)
      
    } catch (e) {
      console.error('Error en options:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar la configuración.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}