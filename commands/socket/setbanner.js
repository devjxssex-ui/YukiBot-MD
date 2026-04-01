// setbanner.js - Cambiar banner del bot estilo Rock Lee 🍃
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BANNER_PATH = path.join(__dirname, '../../assets/images/banner.jpg');

export default {
  command: ['setbanner', 'setbotbanner', 'banner', 'cambiarbanner'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar el estandarte"*`)
      }
      
      const value = args.join(' ').trim()
      
      // 🍃 Si es una URL
      if (value && value.startsWith('http')) {
        config.banner = value
        const successMsg = `🍃 *BANNER ACTUALIZADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Estandarte del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Fuente:* URL externa
┊  *Estado:* ✅ Actualizado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El estandarte ha sido renovado*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"Un nuevo estandarte para un nuevo comienzo"*`
        return m.reply(successMsg)
      }
      
      // 🍃 Verificar si hay imagen citada o enviada
      if (!value && !m.quoted && !m.message.imageMessage && !m.message.videoMessage) {
        return m.reply(`🍃 *CAMBIAR BANNER* 🍃\n\n❓ Uso: *${m.usedPrefix}setbanner <url>* o responde a una imagen.\n\n📌 *Ejemplos:*\n┊ *${m.usedPrefix}setbanner https://ejemplo.com/banner.jpg*\n┊ *Responde a una imagen con ${m.usedPrefix}setbanner*\n\n💚 *"Un ninja renueva su estandarte con orgullo"*`)
      }
      
      const q = m.quoted ? m.quoted : m.message.imageMessage ? m : m
      const mime = (q.msg || q).mimetype || q.mediaType || ''
      
      if (!/image\/(png|jpe?g|gif|webp)/.test(mime)) {
        return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ Solo se permiten imágenes (png, jpg, jpeg, gif, webp).\n\n💚 *"Un ninja usa herramientas de calidad"*`)
      }
      
      await m.reply(`🍃 *ACTUALIZANDO BANNER* 🍃\n\n⏳ Procesando técnica de renovación...\n\n💚 *"La juventud explota en el nuevo estandarte"*`)
      
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
        fs.writeFileSync(BANNER_PATH, buffer);
        console.log(`🍃 Banner guardado localmente en: ${BANNER_PATH}`);
        
        // También subir a la nube como respaldo
        let cloudUrl = null;
        try {
          cloudUrl = await uploadImage(buffer, mime);
        } catch (uploadErr) {
          console.log('🍃 No se pudo subir a la nube, usando solo local');
        }
        
        // Configurar banner (prioridad: URL local si existe, luego cloud)
        config.banner = cloudUrl || `file://${BANNER_PATH}`;
        
        const successMsg = `🍃 *BANNER ACTUALIZADO* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Estandarte del dojo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Fuente:* ${cloudUrl ? '☁️ Nube + Local' : '📁 Local'}
┊  *Estado:* ✅ Actualizado
┊┈─────̇─̇─̇─────◯◝
┊➤ *El estandarte ha sido renovado*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"¡El nuevo estandarte del ninja de la hoja verde!"*`
        
        return m.reply(successMsg)
        
      } catch (err) {
        console.error('Error guardando banner:', err);
        return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo guardar el banner.\n\n📌 *Detalle:* ${err.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
      }
      
    } catch (e) {
      console.error('Error en setbanner:', e);
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar el banner.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
};

async function uploadImage(buffer, mime) {
  const body = new FormData()
  const extension = mime.split('/')[1] || 'jpg'
  body.append('files[]', buffer, `banner.${extension}`)
  const res = await fetch('https://uguu.se/upload.php', { method: 'POST', body, headers: body.getHeaders() })
  const json = await res.json()
  return json.files?.[0]?.url || null
}