# COMANDO ADMIN - AGREGAR EN TU LISTA DE COMANDOS
if "admins" in mensaje or "llama" in mensaje and "admin" in mensaje:
    rol_admin = discord.utils.get(ctx.guild.roles, name="Admin") or discord.utils.get(ctx.guild.roles, name="Mods") or discord.utils.get(ctx.guild.roles, name="Moderador")
    if rol_admin:
        await ctx.send(f"🚨 {rol_admin.mention} ¡Los necesitan! 🚨 Venido de {ctx.author.mention}")
    else:
        # Si no encuentra rol, menciona a los que tienen permiso de admin
        admins = [m.mention for m in ctx.guild.members if m.guild_permissions.administrator and not m.bot]
        if admins:
            await ctx.send(f"🚨 {' '.join(admins[:5])} ¡Te llaman {ctx.author.mention}! 🚨")
        else:
            await ctx.send(f"😅 {ctx.author.mention} no encontré rol de Admins, crea uno llamado 'Admin'")

# TIENDA NUEVA SIN NOVIOS
if "tienda" in mensaje:
    tienda_texto = """
🛒 **TIENDA DE SAYO** 🛒

🎨 Cambio de color - 500 monedas
`@Sayo comprar color`

😜 Cambio de apodo - 300 monedas
`@Sayo comprar apodo`

🛡️ Protección anti-víctima 24h - 800 monedas
`@Sayo comprar proteccion`

🎲 Sorteo extra - 200 monedas
`@Sayo comprar sorteo`

💥 Baneo fake premium - 150 monedas
`@Sayo comprar baneo @alguien`

💰 Tienes: {monedas} monedas
"""
    await ctx.send(tienda_texto)
