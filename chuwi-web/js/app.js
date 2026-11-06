// ====== DATOS (edita aquí países y universidades) ======
// Posiciones en unidades del marcador: ancho del marcador = 1. x derecha, y arriba.
const continentes = {
  "América": ["Estados Unidos", "Brasil", "México"],
  "Europa":  ["España", "Francia"],
  "Asia":    ["Japón", "Corea del Sur"],
};

const paises = {
  "Estados Unidos": { x: -0.30, y:  0.12, uni: "usa1" },
  "Brasil":         { x: -0.15, y: -0.15, uni: "bra1" },
  "México":         { x: -0.30, y:  0.00, uni: "mex1" },
  "España":         { x:  0.02, y:  0.15, uni: "esp1" },
  "Francia":        { x:  0.06, y:  0.18, uni: "fra1" },
  "Japón":          { x:  0.38, y:  0.12, uni: "jpn1" },
  "Corea del Sur":  { x:  0.34, y:  0.10, uni: "kor1" },
};

const textoBase = { Becas: "Información de becas…", Intercambio: "Información de intercambio…", Requisitos: "Requisitos…" };
const universidades = {
  usa1: { nombre: "Universidad en Estados Unidos", secciones: textoBase },
  bra1: { nombre: "Universidad en Brasil",         secciones: textoBase },
  mex1: { nombre: "Universidad en México",         secciones: textoBase },
  esp1: { nombre: "Universidad en España",         secciones: textoBase },
  fra1: { nombre: "Universidad en Francia",        secciones: textoBase },
  jpn1: { nombre: "Universidad en Japón",          secciones: textoBase },
  kor1: { nombre: "Universidad en Corea del Sur",  secciones: textoBase },
};

// ====== LÓGICA ======
const $ = (id) => document.getElementById(id);
const arSystem = () => document.querySelector("a-scene").systems["mindar-image-system"];
let paisActual = null;

function mostrar(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

// Pantalla 1 → 2
$("btnStart").onclick = () => { mostrar("map"); arSystem().start(); };

// Aviso "apunta al marcador"
$("target").addEventListener("targetFound", () => $("hint").classList.add("off"));
$("target").addEventListener("targetLost",  () => $("hint").classList.remove("off"));

// Selectores
const selC = $("continente"), selP = $("pais");
selC.innerHTML = Object.keys(continentes).map(c => `<option>${c}</option>`).join("");
function cargarPaises() {
  selP.innerHTML = `<option value="">País</option>` +
    continentes[selC.value].map(p => `<option>${p}</option>`).join("");
  $("btnUni").classList.add("hidden");
  paisActual = null;
}
selC.onchange = cargarPaises;
cargarPaises();

selP.onchange = () => {
  if (!selP.value) return;
  paisActual = paises[selP.value];
  caminarA(paisActual);
  $("btnUni").classList.remove("hidden");
};

// Chuwi camina hacia el país
function caminarA(p) {
  const chuwi = $("chuwi");
  chuwi.setAttribute("animation__move", {
    property: "position", to: `${p.x} ${p.y} 0.05`, dur: 1500, easing: "easeInOutQuad"
  });
}

// Pantalla 2 → 3
$("btnUni").onclick = () => {
  if (!paisActual) return;
  arSystem().stop();
  const u = universidades[paisActual.uni];
  $("uniNombre").textContent = u.nombre;
  $("uniSecciones").innerHTML = Object.keys(u.secciones).map(k => `<li>${k}</li>`).join("");
  $("uniInfo").textContent = "Elige una sección";
  document.querySelectorAll("#uniSecciones li").forEach(li => {
    li.onclick = () => {
      document.querySelectorAll("#uniSecciones li").forEach(x => x.classList.remove("sel"));
      li.classList.add("sel");
      $("uniInfo").textContent = u.secciones[li.textContent];
    };
  });
  mostrar("uni");
};

// Pantalla 3 → 2
$("btnBack").onclick = () => { mostrar("map"); arSystem().start(); };
