// commands.js - Menú de comandos estilo Rock Lee 🍃

export const bodyMenu = `> 🍃 ¡Hola! *@$sender*, Soy *$namebot*, El ninja de la hoja verde. Aquí tienes las técnicas disponibles$cat

╭┈ࠢ͜┅ࠦ͜͜╾݊͜─ؕ͜─ׄ͜─֬͜─֟͜─֫͜─ׄ͜─ؕ͜─݊͜┈ࠦ͜┅ࠡ͜͜┈࠭͜͜۰۰͜۰
│🍃 *SENSEI ::* $owner
│💚 *TIPO ::* $botType
│⚡ *VERSIÓN ::* ^3.0 - Rock Lee
│🔥 *SISTEMA/OPR ::* $device
│⏱️ *TIEMPO ::* $tiempo, $tempo
│👥 *USUARIOS ::* $users
│🔗 *URL ::* $link
╰ׅ┈ࠢ͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴ ⋱࣭ ᩴ  ⋮֔   ᩴ ⋰╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜┈ࠢ͜╯ׅ
> Vincula un *Socket* con tu número utilizando *$prefixqr* o *$prefixcode*.
‧꒷︶꒷꒥꒷‧₊˚꒷︶꒷꒥꒷︶꒷˚₊‧꒷꒥꒷︶꒷‧`

