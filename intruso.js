const contenedor = document.getElementById("contenedor");
const mensaje = document.getElementById("mensaje");
const nuevoBtn = document.getElementById("nuevo");
const volver = document.getElementById("volver");

volver.addEventListener("click", () => {
  window.location.href = "index.html";
});
nuevoBtn.addEventListener("click", iniciarJuego);

const grupos = [
  {
    categoria: "animales",
    similares: ["🐶", "🐱", "🐰"],
    intruso: "🍎",
  },
  {
    categoria: "frutas",
    similares: ["🍎", "🍌", "🍇"],
    intruso: "🐘",
  },
  {
    categoria: "vehículos",
    similares: ["🚗", "🚔", "🚚"],
    intruso: "🐢",
  },
  {
    categoria: "formas",
    similares: ["🔵", "🔶", "🟨"],
    intruso: "🌳",
  },
  {
    categoria: "ropa",
    similares: ["👕", "👖", "👟"],
    intruso: "🍉",
  },
  {
    categoria: "peces",
    similares: ["🦐", "🦑", "🐟"],
    intruso: "🍼",
  },
  {
    categoria: "comidas",
    similares: ["🥪", "🥞", "🍰"],
    intruso: "🌵",
  },
  {
    categoria: "deportes",
    similares: ["⚽", "🎾", "🏈"],
    intruso: "🌷",
  },
  {
    categoria: "cielo",
    similares: ["🌜", "🌞", "🌟"],
    intruso: "🚗",
  },
  {
    categoria: "personas",
    similares: ["👧🏾", "👶🏼", "👦🏽"],
    intruso: "🎃",
  },
];

iniciarJuego();

function iniciarJuego() {
  contenedor.innerHTML = "";
  mensaje.textContent = "";
  nuevoBtn.classList.add("oculto");

  const grupo = grupos[Math.floor(Math.random() * grupos.length)];

  let opciones = [...grupo.similares, grupo.intruso];
  opciones.sort(() => Math.random() - 0.5);

  opciones.forEach((emoji) => {
    const div = document.createElement("div");
    div.textContent = emoji;
    div.classList.add("imagen");
    div.style.fontSize = "80px";
    div.addEventListener("click", () => verificar(emoji, grupo.intruso));
    contenedor.appendChild(div);
  });
}

function verificar(emoji, intruso) {
  if (emoji === intruso) {
    mensaje.textContent = "🎉 Very good!";
    mensaje.style.color = "green";
    lanzarConfeti(); // 🎊 confeti al acertar
  } else {
    mensaje.textContent = "❌ Try again.";
    mensaje.style.color = "red";
    return;
  }
  nuevoBtn.classList.remove("oculto");
}

// 🎊 --- EFECTO CONFETI ---
function lanzarConfeti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetiCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const confetis = [];
  const colores = ["#ff8b94", "#ffaaa5", "#ffd3b6", "#a8e6cf", "#dcedc1"];

  for (let i = 0; i < 150; i++) {
    confetis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      d: Math.random() * 10 + 5,
      color: colores[Math.floor(Math.random() * colores.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }

  function dibujarConfeti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetis.forEach((c) => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 2);
      ctx.stroke();
    });

    actualizarConfeti();
    requestAnimationFrame(dibujarConfeti);
  }

  function actualizarConfeti() {
    confetis.forEach((c) => {
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);

      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  dibujarConfeti();

  // Desaparece suavemente después de 3 segundos
  setTimeout(() => {
    canvas.style.transition = "opacity 1s";
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 1000);
  }, 3000);
}
