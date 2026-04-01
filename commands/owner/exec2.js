// exec2.js - Ejecutar comandos del sistema estilo Rock Lee 🍃
import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'

const exec = promisify(_exec).bind(cp)

export default {
  command: ['r', 'run', 'terminal', 'cmd'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!text.trim()) {
        return client.reply(m.chat, `🍃 *EJECUTAR COMANDO* 🍃
        
❓ Uso: *${usedPrefix + command} <comando del sistema>*

📌 Ejemplos:
┊ *${usedPrefix + command} ls -la*
┊ *${usedPrefix + command} pwd*
┊ *${usedPrefix + command} node --version*

💚 *"El sensei controla el sistema del dojo"*`, m)
      }
      
      await m.reply(`🍃 *EJECUTANDO COMANDO* 🍃\n\n⏳ Procesando en la terminal...\n\n💚 *"La tecnología es otra forma de entrenamiento"*`)
      await m.react('🕒')
      
      let o
      try {
        o = await exec(text.trim())
        await m.react('✅')
      } catch (e) {
        o = e
        await m.react('❌')
      } finally {
        const { stdout, stderr } = o
        
        // 🍃 Formatear salida
        let output = ''
        
        if (stdout?.trim()) {
          const stdoutPreview = stdout.trim().slice(0, 3500)
          output += `🍃 *SALIDA DEL SISTEMA* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Comando:* ${text.trim().slice(0, 50)} 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`bash
${stdoutPreview}${stdout.trim().length > 3500 ? '\n... (salida truncada)' : ''}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *Ejecución completada*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"El comando se ejecutó con éxito"*`
          client.reply(m.chat, output, m)
        }
        
        if (stderr?.trim()) {
          const stderrPreview = stderr.trim().slice(0, 3500)
          const errorMsg = `🍃 *ERROR EN COMANDO* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Error del sistema* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`bash
${stderrPreview}${stderr.trim().length > 3500 ? '\n... (error truncado)' : ''}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *Revisa la sintaxis del comando*
┊➤ *"Un ninja aprende de sus errores"*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La falla es parte del entrenamiento"*`
          client.reply(m.chat, errorMsg, m)
        }
        
        if (!stdout?.trim() && !stderr?.trim()) {
          client.reply(m.chat, `🍃 *COMANDO EJECUTADO* 🍃
          
✅ El comando se ejecutó sin salida visible.
💚 *"La técnica fue exitosa en silencio"*`, m)
        }
      }
      
    } catch (e) {
      console.error('Error en exec2:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al ejecutar el comando.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}