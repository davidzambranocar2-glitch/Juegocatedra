// ===================================================================
// Estado del jugador
// ===================================================================

let stats = {
  mental: 70,
  reputation: 60,
  security: 60,
  support: 50,
};

// Nivel actual (1–10)
let level = 1;

// Historial de decisiones (opcional para analizar)
let decisions = [];

// Constantes de umbrales
const THRESHOLD_PRISION = 30;
const THRESHOLD_REFUGIO = 40;

// Niveles de historia (nivel, título, texto, opciones)
const LEVELS = [
  {
    title: "Nivel 1 – El origen del sueño",
    text: "Mateo tiene 16 años y juega en el equipo del barrio. Es ágil, rápido y tiene potencial. Un entrenador local le dice que puede ir lejos si se esfuerza, pero también advierte que hay adultos que “regalan zapatos y camisetas” solo para luego pedir favores a cambio.",
    options: [
      "Acepto el apoyo de quien me lo ofrezca, sin importar quién sea.",
      "Solo acepto ayuda de entrenadores y organizaciones formales.",
      "Me aíslo y me niego a cualquier patrocinio, incluso si me falta todo.",
    ],
  },
  {
    title: "Nivel 2 – La primera amenaza",
    text: "Un día, después de un partido, un hombre que dice “conocer al entrenador” te aborda. Te ofrece botas nuevas y dinero para que recuerdes detalles de movimientos de la policía en el barrio. Te dice que no se le dice a nadie.",
    options: [
      "Acepto el dinero y las botas, pero no diré nada a nadie.",
      "Lo escucho, fingo interés, pero después le cuento a tu entrenador y a tu padre.",
      "Lo rechazo bruscamente y me voy corriendo.",
    ],
  },
  {
    title: "Nivel 3 – El trauma en el estadio",
    text: "Durante un partido importante, un disparo en el barrio cercano hace que todo el público se disperse. Un amigo tuyo queda herido grave. Todo el mundo habla de que “ellos” entraron a la cancha. No puedes dormir desde entonces.",
    options: [
      "No hablo de eso con nadie, me guardo el miedo.",
      "Le cuento a mi entrenador y a mi madre.",
      "Busco ayuda con un psicólogo de la ONG del barrio.",
    ],
  },
  {
    title: "Nivel 4 – La propuesta del “patrón”",
    text: "Un hombre muy temido en el barrio se acerca al entrenador y dice que “va a apostarle al equipo” si tú te haces cargo de unas “comisiones”. Te enteras de que se trata de mover paquetes pequeños, pero no sabes qué contienen. El entrenador te lo cuenta, preocupado.",
    options: [
      "Acepto, porque necesito dinero para la casa y para mis hermanos.",
      "Me niego y le pido al entrenador que hable con la policía.",
      "Finjo aceptar, pero aviso a la policía en secreto.",
    ],
  },
  {
    title: "Nivel 5 – El reclutamiento",
    text: "Un grupo armado empieza a reclutar jóvenes. Te dicen que “tienes disciplina” y podrías ser “un jefe de cuadrilla”. Te prometen respeto, dinero y protección para tu familia.",
    options: [
      "Acepto, porque siento que no tengo otra opción.",
      "Los escucho, pero me niego y me voy del barrio con mi familia.",
      "Denuncio a la Fuerza Pública y me alejo de ese círculo.",
    ],
  },
  {
    title: "Nivel 6 – La herida y el juicio",
    text: "Por defender a un amigo en una pelea, te involucras en un enfrentamiento donde un joven resulta gravemente herido. La policía te detiene. Dicen que quizás vayas a juicio. Todo tu futuro depende de lo que digas.",
    options: [
      "Miento y digo que no sé nada, para proteger a mi amigo.",
      "Digo toda la verdad, aunque suene mal.",
      "Pido hablar con un abogado de familia o de una ONG.",
    ],
  },
  {
    title: "Nivel 7 – La fuga del barrio",
    text: "El barrio se vuelve cada vez más peligroso. La policía realiza un operativo violento y tu familia queda atrapada en medio del fuego cruzado. Te dicen que debes irte… o quizá morir.",
    options: [
      "Me voy solo, sin avisar a nadie, para “limpiar” mi pasado.",
      "Ayudo a mi familia a salir y buscamos refugio formal.",
      "Me quedo y ayudo a otros vecinos a organizar una travesía segura.",
    ],
  },
  {
    title: "Nivel 8 – La oportunidad deportiva",
    text: "Una escuela de fútbol de otra ciudad te ve jugar en un vídeo y te ofrece entrenar. Es una salida, pero significa alejarte totalmente de tu realidad actual.",
    options: [
      "Acepto, aunque deje a mi familia atrás.",
      "Acepto si me garantizan que mi familia tendrá apoyo aquí.",
      "Rechazo porque siento que no quiero “abandonar” mi comunidad.",
    ],
  },
  {
    title: "Nivel 9 – La crisis interna",
    text: "Ya eres conocido, pero sigues teniendo pesadillas, culpa por quienes quedaron atrás y dudas si lo que hiciste fue lo correcto. Un día te ofrecen droga para “olvidar”. Evitan el dolor… por un rato.",
    options: [
      "La pruebo para “calmar” la mente.",
      "La rechazo y busco ayuda psicológica.",
      "Me dedico intensamente al entrenamiento para no pensar.",
    ],
  },
  {
    title: "Nivel 10 – “Escaping the Prision” (Final)",
    text: "Tus decisiones han marcado el camino. Ahora el juego muestra en qué rumbo terminaste.",
    options: [],
  },
];

