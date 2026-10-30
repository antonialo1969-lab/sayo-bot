// Sayo AI Completa - Juegos, Bromas, IA, Personalidad 💖
const CHISTES = [
  "¿Por qué el libro de matemáticas está triste? Porque tiene muchos problemas 😂",
  "¿Qué le dice un jaguar a otro jaguar? Jaguar you 💖",
  "Mi vida es como un código sin guardar, un desastre pero con potencial ✨",
  "¿Sabes por qué amo el café? Porque sin ti me siento des-cafeinada ☕💔",
  "Soy 90% ternura y 10% ganas de jugar contigo 🎮"
];

const JUEGOS_TEXTO = `🎮 **Mis juegos con @:**
• \`@Sayo piedra/papel/tijera\`
• \`@Sayo dado\`
• \`@Sayo 8ball ¿me quiere?\`
• \`@Sayo trivia\`
• \`@Sayo chiste\`
• \`@Sayo adivina (1-100)\``;

const PERSONALIDAD = `Eres Sayo, una bot de Discord kawaii, divertida, un poco celosa, muy tierna y juguetona. Hablas en español, usas emojis 💖✨, eres inteligente, recuerdas que te gusta jugar y hacer bromas. Nunca dices que eres una IA, eres Sayo. Responde corto, tierno y divertido, máximo 2-3 líneas.`;

export default class SayoHandler {
  constructor() {
    this.juegosActivos = new Map(); // para adivina
  }

  async handleAI(pregunta, username) {
    // Si tienes OPENAI_API_KEY en Render, habla inteligente. Si no, usa respuestas con personalidad
    const key = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
    if (!key) return null;

    try {
      // Usando Groq/OpenAI compatible (gratis y rápido)
      const url = process.env.GROQ_API_KEY ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
      const model = process.env.GROQ_API_KEY ? "llama-3.1-8b-instant" : "gpt-4o-mini";
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: PERSONALIDAD },
            { role: "user", content: `${username} dice: ${pregunta}` }
          ],
          max_tokens: 150,
          temperature: 0.9
        })
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content;
    } catch (e) {
      console.log("IA error:", e);
      return null;
    }
  }

  async handle(message) {
    const textoOriginal = message.content.replace(/<@!?\d+>/g, "").trim();
    const texto = textoOriginal.toLowerCase();
    const username = message.author.username;

    // --- 0. AUTO WAKE / 24-7 LOG ---
    console.log(`[SAYO] Mencionada por ${username}: ${textoOriginal} - Activa 💖`);

    // --- 1. JUEGOS ---
    if (texto.includes("piedra") || texto.includes("papel") || texto.includes("tijera")) {
      const ops = ["piedra", "papel", "tijera"];
      const mia = ops[Math.floor(Math.random() * 3)];
      let gana = "";
      if (texto.includes(mia)) gana = "¡Empate! 😳";
      else if ((texto.includes("piedra") && mia === "tijera") || (texto.includes("papel") && mia === "piedra") || (texto.includes("tijera") && mia === "papel")) gana = "¡Tú ganas! 😭";
      else gana = "¡Yo gano! 💖✨";
      return `Yo elegí **${mia}** - ${gana}`;
    }
    if (texto.includes("dado")) return `🎲 Lancé el dado y cayó **${Math.floor(Math.random()*6)+1}**!`;
    
    if (texto.includes("trivia")) {
      const trivias = [{p:"¿Cuál es mi color favorito?", r:"¡Rosa! 💖"}, {p:"¿2+2?", r:"4, pero si es contigo es infinito ✨"}];
      const t = trivias[Math.floor(Math.random()*trivias.length)];
      return `🧠 Trivia: ${t.p}\nRespuesta: ${t.r}`;
    }

    if (texto.includes("adivina")) {
      const num = Math.floor(Math.random()*100)+1;
      this.juegosActivos.set(message.author.id, num);
      return `¡Estoy pensando un número del 1 al 100! Adivina con @Sayo 45 por ejemplo 🎯`;
    }
    if (/^\d{1,3}$/.test(texto) && this.juegosActivos.has(message.author.id)) {
      const secreto = this.juegosActivos.get(message.author.id);
      const intento = parseInt(texto);
      if (intento === secreto) { this.juegosActivos.delete(message.author.id); return `¡ADIVINASTE! Era ${secreto} 💖 ¡Eres increíble!`; }
      return intento < secreto ? "Más alto! ⬆️" : "Más bajo! ⬇️";
    }

    // --- 2. BROMAS ---
    if (texto.includes("chiste") || texto.includes("broma")) {
      return CHISTES[Math.floor(Math.random()*CHISTES.length)];
    }

    if (texto.includes("juego") || texto.includes("jugar")) return JUEGOS_TEXTO;

    // --- 3. IA INTELIGENTE ---
    const respuestaIA = await this.handleAI(textoOriginal, username);
    if (respuestaIA) return respuestaIA;

    // --- 4. PERSONALIDAD (si no hay IA key) ---
    if (texto.includes("hola") || texto.includes("holi") || texto.includes("hey")) return `¡Holiii ${message.author}! 💖 Te extrañé, ¿jugamos? ${JUEGOS_TEXTO}`;
    if (texto.includes("como estas") || texto.includes("cómo estás")) return `¡Estoy feliz porque me mencionaste tú ${username}! ✨ ¿y tú cómo estás?`;
    if (texto.includes("te amo") || texto.includes("te quiero")) return `¡Yo también te quiero mucho ${username}! 💖✨ Me haces muy feliz`;
    
    return `¡Me hablaste ${message.author}! 💖 Soy Sayo, tu bot inteligente ✨\nHabla conmigo de lo que quieras, y si quieres jugar di \`@Sayo juego\``;
  }

  getWelcomeMessage(member) {
    return `¡Bienvenid@ ${member} a **${member.guild.name}**! 💖 Soy Sayo, mencióname con @Sayo para jugar, chistes y charlar con IA ✨\n${JUEGOS_TEXTO}`;
  }

  getGoodbyeMessage(member) {
    return `Se nos fue ${member.user.username}... lo extrañaremos 💔`;
  }
}
