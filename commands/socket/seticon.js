// seticon.js - Cambiar icono del bot estilo Rock Lee 🍃
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ICON_PATH = path.join(__dirname, '../../assets/images/bot-icon.jpg');

export default {
  command: ['seticon', 'setboticon', 'icono', 'cambiaricono'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar el emblema"*`)
      }
      
      const value = args.join(' ').trim()
      
      // 🍃 Si es una URL
      if (value && value.startsWith('http')) {
        config.icon = value
        const successMsg = `🍃 *ICONO ACTUALIZADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Emblema del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Fuente:* URL externa
┊  *Estado:* ✅ Actualizado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El emblema ha sido renovado*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo emblema para un nuevo comienzo"*`
        return m.reply(successMsg)
      }
      
      // 🍃 Verificar si hay imagen citada o enviada
      if (!value && !m.quoted && !m.message.imageMessage) {
        return m.reply(`🍃 *CAMBIAR ICONO* 🍃\n\n❓ Uso: *${m.usedPrefix}seticon <url>* o responde a una imagen.\n\n📌 *Ejemplos:*\n┊ *${m.usedPrefix}seticon https://ejemplo.com/icon.jpg*\n┊ *Responde a una imagen con ${m.usedPrefix}seticon*\n\n💚 *"Un ninja renueva su emblema con orgullo"*`)
      }
      
      const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m
      const mime = (q.msg || q).mimetype || q.mediaType || ''
      
      if (!/image\/(png|jpe?g|webp)/.test(mime)) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ Solo se permiten imágenes (png, jpg, jpeg, webp).\n\n💚 *"Un ninja usa herramientas de calidad"*`)
      }
      
      await m.reply(`🍃 *ACTUALIZANDO ICONO* 🍃\n\n⏳ Procesando técnica de renovación...\n\n💚 *"La juventud explota en el nuevo emblema"*`)
      
      const buffer = await q.download()
      if (!buffer) {
        return m.reply(`🍃 *ERROR DE DESCARGA* 🍃\n\n❌ No se pudo descargar la imagen.\n\n💚 *"Un ninja verifica sus herramientas"*`)
      }
      
      // 🍃 Guardar imagen localmente
      try {
        // Crear carpeta si no existe
        const assetsDir = path.join(__dirname, '../../assets/images');
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        // Guardar imagen local
        fs.writeFileSync(ICON_PATH, buffer);
        console.log(`🍃 Icono guardado localmente en: ${ICON_PATH}`);
        
        // También subir a la nube como respaldo
        let cloudUrl = null;
        try {
          cloudUrl = await uploadImage(buffer, mime);
        } catch (uploadErr) {
          console.log('🍃 No se pudo subir a la nube, usando solo local');
        }
        
        // Configurar icono (prioridad: URL local si existe, luego cloud)
        config.icon = cloudUrl || `file://${ICON_PATH}`;
        
        const successMsg = `🍃 *ICONO ACTUALIZADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Emblema del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Fuente:* ${cloudUrl ? '☁️ Nube + Local' : '📁 Local'}
┊  *Estado:* ✅ Actualizado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El emblema ha sido renovado*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"¡El nuevo emblema del ninja de la hoja verde!"*`
        
        return m.reply(successMsg)
        
      } catch (err) {
        console.error('Error guardando icono:', err);
        return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo guardar el icono.\n\n📌 *Detalle:* ${err.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
      }
      
    } catch (e) {
      console.error('Error en seticon:', e);
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el icono.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
};

async function uploadImage(buffer, mime) {
  const body = new FormData()
  const extension = mime.split('/')[1] || 'jpg'
  body.append('files[]', buffer, `icon.${extension}`)
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body, headers: body.getHeaders() })
  const json = await res.json()
  return json.files?.[0]?.url || null
}