// ===================================================================
// Funciones de UI
// ===================================================================

function updateStats() {
  document.getElementById("mental").textContent = stats.mental;
  document.getElementById("reputation").textContent = stats.reputation;
  document.getElementById("security").textContent = stats.security;
  document.getElementById("support").textContent = stats.support;
}

function setLevel(lvl) {
  level = lvl;
  const data = LEVELS[lvl - 1];
  if (!data) return;

  document.getElementById("title").textContent = data.title;
  document.getElementById("text").textContent = data.text;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  data.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => chooseOption(lvl, idx + 1);
    optionsDiv.appendChild(btn);
  });
}

// ===================================================================
// Lógica de decisiones por nivel
// ===================================================================

function chooseOption(lvl, choice) {
  decisions.push({ level: lvl, choice });
  let change = { mental: 0, reputation: 0, security: 0, support: 0 };

  // Reglas de cada nivel
  if (lvl === 1) {
    if (choice === 1) {
      change.reputation -= 10;
      change.security -= 10;
    } else if (choice === 2) {
      change.mental += 5;
      change.reputation += 5;
      change.support += 10;
    } else if (choice === 3) {
      change.security += 5;
      change.mental -= 10;
    }
  } else if (lvl === 2) {
    if (choice === 1) {
      change.security -= 20;
      change.reputation -= 10;
    } else if (choice === 2) {
      change.mental += 5;
      change.support += 10;
    } else if (choice === 3) {
      change.mental -= 10;
      change.security -= 10;
    }
  } else if (lvl === 3) {
    if (choice === 1) {
      change.mental -= 20;
      change.support -= 5;
    } else if (choice === 2) {
      change.mental -= 5;
      change.support += 10;
    } else if (choice === 3) {
      change.mental += 10;
      change.reputation += 5;
    }
  } else if (lvl === 4) {
    if (choice === 1) {
      change.security -= 20;
      change.reputation -= 20;
    } else if (choice === 2) {
      change.mental -= 10;
      change.security -= 10;
    } else if (choice === 3) {
      change.mental -= 5;
      change.security -= 10;
      change.support += 10;
    }
  } else if (lvl === 5) {
    if (choice === 1) {
      change.mental -= 20;
      change.reputation -= 20;
    } else if (choice === 2) {
      change.mental -= 10;
      change.security += 10;
    } else if (choice === 3) {
      change.security -= 10;
      change.support += 10;
    }
  } else if (lvl === 6) {
    if (choice === 1) {
      change.mental -= 10;
      change.reputation -= 10;
    } else if (choice === 2) {
      change.mental -= 5;
      change.reputation -= 5;
    } else if (choice === 3) {
      change.security += 10;
      change.support += 10;
    }
  } else if (lvl === 7) {
    if (choice === 1) {
      change.mental -= 15;
      change.reputation -= 5;
    } else if (choice === 2) {
      change.mental -= 10;
      change.security += 10;
    } else if (choice === 3) {
      change.mental += 5;
      change.support += 10;
    }
  } else if (lvl === 8) {
    if (choice === 1) {
      change.mental -= 5;
      change.reputation += 10;
    } else if (choice === 2) {
      change.mental += 5;
      change.support += 10;
    } else if (choice === 3) {
      change.mental += 5;
      change.reputation += 5;
    }
  } else if (lvl === 9) {
    if (choice === 1) {
      change.mental -= 20;
      change.reputation -= 10;
    } else if (choice === 2) {
      change.mental += 15;
      change.support += 10;
    } else if (choice === 3) {
      change.mental -= 5;
      change.reputation += 5;
    }
  } else if (lvl === 10) {
    finalizeGame();
  }

  // Ajustar stats y acotar
  stats.mental = clamp(stats.mental + change.mental, 0, 100);
  stats.reputation = clamp(stats.reputation + change.reputation, 0, 100);
  stats.security = clamp(stats.security + change.security, 0, 100);
  stats.support = clamp(stats.support + change.support, 0, 100);

  updateStats();

  // Avanzar al siguiente nivel
  if (lvl < 10) {
    setLevel(lvl + 1);
  }
}

// ===================================================================
// Fin y finales
// ===================================================================

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function finalizeGame() {
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const { mental, reputation, security, support } = stats;

  let finalText = "SIN RESULTADO";

  // Prisión
  if (reputation < THRESHOLD_PRISION && security < 40 && mental < 50) {
    finalText = `
      <h2>Final: Prisión</h2>
      <p>Mateo termina en un centro de detención juvenil. La policía lo atrapó por un delito ligado al narcotráfico. 
       Aunque era un buen jugador, sus decisiones lo llevaron a un lugar donde la red de apoyo es mínima y el futuro se ve borroso.</p>
    `;
  // Reclutamiento y conflicto
  } else if (reputation < 40 && mental < 40 && decisions.some(d => d.level === 5 && d.choice === 1)) {
    finalText = `
      <h2>Final: Reclutamiento y conflicto</h2>
      <p>Mateo se convierte en un joven combatiente. Aprende el manejo de armas, pero
