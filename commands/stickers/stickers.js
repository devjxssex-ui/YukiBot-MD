// stickers.js - Buscar y descargar packs de stickers con scraper local 🍃
import axios from 'axios';
import fs from 'fs';
import { spawn } from 'child_process';
import webpmux from 'node-webpmux';
import cheerio from 'cheerio';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const toBuffer = async (url) => Buffer.from((await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 })).data);

const toWebp = (buffer, isAnimated = false) => new Promise((resolve, reject) => {
  const tmpIn = `./tmp/spack-in-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tmpOut = `./tmp/spack-out-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  fs.writeFileSync(tmpIn, buffer);
  const vf = 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,format=rgba,format=yuva420p';
  const codec = isAnimated ? 'libwebp_anim' : 'libwebp';
  const args = ['-y', '-i', tmpIn, '-vf', vf, '-c:v', codec, '-q:v', '50', '-compression_level', '6'];
  if (isAnimated) args.push('-loop', '0');
  args.push(tmpOut);
  const p = spawn('ffmpeg', args);
  p.on('close', (code) => {
    try { fs.unlinkSync(tmpIn); } catch {}
    if (code === 0 && fs.existsSync(tmpOut)) {
      const result = fs.readFileSync(tmpOut);
      try { fs.unlinkSync(tmpOut); } catch {}
      resolve(result);
    } else {
      reject(new Error('ffmpeg failed'));
    }
  });
});

const isStickerUrl = (url) => /^(https?:\/\/)?(www\.)?sticker\.ly\/s\/[a-zA-Z0-9]+$/i.test(url);

// 🍃 SCRAPER LOCAL - Buscar packs en sticker.ly
const searchPacksLocal = async (query) => {
  try {
    const searchUrl = `https://stickers.cloud/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    const results = [];
    
    $('.sticker-pack').each((i, el) => {
      const name = $(el).find('.pack-name').text().trim();
      const url = $(el).find('a').attr('href');
      const thumbnail = $(el).find('img').attr('src');
      const stickerCount = parseInt($(el).find('.sticker-count').text()) || 0;
      
      if (name && url) {
        results.push({
          name: name,
          url: url.startsWith('http') ? url : `https://stickers.cloud${url}`,
          thumbnail: thumbnail,
          stickerCount: stickerCount
        });
      }
    });
    
    return { status: true, resultados: results };
  } catch (e) {
    console.error('Error en searchPacksLocal:', e);
    return { status: false, resultados: [] };
  }
};

// 🍃 SCRAPER LOCAL - Obtener detalles de un pack
const getPackDetailsLocal = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });
    
    const $ = cheerio.load(data);
    
    const name = $('.pack-header h1').text().trim() || $('meta[property="og:title"]').attr('content')?.replace(' - Sticker.ly', '') || 'Pack sin nombre';
    const author = $('.pack-author').text().trim() || $('meta[name="author"]').attr('content') || 'Desconocido';
    const thumbnailUrl = $('.pack-cover img').attr('src') || $('meta[property="og:image"]').attr('content') || '';
    
    const stickers = [];
    $('.sticker-item').each((i, el) => {
      const imgUrl = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const isAnimated = $(el).find('.animated-badge').length > 0 || (imgUrl && imgUrl.includes('animated'));
      if (imgUrl && imgUrl.startsWith('http')) {
        stickers.push({
          imageUrl: imgUrl,
          isAnimated: isAnimated
        });
      }
    });
    
    // Si no encuentra stickers con el selector anterior, intentar con otro
    if (stickers.length === 0) {
      $('.sticker-grid img, .stickers-list img').each((i, el) => {
        const imgUrl = $(el).attr('src') || $(el).attr('data-src');
        if (imgUrl && imgUrl.startsWith('http')) {
          stickers.push({
            imageUrl: imgUrl,
            isAnimated: imgUrl.includes('animated') || imgUrl.includes('gif')
          });
        }
      });
    }
    
    return {
      status: true,
      detalles: {
        name: name,
        author: { name: author, username: author },
        stickers: stickers,
        thumbnailUrl: thumbnailUrl
      }
    };
  } catch (e) {
    console.error('Error en getPackDetailsLocal:', e);
    return { status: false, detalles: null };
  }
};

