const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const nuevoBtn = document.getElementById("nuevo");
const volver = document.getElementById("volver");

volver.addEventListener("click", () => {
  window.location.href = "index.html";
});

nuevoBtn.addEventListener("click", iniciarJuego);

iniciarJuego();

function iniciarJuego() {
  tablero.innerHTML = "";
  mensaje.textContent = "";
  nuevoBtn.classList.add("oculto");

  const filas = [];
  for (let i = 0; i < 10; i++) {
    const inicio = i * 10;
    const fin = inicio + 9;
    filas.push(generarFila(inicio, fin));
  }
  filas.push(generarFila(100, 100)); // última fila solo con el 100

  filas.forEach((fila) => tablero.appendChild(fila));
}

function generarFila(inicio, fin) {
  const fila = document.createElement("div");
  fila.classList.add("fila");

  // Crear array de números disponibles para la fila
  const numeros = [];
  for (let i = inicio; i <= fin; i++) {
    numeros.push(i);
  }

  // Elegir cuántos ocultar: entre 2 y 4 normalmente, pero no más que (numeros.length - 1)
  // así evitamos ocultar todos los números y evitamos bucles infinitos en filas muy pequeñas (ej. [100])
  const minimoOcultar = 1; // siempre permitir ocultar al menos 1 (si hay)
  const deseado = Math.floor(Math.random() * 3) + 2; // 2..4
  const maxPosible = Math.max(1, numeros.length - 1); // al menos 1, o numeros.length-1 si hay >1 números
  const cantidadOculta = Math.min(deseado, maxPosible);

  // Elegir posiciones únicas para ocultar
  const ocultos = [];
  while (ocultos.length < cantidadOculta) {
    const n = numeros[Math.floor(Math.random() * numeros.length)];
    if (!ocultos.includes(n)) ocultos.push(n);
  }

  // Construir celdas: número visible o input para completar
  for (let i = inicio; i <= fin; i++) {
    const celda = document.createElement("div");
    celda.classList.add("celda");

    if (ocultos.includes(i)) {
      const input = document.createElement("input");
      input.type = "number";
      input.classList.add("input-num");
      input.dataset.correcto = i;
      // limitar rango para ayudar al usuario
      input.min = inicio;
      input.max = fin;
      input.inputMode = "numeric";
      // escuchar cambios
      input.addEventListener("input", verificarNumero);
      // prevenir que se pegue texto no numérico (opcional)
      input.addEventListener("paste", (ev) => {
        ev.preventDefault();
        const text = (ev.clipboardData || window.clipboardData).getData("text");
        const n = parseInt(text, 10);
        if (!isNaN(n)) input.value = n;
      });
      celda.appendChild(input);
    } else {
      celda.textContent = i;
    }
    fila.appendChild(celda);
  }

  return fila;
}

function verificarNumero(e) {
  const input = e.target;
  const valor = parseInt(input.value, 10);
  const correcto = parseInt(input.dataset.correcto, 10);

  if (!isFinite(valor)) {
    // valor vacío o no numérico: marcar neutral (no bloquear)
    input.classList.remove("correcto");
    input.style.backgroundColor = "";
    input.style.border = "";
    return;
  }

  if (valor === correcto) {
    input.classList.add("correcto");
    input.disabled = true;
    input.style.backgroundColor = "#b2f2bb"; // verde suave
    input.style.border = "2px solid green";
  } else {
    input.classList.remove("correcto");
    input.style.backgroundColor = "#ffc9c9"; // rojo suave
    input.style.border = "2px solid red";
  }

  verificarFin();
}

function verificarFin() {
  const inputs = document.querySelectorAll(".input-num");
  // si no hay inputs, no consideramos terminado
  if (inputs.length === 0) return;

  const completados = Array.from(inputs).every((inp) => inp.disabled === true);

  if (completados) {
    mensaje.textContent = "🎉 ¡Excelente! Completaste todos los números 🎯";
    mensaje.style.color = "green";
    nuevoBtn.classList.remove("oculto");
    lanzarConfeti();
  }
}

// 🎊 --- EFECTO CONFETI ---
function lanzarConfeti() {
  // evitar múltiples canvases si ya hay uno activo
  if (document.getElementById("confetiCanvas")) return;

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

  setTimeout(() => {
    canvas.style.transition = "opacity 1s";
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 1000);
  }, 3000);
}
