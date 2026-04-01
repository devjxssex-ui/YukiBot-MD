// setprefix.js - Configurar prefijos del bot estilo Rock Lee 🍃
import GraphemeSplitter from 'grapheme-splitter'

export default {
  command: ['setprefix', 'setbotprefix', 'prefijo', 'cambiarprefijo'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return client.reply(m.chat, `🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar los símbolos ninja"*`, m)
      }
      
      const value = args.join(' ').trim()
      const defaultPrefix = ["#", "/", "!", "."]
      
      // 🍃 Mostrar estado actual
      if (!value) {
        const lista = config.prefix === null ? '`sin prefijos`' : (Array.isArray(config.prefix) ? config.prefix : [config.prefix || '/']).map(p => `\`${p}\``).join(', ')
        
        const infoMsg = `🍃 *CONFIGURAR PREFIJOS* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Símbolos ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Prefijos actuales:* ${lista}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Opciones disponibles:*

┊  ○ *Prefijos fijos:* ${usedPrefix + command} !.#/
┊  ○ *Sin prefijos:* ${usedPrefix + command} noprefix
┊  ○ *Restaurar:* ${usedPrefix + command} reset
┊  ○ *Ver ayuda:* ${usedPrefix + command}
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Los símbolos guían el camino del ninja"*`
        
        return m.reply(infoMsg)
      }
      
      // 🍃 Restaurar prefijos por defecto
      if (value.toLowerCase() === 'reset') {
        config.prefix = defaultPrefix
        const resetMsg = `🍃 *PREFIJOS RESTAURADOS* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Símbolos originales* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Prefijos:* ${defaultPrefix.join(' ')}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Los símbolos ninja han sido restaurados*
┊➤ *Usa !menu para ver los comandos*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Los símbolos originales del dojo han vuelto"*`
        return client.reply(m.chat, resetMsg, m)
      }
      
      // 🍃 Modo sin prefijos
      if (value.toLowerCase() === 'noprefix') {
        config.prefix = true 
        const noprefixMsg = `🍃 *MODO SIN PREFIJOS* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Técnica avanzada* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Modo:* Sin prefijos
┊  *Uso:* El bot responderá a comandos directamente
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ejemplo:* "menu" en lugar de "!menu"
┊➤ *Para volver:* ${usedPrefix + command} reset
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El ninja ha alcanzado un nuevo nivel de concentración"*`
        return m.reply(noprefixMsg)
      }
      
      // 🍃 Procesar nuevos prefijos
      const splitter = new GraphemeSplitter()
      const graphemes = splitter.splitGraphemes(value)
      const lista = []
      
      for (const g of graphemes) {
        if (/^[a-zA-Z]+$/.test(g)) continue
        if (!lista.includes(g)) lista.push(g)
      }
      
      if (lista.length === 0) {
        return client.reply(m.chat, `🍃 *SIN SÍMBOLOS VÁLIDOS* 🍃\n\n❌ No se detectaron prefijos válidos. Debes incluir al menos un *símbolo* o *emoji*.\n\n📌 Ejemplos: *! . # / 🍃 💚*\n\n💚 *"Un ninja elige sus símbolos con sabiduría"*`, m)
      }
      
      if (lista.length > 6) {
        return client.reply(m.chat, `🍃 *DEMASIADOS SÍMBOLOS* 🍃\n\n❌ Máximo *6 prefijos* permitidos.\n\n📌 *Actual:* ${lista.length} símbolos\n\n💚 *"Un ninja usa pocos pero poderosos símbolos"*`, m)
      }
      
      const oldPrefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix || '/']
      config.prefix = lista
      
      // 🍃 Mensaje de éxito
      const successMsg = `🍃 *PREFIJOS ACTUALIZADOS* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nuevos símbolos ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Prefijos anteriores:* ${oldPrefixes.map(p => `\`${p}\``).join(', ')}
┊  *Nuevos prefijos:* ${lista.map(p => `\`${p}\``).join(', ')}
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ahora usa estos símbolos para invocar técnicas*
┊➤ *Ejemplo:* ${lista[0]}menu
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Nuevos símbolos, nuevas técnicas, la juventud explota"*`
      
      return client.reply(m.chat, successMsg, m)
      
    } catch (e) {
      console.error('Error en setprefix:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al configurar los prefijos.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}