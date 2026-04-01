// update.js - Actualizar el bot estilo Rock Lee 🍃
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function reloadCommands(dir = path.join(__dirname, '..')) {
  const commandsMap = new Map()
  async function readCommands(folder) {
    const files = fs.readdirSync(folder)
    for (const file of files) {
      const fullPath = path.join(folder, file)
      if (fs.lstatSync(fullPath).isDirectory()) {
        await readCommands(fullPath)
      } else if (file.endsWith('.js')) {
        try {
          const { default: cmd } = await import(fullPath + '?update=' + Date.now())
          if (cmd?.command) {
            cmd.command.forEach((c) => {
              commandsMap.set(c.toLowerCase(), cmd)
            })
          }
        } catch (err) {
          console.error(`Error recargando técnica ${file}:`, err)
        }
      }
    }
  }
  await readCommands(dir)
  global.comandos = commandsMap
}

export default {
  command: ['fix', 'update', 'actualizar', 'gitpull'],
  isOwner: true,
  run: async (client, m) => {
    try {
      await m.reply(`🍃 *ACTUALIZANDO DOJO* 🍃\n\n⏳ Conectando con el repositorio ninja...\n\n💚 *"El sensei busca nuevas técnicas"*`)
      
      exec('git pull', async (error, stdout, stderr) => {
        await reloadCommands(path.join(__dirname, '..'))
        
        let msg = ''
        if (error) {
          msg = `🍃 *ERROR DE ACTUALIZACIÓN* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Error en git pull* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`bash
${stderr || error.message}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *Verifica la conexión a internet*
┊➤ *Asegúrate de tener git instalado*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja verifica sus herramientas"*`
        } else if (stdout.includes('Already up to date.')) {
          msg = `🍃 *DOJO ACTUALIZADO* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Estado del repositorio* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Status:* ✅ Todo está actualizado
┊  *Técnicas:* ${global.comandos?.size || 'Cargando...'} comandos activos
┊┈─────̇─̇─̇─────◯◝
┊➤ *El dojo está al día con las técnicas*
┊➤ *No hay nuevas técnicas por aprender*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"La juventud siempre está en constante evolución"*`
        } else {
          // 🍃 Extraer información de la actualización
          const lines = stdout.split('\n').filter(l => l.trim())
          const filesChanged = lines.filter(l => l.includes('|') || l.includes('create') || l.includes('delete') || l.includes('rename')).length || 'varios'
          
          msg = `🍃 *ACTUALIZACIÓN COMPLETADA* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Nuevas técnicas adquiridas* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  \`\`\`bash
${stdout.slice(0, 800)}${stdout.length > 800 ? '\n... (más cambios)' : ''}
\`\`\`
┊┈─────̇─̇─̇─────◯◝
┊➤ *El sensei ha aprendido nuevas técnicas*
┊➤ *Usa !menu para ver las novedades*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"${filesChanged === 1 ? 'Una nueva técnica ha sido dominada' : `${filesChanged} nuevas técnicas han sido incorporadas al dojo`}"*`
        }
        
        await client.sendMessage(m.key.remoteJid, { text: msg }, { quoted: m })
        
        // 🍃 Si hubo cambios, sugerir reiniciar
        if (!error && !stdout.includes('Already up to date.')) {
          setTimeout(async () => {
            await client.sendMessage(m.key.remoteJid, { 
              text: `🍃 *RECOMENDACIÓN NINJA* 🍃
              
Para que las nuevas técnicas funcionen correctamente, es recomendable reiniciar el bot.

📌 *Usa:* !restart

💚 *"Un ninja renace más fuerte después de cada actualización"*`
            }, { quoted: m })
          }, 2000)
        }
      })
      
    } catch (e) {
      console.error('Error en update:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al actualizar el bot.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  }
}