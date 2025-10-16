const modeloDiv = document.getElementById("modelo");
const opcionesDiv = document.getElementById("opciones");
const mensaje = document.getElementById("mensaje");
const nuevoBtn = document.getElementById("nuevo");
const volver = document.getElementById("volver");

const colores = ["red", "blue", "green", "yellow", "purple", "orange"];
const formas = ["circulo", "cuadrado", "triangulo"];

volver.addEventListener("click", () => {
  window.location.href = "index.html";
});

nuevoBtn.addEventListener("click", iniciarJuego);

iniciarJuego();

function iniciarJuego() {
  modeloDiv.innerHTML = "";
  opcionesDiv.innerHTML = "";
  mensaje.textContent = "";
  nuevoBtn.classList.add("oculto");

  const colorCorrecto = colores[Math.floor(Math.random() * colores.length)];
  const formaCorrecta = formas[Math.floor(Math.random() * formas.length)];
  const correcta = { color: colorCorrecto, forma: formaCorrecta };

  // Mostrar modelo
  const modelo = crearFigura(correcta.color, correcta.forma);
  modeloDiv.appendChild(modelo);

  // Crear opciones (una correcta + 3 distractores)
  const opciones = [correcta];
  while (opciones.length < 4) {
    const color = colores[Math.floor(Math.random() * colores.length)];
    const forma = formas[Math.floor(Math.random() * formas.length)];
    if (!opciones.some((o) => o.color === color && o.forma === forma)) {
      opciones.push({ color, forma });
    }
  }

  // Mezclar opciones
  opciones.sort(() => Math.random() - 0.5);

  opciones.forEach((op) => {
    const figura = crearFigura(op.color, op.forma);
    figura.classList.add("opcion");
    figura.addEventListener("click", () => verificar(op, correcta));
    opcionesDiv.appendChild(figura);
  });
}

function crearFigura(color, forma) {
  const div = document.createElement("div");
  div.classList.add("figura");
  div.style.backgroundColor = color;
  div.dataset.forma = forma;

  if (forma === "circulo") {
    div.style.borderRadius = "50%";
  } else if (forma === "triangulo") {
    div.style.width = 0;
    div.style.height = 0;
    div.style.borderLeft = "50px solid transparent";
    div.style.borderRight = "50px solid transparent";
    div.style.borderBottom = `100px solid ${color}`;
    div.style.backgroundColor = "transparent";
  }

  return div;
}

function verificar(opcion, correcta) {
  if (opcion.color === correcta.color && opcion.forma === correcta.forma) {
    mensaje.textContent = "🎉 ¡Muy bien! Acertaste.";
    mensaje.style.color = "green";
    lanzarConfeti(); // 🎊 confeti al acertar
  } else {
    mensaje.textContent = "❌ Intenta de nuevo.";
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

  // El confeti desaparece suavemente después de 3 segundos
  setTimeout(() => {
    canvas.style.transition = "opacity 1s";
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 1000);
  }, 3000);
}
