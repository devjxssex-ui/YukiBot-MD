// setpfp.js - Cambiar foto de perfil del bot estilo Rock Lee 🍃
import * as Jimp from 'jimp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PFP_PATH = path.join(__dirname, '../assets/images/bot-pfp.jpg');

async function resizeImage(media) {
  const jimp = await Jimp.read(media)
  const min = jimp.getWidth()
  const max = jimp.getHeight()
  const cropped = jimp.crop(0, 0, min, max)
  return { img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG), preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG) }
}

export default {
  command: ['setimage', 'setpfp', 'fotoperfil', 'cambiarfoto'],
  category: 'socket',
  run: async (client, m, args) => {
    try {
      const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const config = global.db.data.settings[idBot]
      const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
      
      if (!isOwner2) {
        return m.reply(`🍃 *ACCESO DENEGADO* 🍃\n\n❌ Este comando solo puede ser ejecutado por el *Sensei* del dojo.\n\n💚 *"Solo el dueño del dojo puede cambiar la imagen del sensei"*`)
      }
      
      const q = m.quoted || m
      const mime = (q.msg || q).mimetype || q.mediaType || ''
      
      if (!/image/g.test(mime)) {
        return m.reply(`🍃 *CAMBIAR FOTO* 🍃
        
❓ Uso: *${m.usedPrefix}setpfp* responde a una imagen

📌 Ejemplo: 
┊ *Envía una imagen y responde con ${m.usedPrefix}setpfp*
┊ *Para imagen completa usa: ${m.usedPrefix}setpfp full*

💚 *"Un sensei renueva su imagen con orgullo"*`)
      }
      
      await m.reply(`🍃 *ACTUALIZANDO FOTO* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud explota en una nueva imagen"*`)
      
      const media = await q.download()
      if (!media) {
        return m.reply(`🍃 *ERROR DE DESCARGA* 🍃\n\n❌ No se pudo descargar la imagen.\n\n💚 *"Un ninja verifica sus herramientas"*`)
      }
      
      const jid = client.user.id.split(':')[0] + '@s.whatsapp.net'
      
      // 🍃 Guardar imagen localmente como respaldo
      try {
        const assetsDir = path.join(__dirname, '../assets/images');
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        fs.writeFileSync(PFP_PATH, media);
        console.log(`🍃 Foto de perfil guardada localmente en: ${PFP_PATH}`);
      } catch (err) {
        console.log('🍃 No se pudo guardar la foto localmente:', err);
      }
      
      try {
        if (args[0] === 'full' || args[1] === 'full') {
          const { img } = await resizeImage(media)
          await client.query({ 
            tag: 'iq', 
            attrs: { to: jid, type: 'set', xmlns: 'w:profile:picture' }, 
            content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
          })
        } else {
          await client.updateProfilePicture(jid, media)
        }
        
        const successMsg = `🍃 *FOTO ACTUALIZADA* 🍃
        
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Imagen del sensei* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Bot:* ${config.namebot || 'Rock Lee'}
┊  *Tipo:* ${args[0] === 'full' || args[1] === 'full' ? '🖼️ Imagen completa' : '📸 Foto de perfil'}
┊  *Estado:* ✅ Actualizado
┊┈─────̇─̇─̇─────◯◝
┊➤ *La imagen del sensei ha sido renovada*
┊➤ *Usa !menu para ver el cambio*
┊ ︿︿︿︿︿︿︿︿︿︿︿
╰─────────────────╯

💚 *"¡Una nueva imagen para un ninja legendario!"*`
        
        return m.reply(successMsg)
        
      } catch (err) {
        const errMsg = String(err.message || err)
        
        if (errMsg.includes('not-authorized') || errMsg.includes('requires-admin')) {
          return m.reply(`🍃 *ERROR DE PERMISOS* 🍃\n\n❌ No se pudo cambiar la foto. El bot necesita permisos.\n\n💚 *"Un ninja respeta las reglas del dojo"*`)
        } else if (errMsg.includes('image') || errMsg.includes('format')) {
          return m.reply(`🍃 *FORMATO INCORRECTO* 🍃\n\n❌ La imagen no tiene un formato válido.\n\n📌 *Usa imágenes JPG, PNG o JPEG*\n\n💚 *"Un ninja usa imágenes de calidad"*`)
        } else {
          return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ No se pudo cambiar la foto de perfil.\n\n📌 *Detalle:* ${errMsg.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
        }
      }
      
    } catch (e) {
      console.error('Error en setpfp:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al cambiar la foto de perfil.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}