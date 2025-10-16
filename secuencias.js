const secuenciaDiv = document.getElementById("secuencia");
const opcionesDiv = document.getElementById("opciones");
const resultado = document.getElementById("resultado");
const nuevoBtn = document.getElementById("nuevo");
const volver = document.getElementById("volver");

volver.addEventListener("click", () => {
  window.location.href = "index.html";
});

nuevoBtn.addEventListener("click", iniciarJuego);

// Generar una nueva secuencia al cargar
iniciarJuego();

function iniciarJuego() {
  resultado.textContent = "";
  opcionesDiv.innerHTML = "";
  nuevoBtn.classList.add("oculto");

  const tipo = Math.random() < 0.5 ? "aritmetica" : "pares";
  let secuencia = [];
  let respuestaCorrecta = 0;

  if (tipo === "aritmetica") {
    // Secuencia aritmética (ej: 2, 4, 6, ?)
    const inicio = Math.floor(Math.random() * 5) + 1;
    const paso = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < 4; i++) secuencia.push(inicio + i * paso);
    respuestaCorrecta = inicio + 4 * paso;
  } else {
    // Solo números pares o impares
    const esPar = Math.random() < 0.5;
    const inicio = esPar ? 2 : 1;
    for (let i = 0; i < 4; i++) secuencia.push(inicio + i * 2);
    respuestaCorrecta = inicio + 8;
  }

  mostrarSecuencia(secuencia);
  mostrarOpciones(respuestaCorrecta);
}

function mostrarSecuencia(secuencia) {
  secuenciaDiv.innerHTML = "";
  secuencia.forEach((num) => {
    const span = document.createElement("span");
    span.textContent = num;
    secuenciaDiv.appendChild(span);
  });
  const hueco = document.createElement("span");
  hueco.textContent = "❓";
  secuenciaDiv.appendChild(hueco);
}

function mostrarOpciones(correcta) {
  const opciones = [correcta];
  while (opciones.length < 4) {
    const n = correcta + Math.floor(Math.random() * 10 - 5);
    if (!opciones.includes(n) && n > 0) opciones.push(n);
  }

  opciones.sort(() => Math.random() - 0.5);
  opciones.forEach((num) => {
    const btn = document.createElement("button");
    btn.classList.add("opcion");
    btn.textContent = num;
    btn.addEventListener("click", () => verificarRespuesta(num, correcta));
    opcionesDiv.appendChild(btn);
  });
}

function verificarRespuesta(num, correcta) {
  if (num === correcta) {
    resultado.textContent = "🎉 ¡Muy bien! La secuencia está completa.";
    resultado.style.color = "green";
  } else {
    resultado.textContent = "❌ Intenta otra vez.";
    resultado.style.color = "red";
    return;
  }
  nuevoBtn.classList.remove("oculto");
}
