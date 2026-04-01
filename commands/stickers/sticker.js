// sticker.js - Creador de stickers estilo Rock Lee 🍃
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import fetch from 'node-fetch';
import exif from '../../lib/exif.js';
const { writeExif } = exif;

export default {
  command: ['sticker', 's', 'stiker'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      if (args[0] === '-list') {
        let helpText = `🍃 *TÉCNICAS NINJA PARA STICKERS* 🍃

╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Formas* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  -c : 🟢 Circular
┊  -t : 🔺 Triangular
┊  -s : ⭐ Estrella
┊  -r : 🟫 Esquinas redondeadas
┊  -h : ⬡ Hexagonal
┊  -d : 🔷 Diamante
┊  -f : 🖼️ Marco
┊  -b : 📦 Borde
┊  -w : 🌊 Onda
┊  -m : 🪞 Espejado
┊  -o : 🔶 Octogonal
┊  -y : 🔷 Pentagonal
┊  -e : 🥚 Elíptico
┊  -z : ✝️ Cruz
┊  -v : ❤️ Corazón
┊  -x : 📐 Expandido (cover)
┊  -i : 📏 Expandido (contain)

┊「 *Efectos* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  -blur : 🌫️ Desenfoque
┊  -sepia : 🟤 Sepia
┊  -sharpen : ✨ Nitidez
┊  -brighten : ☀️ Brillar
┊  -darken : 🌙 Oscurecer
┊  -invert : 🔄 Invertir colores
┊  -grayscale : ⚪ Escala de grises
┊  -rotate90 : 🔄 Rotar 90°
┊  -rotate180 : 🔄 Rotar 180°
┊  -flip : ↔️ Voltear horizontal
┊  -flop : ↕️ Voltear vertical
┊  -normalice : 📊 Normalizar
┊  -negate : 🎭 Negativo
┊  -tint : 🎨 Tinte rojo

┊「 *Ejemplo* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *${usedPrefix + command} -c -blur Pack | Autor*
╰─────────────────╯

💚 *"La juventud explota en stickers!"*`;
        return client.reply(m.chat, helpText, m);
      }
      
      const quoted = m.quoted ? m.quoted : m;
      const mime = (quoted.msg || quoted).mimetype || '';
      const db = global.db.data
      const user = db.users[m.sender] || {}
      const name = user.name || m.sender.split('@')[0];
      const meta1 = user.metadatos ? String(user.metadatos).trim() : '';
      const meta2 = user.metadatos2 ? String(user.metadatos2).trim() : '';
      let texto1 = meta1 ? meta1 : 'Rock Lee Bot 🍃';
      let texto2 = meta2 ? meta2 : (name || 'El ninja de la hoja verde');
      
      let urlArg = null;
      let argsWithoutUrl = [];
      for (let arg of args) {
        if (isUrl(arg)) {
          urlArg = arg;
        } else {
          argsWithoutUrl.push(arg);
        }
      }
      
      let filteredText = argsWithoutUrl.join(' ').replace(/-\w+/g, '').trim();
      let marca = filteredText.split(/[\u2022|]/).map(part => part.trim());
      let pack = marca[0] || texto1;
      let author = marca.length > 1 ? marca[1] : texto2;
      
      const shapeArgs = { '-c': 'circle', '-t': 'triangle', '-s': 'star', '-r': 'roundrect', '-h': 'hexagon', '-d': 'diamond', '-f': 'frame', '-b': 'border', '-w': 'wave', '-m': 'mirror', '-o': 'octagon', '-y': 'pentagon', '-e': 'ellipse', '-z': 'cross', '-v': 'heart', '-x': 'cover', '-i': 'contain' };
      const effectArgs = { '-blur': 'blur', '-sepia': 'sepia', '-sharpen': 'sharpen', '-brighten': 'brighten', '-darken': 'darken', '-invert': 'invert', '-grayscale': 'grayscale', '-rotate90': 'rotate90', '-rotate180': 'rotate180', '-flip': 'flip', '-flop': 'flop', '-normalice': 'normalise', '-negate': 'negate', '-tint': 'tint' };
      
      const effects = [];
      for (const arg of argsWithoutUrl) {
        if (shapeArgs[arg]) effects.push({ type: 'shape', value: shapeArgs[arg] });
        else if (effectArgs[arg]) effects.push({ type: 'effect', value: effectArgs[arg] });
      }
      
      await m.reply(`🍃 *CREANDO STICKER* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud nunca falla!"*`)
      
      const sendWebpWithExif = async (webpBuffer) => {
        const media = { mimetype: 'webp', data: webpBuffer };
        const metadata = { packname: pack, author: author, categories: ['🍃', '💚', '⚡'] };
        const stickerPath = await writeExif(media, metadata);
        await client.sendMessage(m.chat, { sticker: { url: stickerPath } }, { quoted: m });
        fs.unlinkSync(stickerPath);
      };
      
      const convertToGif = async (inputPath) => {
        const gifPath = `./tmp/conv-${Date.now()}.gif`;
        await new Promise((resolve, reject) => {
          const p = spawn('ffmpeg', ['-y', '-i', inputPath, '-vf', 'fps=10,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000', '-loop', '0', gifPath]);
          let err = '';
          p.stderr.on('data', (d) => err += d.toString());
          p.on('close', (code) => { if (code === 0) resolve(); else reject(new Error(err)); });
        });
        return gifPath;
      };
      
      const processWithFFmpeg = async (inputPath, isVideo = false) => {
        const outputPath = `./tmp/sticker-${Date.now()}.webp`;
        const vf = buildFFmpegFilters(effects);
        let ffmpegArgs = ['-y', '-i', inputPath, '-vf', vf, '-an', '-fps_mode', 'passthrough', '-c:v', 'libwebp_anim', '-preset', 'picture', '-compression_level', '6', '-q:v', '70', '-loop', '0', outputPath];
        await new Promise((resolve, reject) => {
          const p = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
          let err = '';
          p.stderr.on('data', (d) => err += d.toString());
          p.on('close', (code) => { if (code === 0) resolve(); else reject(new Error(err)); });
        });
        const data = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        await sendWebpWithExif(data);
      };
      
      const isAnimatedWebp = (buffer) => {
        if (!Buffer.isBuffer(buffer) || buffer.length < 32) return false;
        return buffer.indexOf(Buffer.from('ANIM')) !== -1 || buffer.indexOf(Buffer.from('ANMF')) !== -1;
      };
      
      const handleWebpBuffer = async (buffer) => {
        const animated = isAnimatedWebp(buffer);
        const inputPath = `./tmp/in-${Date.now()}.webp`;
        fs.writeFileSync(inputPath, buffer);
        if (animated && effects.length > 0) {
          try {
            const gifPath = await convertToGif(inputPath);
            await processWithFFmpeg(gifPath, true);
            fs.unlinkSync(gifPath);
          } catch (e) {
            await sendWebpWithExif(buffer);
          }
        } else if (animated && effects.length === 0) {
          await sendWebpWithExif(buffer);
        } else {
          await processWithFFmpeg(inputPath);
        }
        fs.unlinkSync(inputPath);
      };
      
      if (/image/.test(mime) || /webp/.test(mime)) {
        let buffer = await quoted.download();
        if (/webp/.test(mime)) {
          await handleWebpBuffer(buffer);
        } else {
          const ext = /png/i.test(mime) ? 'png' : /jpe?g/i.test(mime) ? 'jpg' : /gif/i.test(mime) ? 'gif' : 'img';
          const inputPath = `./tmp/in-${Date.now()}.${ext}`;
          fs.writeFileSync(inputPath, buffer);
          await processWithFFmpeg(inputPath, /gif/i.test(mime));
          fs.unlinkSync(inputPath);
        }
      } else if (/video/.test(mime)) {
        const duration = (quoted.msg || quoted).seconds || 0;
        if (duration > 20) {
          return m.reply(`🍃 *VIDEO DEMASIADO LARGO* 🍃\n\n❌ El video no puede tener más de *20 segundos*.\n\n📌 *Duración:* ${duration} segundos\n\n💚 *"Un ninja usa clips cortos y precisos!"*`);
        }
        let buffer = await quoted.download();
        const inputPath = `./tmp/video-${Date.now()}.mp4`;
        fs.writeFileSync(inputPath, buffer);
        await processWithFFmpeg(inputPath, true);
        fs.unlinkSync(inputPath);
      } else if (urlArg) {
        const url = urlArg;
        if (!url.match(/\.(jpe?g|png|gif|webp|mp4|mov|avi|mkv|webm)(\?.*)?$/i)) {
          return client.reply(m.chat, `🍃 *URL INVÁLIDA* 🍃\n\n❌ La URL debe ser de una imagen (jpg, png, gif, webp) o video (mp4, mov, avi, mkv, webm)\n\n💚 *"Un ninja elige sus herramientas sabiamente!"*`, m);
        }
        const response = await fetch(url);
        if (!response.ok) return client.reply(m.chat, `🍃 *ERROR DE DESCARGA* 🍃\n\n❌ No pude descargar ese archivo desde la URL.\n\n💚 *"Un ninja verifica sus enlaces!"*`, m);
        const buffer = Buffer.from(await response.arrayBuffer());
        if (url.match(/\.webp(\?.*)?$/i)) {
          await handleWebpBuffer(buffer);
        } else if (url.match(/\.(jpe?g|png|gif)(\?.*)?$/i)) {
          const ext = url.match(/\.gif/i) ? 'gif' : 'img';
          const inputPath = `./tmp/url-${Date.now()}.${ext}`;
          fs.writeFileSync(inputPath, buffer);
          await processWithFFmpeg(inputPath, /gif/i.test(url));
          fs.unlinkSync(inputPath);
        } else if (url.match(/\.(mp4|mov|avi|mkv|webm)(\?.*)?$/i)) {
          const inputPath = `./tmp/urlvid-${Date.now()}.mp4`;
          fs.writeFileSync(inputPath, buffer);
          await processWithFFmpeg(inputPath, true);
          fs.unlinkSync(inputPath);
        }
      } else {
        return client.reply(m.chat, `🍃 *CREAR STICKER* 🍃\n\n❓ *Formas de uso:*\n\n📌 *Imagen/Video:* Responde a un archivo\n📌 *URL:* ${usedPrefix}${command} https://ejemplo.com/imagen.jpg\n📌 *Efectos:* ${usedPrefix}${command} -c -blur\n\n📌 *Ver formas y efectos:* ${usedPrefix}${command} -list\n\n💚 *"La juventud explota en stickers!"*`, m);
      }
    } catch (e) {
      console.error('Error en sticker:', e);
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al crear el sticker.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`);
    }
  }
};

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/, 'gi'));
};

const buildFFmpegFilters = (effects, isVideo = false) => {
  const W = 512;
  const H = 512;
  const filters = [];
  const shape = effects.find(e => e.type === 'shape')?.value;
  const effectList = effects.filter(e => e.type === 'effect').map(e => e.value);
  
  if (shape === 'cover') {
    filters.push(`scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`);
  } else {
    filters.push(`scale=${W}:${H}:force_original_aspect_ratio=decrease`);
    filters.push(`pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x00000000`);
  }
  
  filters.push('format=rgba');
  
  for (const effect of effectList) {
    switch (effect) {
      case 'blur': filters.push('gblur=sigma=5'); break;
      case 'sepia': filters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131'); break;
      case 'sharpen': filters.push('unsharp=5:5:1.0:5:5:0.0'); break;
      case 'brighten': filters.push('eq=brightness=0.05'); break;
      case 'darken': filters.push('eq=brightness=-0.05'); break;
      case 'invert': case 'negate': filters.push('negate'); break;
      case 'grayscale': filters.push('hue=s=0'); break;
      case 'rotate90': filters.push('transpose=1'); break;
      case 'rotate180': filters.push('rotate=PI'); break;
      case 'flip': filters.push('hflip'); break;
      case 'flop': filters.push('vflip'); break;
      case 'normalice': filters.push('normalize'); break;
      case 'tint': filters.push('colorchannelmixer=1:0:0:0:0:0.5:0:0:0:0:0.5'); break;
    }
  }
  
  if (shape === 'mirror') filters.push('hflip');
  
  if (shape && !['cover', 'contain', 'mirror', 'border', 'frame'].includes(shape)) {
    const cx = W / 2;
    const cy = H / 2;
    const r = Math.min(W, H) / 2;
    let alphaExpr = '';
    switch (shape) {
      case 'circle': alphaExpr = `if(lte((X-${cx})*(X-${cx})+(Y-${cy})*(Y-${cy}),${r * r}),255,0)`; break;
      case 'triangle': alphaExpr = `if(gte(Y,${H * 0.1})*lte(Y,${H * 0.9})*lte(abs(X-${cx}),((${H * 0.9}-Y)*0.6)),255,0)`; break;
      case 'star': alphaExpr = `if(lte(hypot(X-${cx},Y-${cy}),${W * 0.25}+${W * 0.1}*cos(5*atan2(Y-${cy},X-${cx}))),255,0)`; break;
      case 'roundrect': alphaExpr = `if(lte(pow(max(25-X,0,X-${W - 25},25-Y,0,Y-${H - 25}),2)+pow(max(50-hypot(X-25,Y-25),50-hypot(X-${W - 25},Y-25),50-hypot(X-25,Y-${H - 25}),50-hypot(X-${W - 25},Y-${H - 25})),2),0),255,0)`; break;
      case 'hexagon': alphaExpr = `if(lte(hypot(X-${cx},Y-${cy}),${W * 0.4}*cos(PI/6)/cos(mod(atan2(Y-${cy},X-${cx}),PI/3)-PI/6)),255,0)`; break;
      case 'diamond': alphaExpr = `if(lte(abs(X-${cx})+abs(Y-${cy}),${r}),255,0)`; break;
      case 'wave': alphaExpr = `if(lte(abs(Y-(${cy}+${H * 0.05}*sin(X*0.05))),${H * 0.4}),255,0)`; break;
      case 'octagon': alphaExpr = `if(lte(hypot(X-${cx},Y-${cy}),${W * 0.4}*cos(PI/8)/cos(mod(atan2(Y-${cy},X-${cx}),PI/4)-PI/8)),255,0)`; break;
      case 'pentagon': alphaExpr = `if(lte(hypot(X-${cx},Y-${cy}),${W * 0.4}*cos(PI/5)/cos(mod(atan2(Y-${cy},X-${cx}),2*PI/5)-PI/5)),255,0)`; break;
      case 'ellipse': alphaExpr = `if(lte(((X-${cx})*(X-${cx}))/(${(W * 0.45) * (W * 0.45)})+((Y-${cy})*(Y-${cy}))/(${(H * 0.4) * (H * 0.4)}),1),255,0)`; break;
      case 'cross': alphaExpr = `if(gt((abs(X-${cx})<=${W * 0.15})*(abs(Y-${cy})<=${H * 0.45})+(abs(Y-${cy})<=${H * 0.15})*(abs(X-${cx})<=${W * 0.45}),0),255,0)`; break;
      case 'heart': alphaExpr = `if(lte(pow((X-${cx})/(${W * 0.3})*(X-${cx})/(${W * 0.3})+(Y-${cy})/(${H * 0.3})*(Y-${cy})/(${H * 0.3})-1,3)-((X-${cx})/(${W * 0.3})*(X-${cx})/(${W * 0.3}))*pow((Y-${cy})/(${H * 0.3}),3),0),255,0)`; break;
    }
    if (alphaExpr) filters.push(`geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='${alphaExpr}'`);
  }
  
  if (shape === 'border') filters.push(`drawbox=x=0:y=0:w=${W}:h=${H}:color=white@0.9:t=10`);
  if (shape === 'frame') filters.push(`drawbox=x=15:y=15:w=${W - 30}:h=${H - 30}:color=white@0.7:t=8`);
  
  filters.push('format=yuva420p');
  return filters.join(',');
};