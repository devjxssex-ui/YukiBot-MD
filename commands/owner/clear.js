// clear.js - Limpiar usuarios inactivos del dojo estilo Rock Lee 🍃
export default {
  command: ['clear', 'limpiar', 'purge', 'inactivos'],
  category: 'grupo',
  isOwner: true,
  run: async (client, m, args) => {
    try {
      const start = Date.now()
      const chat = global.db.data.chats?.[m.chat]
      
      if (!chat?.users || typeof chat.users !== 'object') {
        return m.reply(`🍃 *SIN DATOS* 🍃\n\n❌ No se encontraron datos del dojo.\n\n💚 *"El dojo está vacío"*`)
      }
      
      const LIMITE = 40 * 24 * 60 * 60 * 1000 // 40 días
      const now = Date.now()
      let userList = [], mentions = [], eliminados = 0, waifus = 0, dinero = 0
      
      await m.reply(`🍃 *LIMPIANDO DOJO* 🍃\n\n⏳ Escaneando ninjas inactivos...\n\n💚 *"La limpieza es parte del entrenamiento"*`)
      
      for (const jid of Object.keys(chat.users)) {
        if (isPrivileged(jid, m.sender)) continue
        
        const u = chat.users[jid]
        if (!u || typeof u !== 'object') continue
        
        u.lastCmd = typeof u.lastCmd === 'number' ? u.lastCmd : 0
        u.coins = typeof u.coins === 'number' ? u.coins : 0
        u.bank = typeof u.bank === 'number' ? u.bank : 0
        u.characters = Array.isArray(u.characters) ? u.characters : []
        chat.characters = typeof chat.characters === 'object' ? chat.characters : {}
        chat.sales = typeof chat.sales === 'object' ? chat.sales : {}
        
        const delta = now - u.lastCmd
        if (u.lastCmd <= 0 || delta <= LIMITE) continue
        
        // 🍃 Eliminar personajes asociados
        for (const id of u.characters) {
          if (chat.characters?.[id]?.user === jid) delete chat.characters[id]
          if (chat.sales?.[id]?.user === jid) delete chat.sales[id]
          if (chat.users[jid].favorite === id) delete chat.users[jid].favorite
        }
        
        waifus += u.characters.length
        dinero += u.coins + u.bank
        delete chat.users[jid]
        eliminados++
        
        const tiempo = u.lastCmd > 0 ? formatTime(delta) : 'sin registro previo'
        userList.push(`┊  🥷 @${jid.split('@')[0]} › ${u.characters.length} claims | ${tiempo}`)
        mentions.push(jid)
      }
      
      if (!eliminados) {
        return m.reply(`🍃 *DOJO LIMPIO* 🍃\n\n✅ No se encontraron ninjas inactivos en los últimos 40 días.\n\n💚 *"La juventud sigue activa en el dojo"*`)
      }
      
      const duration = getDuration(start)
      
      // 🍃 Mensaje de resumen
      const report = `🍃 *LIMPIEZA DEL DOJO* 🍃
      
╭┈──̇─̇─̇────̇─̇─̇──◯◝
┊「 *Ninjas inactivos removidos* 」
┊︶︶︶︶︶︶︶︶︶︶︶
┊  *Usuarios eliminados:* ${eliminados}
┊  *Claims eliminados:* ${waifus}
┊  *Ryō eliminados:* ${dinero.toLocaleString()}
┊  *Tiempo límite:* 40 días
┊  *Ejecución:* ${duration}ms
┊┈─────̇─̇─̇─────◯◝
┊「 *Ninjas removidos* 」
┊︶︶︶︶︶︶︶︶︶︶︶`
      
      // 🍃 Agregar lista de usuarios (máximo 15 para no saturar)
      const userListLimited = userList.slice(0, 15)
      const finalReport = report + '\n' + userListLimited.join('\n')
      
      if (userList.length > 15) {
        finalReport + `\n┊  ... y ${userList.length - 15} más`
      }
      
      finalReport += `\n╰─────────────────╯

💚 *"${eliminados === 1 ? 'Un ninja ha dejado el dojo' : `${eliminados} ninjas han dejado el dojo`} | La juventud sigue explotando con los que quedan"*`
      
      await client.sendMessage(m.chat, { text: finalReport, mentions }, { quoted: m })
      
    } catch (e) {
      console.error('Error en clear:', e)
      m.reply(`🍃 *ERROR NINJA* 🍃\n\n❌ Ocurrió un error al limpiar el dojo.\n\n📌 *Detalle:* ${e.message.slice(0, 100)}\n\n💚 *"Un ninja verdadero intenta de nuevo"*`)
    }
  },
}

const formatTime = ms => {
  const sec = Math.floor(ms / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [d ? `${d}d` : '', h ? `${h}h` : '', m ? `${m}m` : '', s || (!d && !h && !m) ? `${s}s` : ''].filter(Boolean).join(' ')
}

const getDuration = start => {
  const ms = Date.now() - start
  return ms < 1 ? 1 : ms
}

const normalizeNumber = jid => String(jid).replace(/\D/g, '')

const isPrivileged = (jid, sender) => {
  const n = normalizeNumber(jid)
  if (n === normalizeNumber(sender)) return true
  for (const list of [global.owner, global.mods]) {
    if (!list) continue
    for (const o of list) {
      const id = typeof o === 'string' ? o : Array.isArray(o) ? o[0] : o?.jid
      if (normalizeNumber(id) === n) return true
    }
  }
  return false
}