export default {
  command: ['stickerpack', 'spack', 'stickers', 'buscarstickers'],
  category: 'stickers',
  run: async (client, m, args, usedPrefix, command, text) => {
    try {
      if (!text) return client.reply(m.chat, `🍃 *BUSCAR STICKERS* 🍃\n\n❓ Uso: *${usedPrefix}${command} <nombre o URL de sticker.ly>*\n\n📌 Ejemplo: *${usedPrefix}${command} Rock Lee*\n\n💚 *"Un ninja busca nuevas técnicas!"*`, m);
      
      await m.reply(`🍃 *BUSCANDO STICKERS* 🍃\n\n⏳ Procesando técnica ninja...\n\n💚 *"La juventud explota en stickers!"*`)
      await m.react('🕒');
      
      const db = global.db.data;
      const user = db.users[m.sender] || {};
      const name = user.name || m.sender.split('@')[0];
      let packData;
      
      const stickerMatch = text.match(/(?:sticker\.ly\/s\/)([a-zA-Z0-9]+)(?:\s|$)/);
      const url = stickerMatch ? 'https://sticker.ly/s/' + stickerMatch[1] : (isStickerUrl(text) ? text : null);
      
      if (url) {
        // Usar scraper local para URL directa
        const detail = await getPackDetailsLocal(url);
        if (!detail || !detail.status || !detail.detalles) {
          return client.reply(m.chat, `🍃 *PACK NO DISPONIBLE* 🍃\n\n❌ El pack de la URL no está disponible o es privado.\n\n💚 *"Un ninja respeta las técnicas privadas!"*`, m);
        }
        if (!detail.detalles.stickers?.length) {
          return client.reply(m.chat, `🍃 *PACK VACÍO* 🍃\n\n❌ El pack no contiene stickers válidos.\n\n💚 *"Un ninja necesita un arsenal completo!"*`, m);
        }
        packData = detail.detalles;
      } else {
        // Buscar con scraper local
        const search = await searchPacksLocal(text);
        if (!search.status || !search.resultados?.length) {
          return client.reply(m.chat, `🍃 *SIN RESULTADOS* 🍃\n\n❌ No se encontraron packs para *${text}*.\n\n📌 *Intenta con otro nombre*\n\n💚 *"Un ninja nunca se rinde!"*`, m);
        }
        
        // Tomar el primer resultado relevante
        let detail = null;
        for (const pack of search.resultados.slice(0, 5)) {
          const res = await getPackDetailsLocal(pack.url);
          if (res?.status && res?.detalles?.stickers?.length > 0) {
            detail = res.detalles;
            break;
          }
          await delay(1000); // Pequeña pausa entre intentos
        }
        
        if (!detail) {
          return client.reply(m.chat, `🍃 *NO SE PUDO DESCARGAR* 🍃\n\n❌ No se pudo descargar ningún pack válido.\n\n💚 *"Un ninja sigue intentando!"*`, m);
        }
        packData = detail;
      }
      
      const { name: packName, author, stickers, thumbnailUrl } = packData;
      
      if (!stickers?.length) {
        return client.reply(m.chat, `🍃 *PACK VACÍO* 🍃\n\n❌ El pack no contiene stickers válidos.\n\n💚 *"Un ninja necesita un arsenal completo!"*`, m);
      }
      
      const MAX_STICKERS = 50;
      const selectedStickers = stickers.slice(0, MAX_STICKERS);
      
      await m.reply(`🍃 *DESCARGANDO PACK* 🍃\n\n📦 *${packName}*\n👤 *Autor:* ${author?.name || author?.username || 'Desconocido'}\n🎨 *Stickers:* ${selectedStickers.length}\n\n⏳ Procesando...\n\n💚 *"La juventud explota!"*`)
      
      const [cover, stickerResults] = await Promise.all([
        (async () => {
          try {
            if (thumbnailUrl) {
              const buf = await toBuffer(thumbnailUrl);
              const converted = await toWebp(buf, false);
              const img = new webpmux.Image();
              await img.load(converted);
              return await img.save(null);
            }
            return Buffer.alloc(0);
          } catch {
            return Buffer.alloc(0);
          }
        })(),
        Promise.all(selectedStickers.map(async (s, idx) => {
          try {
            const buffer = await toBuffer(s.imageUrl);
            const sticker = await toWebp(buffer, s.isAnimated || false);
            const img = new webpmux.Image();
            await img.load(sticker);
            const result = await img.save(null);
            return { sticker: result, isAnimated: s.isAnimated || false, isLottie: false, emojis: ['🍃', '💚', '⚡'] };
          } catch (err) {
            console.error(`Error descargando sticker ${idx}:`, err.message);
            return null;
          }
        })).then(results => results.filter(r => r !== null))
      ]);
      
      if (!stickerResults.length) {
        return client.reply(m.chat, `🍃 *ERROR DE PROCESAMIENTO* 🍃\n\n❌ No se pudieron procesar los stickers del pack.\n\n💚 *"Un ninja intenta de nuevo!"*`, m);
      }
      
      const publisherName = author?.name || author?.username || `Ninja ${name}`
      
      await client.sendMessage(m.chat, { 
        stickerPack: { 
          name: packName, 
          publisher: publisherName, 
          description: '🍃 Rock Lee Bot - El ninja de la hoja verde 💚', 
          cover, 
          stickers: stickerResults 
        } 
      }, { quoted: m });
      
      const successMsg = `🍃 *PACK DESCARGADO* 🍃\n\n✅ *${packName}* (${stickerResults.length} stickers)\n👤 *Autor:* ${publisherName}\n\n💚 *"${stickerResults.length === MAX_STICKERS ? '¡Pack épico! La juventud explota' : 'Sigue entrenando para más stickers'}"*`
      await m.reply(successMsg)
      await m.react('✅');
      
    } catch (e) {
      console.error('Error en stickers:', e);
      await m.react('❌');
      return m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al buscar los stickers.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo!"*`);
    }
  }
};