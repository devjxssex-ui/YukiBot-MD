// logout.js - Cerrar sesión de sub-bots estilo Rock Lee 🍃
import fs from 'fs';
import path from 'path';
import { jidDecode } from '@whiskeysockets/baileys';

export default {
  command: ['logout', 'cerrarsesion', 'desconectar'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const rawId = client.user?.id || ''
      const decoded = jidDecode(rawId)
      const cleanId = decoded?.user || rawId.split('@')[0]
      const sessionTypes = ['Subs']
      const basePath = 'Sessions'
      const sessionPath = sessionTypes.map((type) => path.join(basePath, type, cleanId)).find((p) => fs.existsSync(p))
      
      if (!sessionPath) {
        return m.reply(`🍃 *NO ES UN SUB-BOT* 🍃\n\n❌ Este comando solo puede ser usado desde una instancia de *Sub-Bot*.\n\n💚 *"El bot principal no puede cerrar su propia sesión"*`)
      }
      
      await m.reply(`🍃 *CERRANDO SESIÓN* 🍃\n\n⏳ Procesando técnica de retiro...\n\n📌 *Ninja:* @${cleanId}\n\n💚 *"Un ninja sabe cuándo retirarse"*`, { mentions: [m.sender] })
      
      try {
        await client.logout()
        
        setTimeout(() => {
          if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true })
            console.log(`🍃 Sesión de ${cleanId} eliminada del dojo`)
          }
        }, 2000)
        
        setTimeout(() => {
          const successMsg = `🍃 *SESIÓN CERRADA* 🍃
          
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Retiro ninja* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Ninja:* @${cleanId}
┊  *Estado:* ✅ Desconectado
┊┈─────̇─̇─̇─────◯◝
┊➤ *Sesión finalizada correctamente*
┊➤ *Para reconectar:* ${usedPrefix}code
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un ninja siempre puede volver a entrenar"*`
          
          m.reply(successMsg, { mentions: [m.sender] })
        }, 3000)
        
      } catch (e) {
        const errMsg = String(e.message || e)
        
        if (errMsg.includes('not-authorized') || errMsg.includes('session')) {
          await m.reply(`🍃 *SESIÓN NO ENCONTRADA* 🍃\n\n❌ No se pudo cerrar la sesión, la sesión no es válida.\n\n💚 *"Un ninja no puede retirarse si ya partió"*`)
        } else {
          await m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cerrar la sesión.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
        }
      }
      
    } catch (e) {
      console.error('Error en logout:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cerrar la sesión.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}