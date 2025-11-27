const tablero = document.getElementById("tablero");
const volver = document.getElementById("volver");
const mensaje = document.getElementById("mensaje");

const iconos = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒", "🥝", "🍍"];
let cartas = [...iconos, ...iconos]; // pares duplicados
let seleccionadas = [];
let bloqueado = false;
let aciertos = 0;

// Mezclar las cartas
cartas.sort(() => Math.random() - 0.5);

// Crear las cartas en el tablero
cartas.forEach((icono) => {
  const carta = document.createElement("div");
  carta.classList.add("carta");
  carta.dataset.icono = icono;
  carta.addEventListener("click", () => voltearCarta(carta));
  tablero.appendChild(carta);
});

function voltearCarta(carta) {
  if (bloqueado || carta.classList.contains("volteada")) return;

  carta.textContent = carta.dataset.icono;
  carta.classList.add("volteada");
  seleccionadas.push(carta);

  if (seleccionadas.length === 2) {
    verificarPareja();
  }
}

function verificarPareja() {
  bloqueado = true;
  const [c1, c2] = seleccionadas;

  if (c1.dataset.icono === c2.dataset.icono) {
    aciertos++;
    seleccionadas = [];
    bloqueado = false;

    if (aciertos === iconos.length) {
      mensaje.textContent = "Completed!";
      mensaje.style.color = "green";
      lanzarConfeti(); // 🎊 confeti al completar el juego
    }
  } else {
    setTimeout(() => {
      c1.textContent = "";
      c2.textContent = "";
      c1.classList.remove("volteada");
      c2.classList.remove("volteada");
      seleccionadas = [];
      bloqueado = false;
    }, 800);
  }
}

volver.addEventListener("click", () => {
  window.location.href = "index.html";
});

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

  // El confeti desaparece suavemente después de 3 segundos
  setTimeout(() => {
    canvas.style.transition = "opacity 1s";
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 1000);
  }, 3000);
}