export const menuObject = {
economia: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *💰 ECONOMÍA* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Técnicas para ganar Ryō y entrenar duro.
🖼️ *Icono:* https://files.catbox.moe/2io49g.jpg

ꕤ *$prefixw » $prefixwork » $prefixtrabajar*
> Ganar Ryō trabajando.
ꕤ *$prefixbalance » $prefixbal » $prefixcoins* + <mention>
> Ver cuántos Ryō tienes.
ꕤ *$prefixcoinflip » $prefixflip » $prefixcf* + <cantidad / cara|cruz>
> Apostar Ryō en cara o cruz.
ꕤ *$prefixcrime » $prefixcrimen*
> Ganar Ryō rápido.
ꕤ *$prefixdaily » $prefixdiario*
> Reclamar tu recompensa diaria.
ꕤ *$prefixdeposit » $prefixdep » $prefixdepositar » $prefixd* + <cantidad|all>
> Depositar Ryō en el banco.
ꕤ *$prefixeconomyboard » $prefixeboard » $prefixbaltop* + <page>
> Ranking de ninjas con más Ryō.
ꕤ *$prefixcasino » $prefixapostar » $prefixslot* + <amount>
> Apostar Ryō en el casino.
ꕤ *$prefixeconomyinfo » $prefixeinfo*
> Ver tu información económica.
ꕤ *$prefixgivecoins » $prefixpay » $prefixcoinsgive* + <cantidad|all / mention>
> Dar Ryō a otro ninja.
ꕤ *$prefixroulette » $prefixrt » $prefixruleta* + <cantidad / red|black|green>
> Apostar Ryō en la ruleta.
ꕤ *$prefixslut » $prefixprostituirse*
> Ganar Ryō en las sombras.
ꕤ *$prefixsteal » $prefixrobar » $prefixrob* + <mention>
> Intentar robar Ryō a otro ninja.
ꕤ *$prefixwithdraw » $prefixwith » $prefixretirar* + <cantidad|all>
> Retirar Ryō del banco.
ꕤ *$prefixminar » $prefixmine*
> Realizar trabajos de minería.
ꕤ *$prefixcofre » $prefixcoffer*
> Reclamar tu cofre diario.
ꕤ *$prefixweekly » $prefixsemanal*
> Recompensa semanal.
ꕤ *$prefixmonthly » $prefixmensual*
> Recompensa mensual.
ꕤ *$prefixaventura » $prefixadventure*
> Ir de aventuras para ganar Ryō.
ꕤ *$prefixcurar » $prefixheal*
> Curar salud para seguir entrenando.
ꕤ *$prefixcazar » $prefixhunt*
> Cazar animales para ganar Ryō.
ꕤ *$prefixfish » $prefixpescar*
> Pescar para ganar Ryō.
ꕤ *$prefixmazmorra » $prefixdungeon*
> Explorar mazmorras.
ꕤ *$prefixmath » $prefixmates* + <difficulty>
> Juego de matemáticas ninja.
ꕤ *$prefixppt* + <piedra|papel|tijera>
> Piedra, papel o tijera contra el bot.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

gacha: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🎴 GACHA* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Reclama y entrena a tus compañeros ninja.
🖼️ *Icono:* https://files.catbox.moe/66jxvc.jpg

ꕤ *$prefixbuycharacter » $prefixbuychar » $prefixbuyc* + <personaje>
> Comprar un personaje.
ꕤ *$prefixcharimage » $prefixwaifuimage » $prefixcimage » $prefixwimage* + <personaje>
> Ver imagen de un personaje.
ꕤ *$prefixcharinfo » $prefixwinfo » $prefixwaifuinfo* + <personaje>
> Información del personaje.
ꕤ *$prefixclaim » $prefixc » $prefixreclamar* + <cite / personaje>
> Reclamar un personaje.
ꕤ *$prefixdelclaimmsg*
> Restablecer mensaje de reclamo.
ꕤ *$prefixdeletewaifu » $prefixdelwaifu » $prefixdelchar* + <personaje>
> Eliminar personaje reclamado.
ꕤ *$prefixfavoritetop » $prefixfavtop*
> Top de personajes favoritos.
ꕤ *$prefixgachainfo » $prefixginfo » $prefixinfogacha*
> Tu información de gacha.
ꕤ *$prefixgiveallharem* + <mention>
> Regalar todos tus personajes.
ꕤ *$prefixgivechar » $prefixgivewaifu » $prefixregalar* + <personaje / mention>
> Regalar un personaje.
ꕤ *$prefixharem » $prefixwaifus » $prefixclaims* + <mention>
> Ver tus personajes.
ꕤ *$prefixharemshop » $prefixtiendawaifus » $prefixwshop* + <page>
> Tienda de personajes.
ꕤ *$prefixremovesale » $prefixremoverventa* + <personaje>
> Quitar personaje de venta.
ꕤ *$prefixrollwaifu » $prefixrw » $prefixroll*
> Personaje aleatorio.
ꕤ *$prefixsell » $prefixvender* + <valor> <personaje>
> Poner personaje en venta.
ꕤ *$prefixserieinfo » $prefixainfo » $prefixanimeinfo* <name>
> Info de un anime.
ꕤ *$prefixserielist » $prefixslist » $prefixanimelist*
> Lista de series.
ꕤ *$prefixsetclaimmsg » $prefixsetclaim* + <texto>
> Personalizar mensaje de reclamo.
ꕤ *$prefixtrade » $prefixintercambiar* + <tu personaje / personaje 2>
> Intercambiar personajes.
ꕤ *$prefixvote » $prefixvotar* + <personaje>
> Votar por un personaje.
ꕤ *$prefixwaifusboard » $prefixwaifustop » $prefixtopwaifus » $prefixwtop* + <page>
> Top personajes.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

downloads: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *⬇️ DESCARGAS* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Descarga contenido de diversas fuentes.
🖼️ *Icono:* https://files.catbox.moe/kq3qfy.jpg

ꕤ *$prefixfacebook » $prefixfb* + <url>
> Video de Facebook.
ꕤ *$prefixmediafire » $prefixmf* + <url|query>
> Archivo de MediaFire.
ꕤ *$prefixplay » $prefixmp3 » $prefixplayaudio » $prefixytaudio » $prefixytmp3* + <url|query>
> Audio de YouTube.
ꕤ *$prefixpinterest » $prefixpin* + <url|query>
> Imágenes de Pinterest.
ꕤ *$prefixplay2 » $prefixmp4 » $prefixplayvideo » $prefixytvideo » $prefixytmp4* + <url|query>
> Video de YouTube.
ꕤ *$prefixreel » $prefixig » $prefixinstagram* + <url>
> Reel de Instagram.
ꕤ *$prefixtiktok » $prefixtt* + <url|query>
> Video de TikTok.
ꕤ *$prefixtwitter » $prefixx* + <url>
> Video/Imagen de Twitter/X.
ꕤ *$prefixytsearch » $prefixsearch* + <query>
> Buscar en YouTube.
ꕤ *$prefixwagrupos » $prefixgruposwa* + <query>
> Buscar grupos de WhatsApp.
ꕤ *$prefiximagen » $prefiximg* + <query>
> Buscar imágenes en Google.
ꕤ *$prefixaptoide » $prefixapk » $prefixapkdl* + <query>
> Descargar APKs de Aptoide.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

profile: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🥷 PERFIL* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Tu registro ninja y estadísticas.
🖼️ *Icono:* https://files.catbox.moe/bqev9u.jpg

ꕤ *$prefixprofile » $prefixperfil* + <mention>
> Ver tu perfil ninja.
ꕤ *$prefixleaderboard » $prefixlboard » $prefixlb* + <page>
> Ranking de experiencia.
ꕤ *$prefixlevel » $prefixlvl* + <mention>
> Ver nivel y experiencia.
ꕤ *$prefixsetgenre* + <hombre|mujer>
> Establecer tu género.
ꕤ *$prefixdelgenre*
> Eliminar género.
ꕤ *$prefixsetbirth* + <dia/mes/año|mes/dia>
> Establecer cumpleaños.
ꕤ *$prefixdelbirth*
> Borrar cumpleaños.
ꕤ *$prefixsetdescription » $prefixsetdesc* + <texto>
> Establecer descripción.
ꕤ *$prefixdeldescription » $prefixdeldesc*
> Eliminar descripción.
ꕤ *$prefixmarry » $prefixcasarse* <mention>
> Casarte con otro ninja.
ꕤ *$prefixdivorce*
> Divorciarte.
ꕤ *$prefixsetfavourite » $prefixsetfav* + <personaje>
> Establecer personaje favorito.
ꕤ *$prefixdeletefav » $prefixdelfav* + <personaje>
> Borrar favorito.
ꕤ *$prefixsetpasatiempo » $prefixsethobby* 
> Establecer pasatiempo.
ꕤ *$prefixdelpasatiempo » $prefixremovehobby*
> Eliminar pasatiempo.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

sockets: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🔌 SOCKETS* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Comandos para registrar tu propio bot.
🖼️ *Icono:* https://files.catbox.moe/zkerqt.jpg

ꕤ *$prefixbotinfo » $prefixinfobot*
> Información del bot.
ꕤ *$prefixjoin* + <link>
> Unir al bot a un grupo.
ꕤ *$prefixleave » $prefixsalir*
> Salir de un grupo.
ꕤ *$prefixlogout*
> Cerrar sesión.
ꕤ *$prefixself* + <on|off>
> Bot privado o público.
ꕤ *$prefixqr » $prefixcode*
> Crear Sub-Bot con código.
ꕤ *$prefixreload*
> Recargar sesión.
ꕤ *$prefixsetname » $prefixsetbotname*  + <corto / largo>
> Cambiar nombre del bot.
ꕤ *$prefixsetbanner » setbotbanner*
> Cambiar banner del menú.
ꕤ *$prefixseticon » $prefixsetboticon*
> Cambiar ícono.
ꕤ *$prefixsetprefix » $prefixsetbotprefix* + <valor>
> Cambiar prefijo.
ꕤ *$prefixsetcurrency » $prefixsetbotcurrency* + <valor>
> Cambiar moneda.
ꕤ *$prefixsetowner » $prefixsetbotowner* + <mention|número>
> Cambiar dueño.
ꕤ *$prefixsetchannel » $prefixsetbotchannel* + <link>
> Cambiar canal.
ꕤ *$prefixsetlink » $prefixsetbotlink* + <link>
> Cambiar enlace.
ꕤ *$prefixsetpfp » $prefixsetimage*
> Cambiar foto de perfil.
ꕤ *setstatus* + <valor>
> Cambiar estado.
ꕤ *setusername* + <valor>
> Cambiar nombre de usuario.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

stickers: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🎨 STICKERS* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜
> 🍃 Crea y gestiona tus stickers.
🖼️ *Icono:* https://files.catbox.moe/66jxvc.jpg

ꕤ *$prefixstickerpack » $prefixspack » $prefixstickers* + <query|url>
> Buscar packs de stickers.
ꕤ *$prefixdelpack* + <nombre pack>
> Eliminar paquete.
ꕤ *$prefixdelstickermeta » $prefixdelmeta*
> Restablecer pack y autor.
ꕤ *$prefixgetpack » $prefixstickerpack » $prefixpack* + <nombre pack>
> Descargar paquete.
ꕤ *$prefixnewpack » $prefixnewstickerpack* + <nombre pack>
> Crear nuevo paquete.
ꕤ *$prefixsetpackprivate » $prefixsetpackpriv » $prefixpackprivate* + <nombre pack>
> Hacer paquete privado.
ꕤ *$prefixsetpackpublic » $prefixsetpackpub » $prefixpackpublic* + <nombre pack>
> Hacer paquete público.
ꕤ *$prefixsetstickermeta » $prefixsetmeta* + <autor|pack>
> Establecer pack y autor por defecto.
ꕤ *$prefixsticker » $prefixs* + <cite / image|video>
> Convertir a sticker.
ꕤ *$prefixsetstickerpackdesc » $prefixsetpackdesc » $prefixpackdesc* + <nombre pack / desc>
> Establecer descripción del pack.
ꕤ *$prefixsetstickerpackname » $prefixsetpackname » $prefixpackname* + <nombre pack / nuevo nombre>
> Cambiar nombre del pack.
ꕤ *$prefixstickeradd » $prefixaddsticker* + <nombre pack>
> Agregar sticker a pack.
ꕤ *$prefixstickerdel » $prefixdelsticker* + <nombre pack>
> Eliminar sticker de pack.
ꕤ *$prefixstickerpacks » $prefixpacklist*
> Lista de tus packs.
ꕤ *$prefixbrat » $prefixbratv » $prefixqc › $prefixemojimix* + <text|mention>
> Crear stickers con texto.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

utils: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🛠️ UTILIDADES* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜
> 🍃 Herramientas útiles para el ninja.
🖼️ *Icono:* https://files.catbox.moe/twzkhn.jpg

ꕤ *$prefixmenu » $prefixhelp » $prefixayuda* + <categoría>
> Ver menú de comandos.
ꕤ *$prefixbots » $prefixsockets*
> Ver bots activos.
ꕤ *$prefixstatus » $prefixestado*
> Estado del bot.
ꕤ *$prefixping » $prefixp » $prefixspeed*
> Medir tiempo de respuesta.
ꕤ *$prefixreport » $prefixreporte* + <error>
> Reportar error.
ꕤ *$prefixsug » $prefixsuggest* + <sugerencia>
> Enviar sugerencia.
ꕤ *$prefixinvitar » $prefixinvite* + <link>
> Invitar bot al grupo.
ꕤ *$prefixia » $prefixchatgpt* + <query>
> Preguntar a IA.
ꕤ *$prefixgetpic » $prefixpfp* + <mention>
> Ver foto de perfil.
ꕤ *$prefixtoimage » $prefixtoimg* + <cite / sticker>
> Convertir sticker a imagen.
ꕤ *$prefixtourl* + <cite / image|video>
> Convertir imagen a link.
ꕤ *$prefixsay » $prefixdecir* + <texto>
> Repetir mensaje.
ꕤ *$prefixtrad » $prefixtraducir » $prefixtranslate* + <idioma / texto>
> Traducir texto.
ꕤ *$prefixget » $prefixfetch* + <url>
> Solicitudes GET.
ꕤ *$prefixhd » $prefixenhance » $prefixremini* + <cite / image>
> Mejorar calidad de imagen.
ꕤ *$prefixgitclone » $prefixgit* + <url|query>
> Descargar repositorio.
ꕤ *inspect » inspeccionar* + <url>
> Info de grupos/canales.
ꕤ *$prefixread » $prefixreadviewonce* + <cite / image|video>
> Ver contenido de vista única.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

grupo: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *👥 GRUPOS* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Comandos para administradores del dojo.
🖼️ *Icono:* https://files.catbox.moe/7m6zl6.jpg

ꕤ *$prefixalerts » $prefixalertas* + <on|off>
> Activar alertas.
ꕤ *$prefixantilinks » $prefixantienlaces* + <on|off>
> Antienlaces.
ꕤ *$prefixbot* + <on|off>
> Activar bot.
ꕤ *$prefixclose » $prefixcerrar* + <time>
> Cerrar grupo.
ꕤ *$prefixgp » $prefixgroupinfo*
> Info del grupo.
ꕤ *$prefixdelwarn* + <mention / number|all>
> Eliminar advertencia.
ꕤ *$prefixdemote* + <mention>
> Descender admin.
ꕤ *$prefixeconomy » $prefixeconomia* + <on|off>
> Activar economía.
ꕤ *$prefixgacha » $prefixrpg* + <on|off>
> Activar GACHA.
ꕤ *$prefixgoodbye » $prefixdespedida* + <on|off>
> Activar despedida.
ꕤ *$prefixsetgpbaner* + <cite / image>
> Cambiar imagen del grupo.
ꕤ *$prefixsetgpname* + <valor>
> Cambiar nombre del grupo.
ꕤ *$prefixsetgpdesc* + <valor>
> Cambiar descripción.
ꕤ *$prefixkick* + <mention>
> Expulsar usuario.
ꕤ *$prefixnsfw* + <on|off>
> Activar NSFW.
ꕤ *$prefixonlyadmin » $prefixadminonly* + <on|off>
> Solo admins usan comandos.
ꕤ *$prefixopen » $prefixabrir* + <time>
> Abrir grupo.
ꕤ *$prefixpromote* + <mention>
> Ascender admin.
ꕤ *$prefixsetgoodbye* + <valor>
> Mensaje de despedida.
ꕤ *$prefixsetprimary* + <mention>
> Bot primario.
ꕤ *$prefixsetwarnlimit* + <número>
> Límite de advertencias.
ꕤ *$prefixsetwelcome* + <valor>
> Mensaje de bienvenida.
ꕤ *$prefixtag » $prefixhidetag » $prefixtagall* + <texto>
> Mencionar a todos.
ꕤ *$prefixmsgcount » $prefixcount » $prefixmessages » $prefixmensajes* + <mention / days>
> Conteo de mensajes.
ꕤ *$prefixtopcount » $prefixtopmessages » $prefixtopmsgcount » $prefixtopmensajes* + <days>
> Top mensajes.
ꕤ *$prefixtopinactive » $prefixtopinactivos » $prefixtopinactiveusers* + <days>
> Top inactivos.
ꕤ *$prefixwarn* + <mention / reason>
> Advertir usuario.
ꕤ *$prefixwarns* + <mention>
> Ver advertencias.
ꕤ *$prefixwelcome » $prefixbienvenida* + <on|off>
> Activar bienvenida.
ꕤ *$prefixlink » $prefixrevoke*
> Enlace del grupo.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,

anime: `╭┈ࠢ͜─ׄ֟፝͜─ׄ͜─ׄ͜╴𐔌 *🎌 ANIME* 𐦯╶͜─ׄ͜─ׄ֟፝͜─ׄ͜─ׄ͜
> 🍃 Reacciones y técnicas ninja.
🖼️ *Icono:* https://files.catbox.moe/twzkhn.jpg

ꕤ *$prefixwaifu » $prefixneko*
> Waifu aleatoria.
ꕤ *$prefixppcouple » $prefixppcp* 
> Imagenes para parejas.
ꕤ *$prefixpeek » $prefixmirar* + <mention>
> Mirar.
ꕤ *$prefixcomfort » $prefixconsolar* + <mention>
> Consolar.
ꕤ *$prefixthinkhard » $prefixpensar* + <mention>
> Pensar intensamente.
ꕤ *$prefixcurious » $prefixcurioso* + <mention>
> Curiosidad.
ꕤ *$prefixsniff » $prefixoler* + <mention>
> Oler.
ꕤ *$prefixstare » $prefixmirar* + <mention>
> Mirar fijamente.
ꕤ *$prefixtrip » $prefixtropezar* + <mention>
> Tropezar.
ꕤ *$prefixblowkiss » $prefixbesito* + <mention>
> Besito.
ꕤ *$prefixsnuggle » $prefixacurrucar* + <mention>
> Acurrucarse.
ꕤ *$prefixangry » $prefixenojado* + <mention>
> Enojado.
ꕤ *$prefixbleh » $prefixmeh* + <mention>
> Sacar lengua.
ꕤ *$prefixbored » $prefixaburrido* + <mention>
> Aburrido.
ꕤ *$prefixclap » $prefixaplaudir* + <mention>
> Aplaudir.
ꕤ *$prefixcoffee » $prefixcafe* + <mention>
> Tomar café.
ꕤ *$prefixcold » $prefixfrio* + <mention>
> Tener frío.
ꕤ *$prefixsing » $prefixcantar* + <mention>
> Cantar.
ꕤ *$prefixtickle » $prefixcosquillas* + <mention>
> Cosquillas.
ꕤ *$prefixscream » $prefixgritar* + <mention>
> Gritar.
ꕤ *$prefixpush » $prefixempujar* + <mention>
> Empujar.
ꕤ *$prefixnope » $prefixno* + <mention>
> Negarse.
ꕤ *$prefixjump » $prefixsaltar* + <mention>
> Saltar.
ꕤ *$prefixheat » $prefixcalor* + <mention>
> Tener calor.
ꕤ *$prefixgaming » $prefixjugar* + <mention>
> Jugar.
ꕤ *$prefixdraw » $prefixdibujar* + <mention>
> Dibujar.
ꕤ *$prefixcall » $prefixllamar* + <mention>
> Llamar.
ꕤ *$prefixdramatic » $prefixdrama* + <mention>
> Drama.
ꕤ *$prefixdrunk » $prefixborracho* + <mention>
> Borracho.
ꕤ *$prefiximpregnate » $prefixembarazar* + <mention>
> Embarazar.
ꕤ *$prefixkisscheek » $prefixbeso* + <mention>
> Beso mejilla.
ꕤ *$prefixlaugh » $prefixreir* + <mention>
> Reír.
ꕤ *$prefixlove » $prefixamor* + <mention>
> Enamorado.
ꕤ *$prefixpout » $prefixmueca* + <mention>
> Pucheros.
ꕤ *$prefixpunch » $prefixgolpear* + <mention>
> Golpe.
ꕤ *$prefixrun » $prefixcorrer* + <mention>
> Correr.
ꕤ *$prefixsad » $prefixtriste* + <mention>
> Triste.
ꕤ *$prefixscared » $prefixasustado* + <mention>
> Asustado.
ꕤ *$prefixseduce » $prefixseducir* + <mention>
> Seducir.
ꕤ *$prefixshy » $prefixtimido* + <mention>
> Tímido.
ꕤ *$prefixsleep » $prefixdormir* + <mention>
> Dormir.
ꕤ *$prefixsmoke » $prefixfumar* + <mention>
> Fumar.
ꕤ *$prefixspit » $prefixescupir* + <mention>
> Escupir.
ꕤ *$prefixstep » $prefixpisar* + <mention>
> Pisar.
ꕤ *$prefixthink » $prefixpensar* + <mention>
> Pensar.
ꕤ *$prefixwalk » $prefixcaminar* + <mention>
> Caminar.
ꕤ *$prefixhug » $prefixabrazar* + <mention>
> Abrazar.
ꕤ *$prefixkill » $prefixmatar* + <mention>
> Matar.
ꕤ *$prefixeat » $prefixnom » $prefixcomer* + <mention>
> Comer.
ꕤ *$prefixkiss » $prefixmuak* + <mention>
> Besar.
ꕤ *$prefixwink* + <mention>
> Guiñar.
ꕤ *$prefixpat* + <mention>
> Acariciar.
ꕤ *$prefixhappy » $prefixfeliz* + <mention>
> Feliz.
ꕤ *$prefixbully* + <mention>
> Molestar.
ꕤ *$prefixbite » $prefixmorder* + <mention>
> Morder.
ꕤ *$prefixblush* + <mention>
> Sonrojar.
ꕤ *$prefixwave* + <mention>
> Saludar.
ꕤ *$prefixbath* + <mention>
> Bañar.
ꕤ *$prefixsmug* + <mention>
> Presumir.
ꕤ *$prefixsmile* + <mention>
> Sonreír.
ꕤ *$prefixhighfive* + <mention>
> Choca esos cinco.
ꕤ *$prefixhandhold* + <mention>
> Tomar mano.
ꕤ *$prefixcringe* + <mention>
> Vergüenza.
ꕤ *$prefixbonk* + <mention>
> Golpe divertido.
ꕤ *$prefixcry* + <mention>
> Llorar.
ꕤ *$prefixlick* + <mention>
> Lamer.
ꕤ *$prefixslap* + <mention>
> Bofetada.
ꕤ *$prefixdance* + <mention>
> Bailar.
ꕤ *$prefixcuddle* + <mention>
> Acurrucar.
╰ׅ͜─֟͜─͜─ٞ͜─͜─๊͜─͜─๋͜─⃔═̶፝֟͜═̶⃔─๋͜─͜─͜─๊͜─ٞ͜─͜─֟͜┈ࠢ͜╯ׅ`,
}