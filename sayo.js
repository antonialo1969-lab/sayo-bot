// Sayo completo para menciones @
const chistes = [
  "¿Por qué el libro de matemáticas está triste? Porque tiene muchos problemas 😂",
  "¿Qué le dice un jaguar a otro jaguar? Jaguar you 💖",
  "¡Me caíste bien! ¿Quieres ser mi amigo?",
  "Soy Sayo, la bot más bonita del server ✨"
];

const juegos = [
  "🎮 ¡Juguemos! Escribe @Sayo piedra, papel o tijera",
  "🎱 ¡Pregúntame algo! Ejemplo: @Sayo ¿me quiere?",
  "🎲 Di @Sayo lanza un dado"
];

export default class SayoHandler {
  async handle(message) {
    const texto = message.content.toLowerCase();

    // JUEGOS
    if (texto.includes("piedra") || texto.includes("papel") || texto.includes("tijera")) {
      const opciones = ["piedra", "papel", "tijera"];
      const mia = opciones[Math.floor(Math.random() * 3)];
      return `Yo elegí **${mia}**! ¿Quién ganó? 🎮`;
    }
    if (texto.includes("dado") || texto.includes("lanza")) {
      return `🎲 Saqué un **${Math.floor(Math.random() * 6) + 1}**!`;
    }
    if (texto.includes("?")) {
      const respuestas = ["¡Sí! 💖", "¡No! 😅", "Tal vez...", "¡Obvio que sí! ✨", "Mmm no creo"];
      return `🎱 ${respuestas[Math.floor(Math.random() * respuestas.length)]}`;
    }

    // BROMAS / CHISTES
    if (texto.includes("broma") || texto.includes("chiste") || texto.includes("cuenta")) {
      return chistes[Math.floor(Math.random() * chistes.length)];
    }

    // SALUDOS
    if (texto.includes("hola") || texto.includes("holi") || texto.includes("hey")) {
      return `¡Holiii ${message.author} ! Soy Sayo 💖 ¿jugamos? Di @Sayo juego`;
    }

    // GENERAL
    if (texto.includes("juego") || texto.includes("jugar")) {
      return juegos[Math.floor(Math.random() * juegos.length)];
    }

    // Por defecto
    return `¡Me mencionaste ${message.author}! 💖 Soy Sayo ✨\nPuedes decirme:\n• **@Sayo chiste**\n• **@Sayo juego**\n• **@Sayo hola**\n• **@Sayo piedra**`;
  }

  // BIENVENIDA
  getWelcomeMessage(member) {
    return `¡Bienvenid@ ${member} al server! 💖 Soy Sayo, mencióname con @Sayo para jugar conmigo ✨`;
  }
}
