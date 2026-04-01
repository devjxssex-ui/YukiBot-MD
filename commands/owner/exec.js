// exec.js - Ejecutar código JavaScript estilo Rock Lee 🍃
import syntaxerror from 'syntax-error'
import { format } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { createRequire } from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

export default {
  command: ['ex', 'e', 'ejecutar', 'eval'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!text.trim()) {
        return client.reply(m.chat, `🍃 *EJECUTAR CÓDIGO* 🍃
        
❓ Uso: *${usedPrefix + command} <código JavaScript>*

📌 Ejemplos:
┊ *${usedPrefix + command} return "Rock Lee 🍃"*
┊ *${usedPrefix + command} await client.sendMessage(m.chat, { text: "💚 La juventud explota!" })*

💚 *"El sensei puede invocar cualquier técnica"*`, m)
      }
      
      let _text = (command === 'e' ? 'return ' : '') + text
      let old = m.exp * 1
      let _return, _syntax = ''
      
      await m.reply(`🍃 *EJECUTANDO TÉCNICA* 🍃\n\n⏳ Procesando código ninja...\n\n💚 *"La programación es como el entrenamiento"*`)
      await m.react('🕒')
      
      try {
        let i = 15
        let f = { exports: {} }
        let exec = new (async () => {}).constructor('print', 'm', 'client', 'require', 'Array', 'process', 'args', 'module', 'exports', 'argument', _text)
        _return = await exec.call(client, (...args) => {
          if (--i < 1) return
          return client.reply(m.chat, format(...args), m)
        }, m, client, require, Array, process, args, f, f.exports, [client])
        await m.react('✅')
        
        // 🍃 Formatear la salida
        let output = _syntax + format(_return)
        if (output.length > 4000) {
          output = output.slice(0, 3970) + '\n\n... (código truncado por longitud)'
        }
        
        const successMsg = `🍃 *TÉCNICA EJECUTADA* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Resultado* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`js
${output}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ejecución completada*
┊➤ *Tiempo:* ${Date.now() - old}ms
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La técnica se ha completado con éxito"*`
        
        client.reply(m.chat, successMsg, m)
        
      } catch (e) {
        let err = syntaxerror(_text, 'Execution Function', {
          allowReturnOutsideFunction: true,
          allowAwaitOutsideFunction: true,
          sourceType: 'module'
        })
        if (err) _syntax = '```' + err + '```\n\n'
        _return = e
        await m.react('❌')
        
        const errorMsg = `🍃 *ERROR EN TÉCNICA* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Error de ejecución* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`js
${_syntax + format(_return).slice(0, 500)}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *Revisa la sintaxis de tu técnica*
┊➤ *"Un ninja verdadero aprende de sus errores"*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La falla es parte del entrenamiento"*`
        
        client.reply(m.chat, errorMsg, m)
      } finally {
        m.exp = old
      }
      
    } catch (e) {
      console.error('Error en exec:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al ejecutar el código.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}