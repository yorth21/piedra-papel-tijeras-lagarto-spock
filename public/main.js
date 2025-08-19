"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const root = document.getElementById("app");
const opciones = [
    { nombre: "Piedra", ganaA: ["Tijera", "Lagarto"], icono: "🪨" },
    { nombre: "Papel", ganaA: ["Piedra", "Spock"], icono: "🧻" },
    { nombre: "Tijera", ganaA: ["Papel", "Lagarto"], icono: "✂️" },
    { nombre: "Lagarto", ganaA: ["Spock", "Piedra"], icono: "🦎" },
    { nombre: "Spock", ganaA: ["Tijera", "Papel"], icono: "🖖" }
];
function resolverRonda(opcionJugador, opcionRival) {
    const opcionJugadorData = opciones.find((opcion) => opcion.nombre === opcionJugador);
    const opcionRivalData = opciones.find((opcion) => opcion.nombre === opcionRival);
    if (!opcionJugadorData || !opcionRivalData) {
        throw new Error("Opción no válida");
    }
    if (opcionJugadorData.ganaA.includes(opcionRival)) {
        return "Ganaste";
    }
    else if (opcionRivalData.ganaA.includes(opcionJugador)) {
        return "Perdiste";
    }
    return "Empate";
}
function elegirOpcionPC() {
    const indice = Math.floor(Math.random() * opciones.length);
    return opciones[indice];
}
let victoriasJugador = 0;
let victoriasPC = 0;
let empates = 0;
// Audio: tonos para victoria, derrota y empate
let audioCtx = null;
function getAudioCtx() {
    if (!audioCtx) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) {
            throw new Error("AudioContext no soportado en este navegador");
        }
        audioCtx = new Ctor();
    }
    const ctx = audioCtx;
    if (ctx.state === "suspended") {
        ctx.resume();
    }
    return ctx;
}
function tone(frequency, startAt, durationMs, type = "sine", volume = 0.04) {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    const t = ctx.currentTime + startAt;
    const attack = 0.005;
    const release = 0.08;
    const durSec = durationMs / 1000;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + attack);
    gain.gain.setValueAtTime(volume, t + Math.max(attack, durSec - release));
    gain.gain.linearRampToValueAtTime(0.0001, t + durSec);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + durSec + 0.02);
}
function playSound(resultado) {
    if (resultado === "Ganaste") {
        tone(523.25, 0.00, 120, "triangle", 0.045); // C5
        tone(659.25, 0.16, 120, "triangle", 0.045); // E5
        tone(783.99, 0.32, 140, "triangle", 0.045); // G5
    }
    else if (resultado === "Perdiste") {
        tone(392.0, 0.00, 140, "sawtooth", 0.035); // G4
        tone(261.63, 0.18, 220, "sawtooth", 0.03); // C4
    }
    else {
        tone(440.0, 0.00, 120, "sine", 0.035); // A4
    }
}
function renderApp() {
    if (!root)
        return;
    root.innerHTML = `
    <div class="app">
      <header class="header">
        <h1 class="title">Piedra Papel Tijera Lagarto Spock</h1>
        <p class="subtitle">Elige una opción para jugar contra la PC</p>
      </header>

      <section class="scoreboard" aria-live="polite">
        <div class="score"><span>Jugador</span><strong id="score-jugador">0</strong></div>
        <div class="score"><span>Empates</span><strong id="score-empates">0</strong></div>
        <div class="score"><span>PC</span><strong id="score-pc">0</strong></div>
      </section>

      <section class="choices" role="group" aria-label="Opciones de juego">
        ${opciones
        .map((o) => `
              <button class="choice" data-opcion="${o.nombre}" aria-label="${o.nombre}">
                <span class="icon">${o.icono}</span>
                <span class="label">${o.nombre}</span>
              </button>
            `)
        .join("")}
      </section>

      <section class="result" id="result">
        <div class="last-play" id="last-play"></div>
        <p class="message" id="message">Comienza el juego</p>
      </section>

      <footer class="actions">
        <button id="reset" class="reset" aria-label="Reiniciar marcador">Reiniciar</button>
      </footer>
    </div>
  `;
    const buttons = Array.from(document.querySelectorAll(".choice"));
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const opcionJugador = btn.dataset.opcion;
            jugarRonda(opcionJugador);
        });
    });
    const resetBtn = document.getElementById("reset");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            victoriasJugador = 0;
            victoriasPC = 0;
            empates = 0;
            actualizarMarcador();
            actualizarResultado("", "", "Comienza el juego");
        });
    }
    actualizarMarcador();
}
function actualizarMarcador() {
    const jugador = document.getElementById("score-jugador");
    const pc = document.getElementById("score-pc");
    const emp = document.getElementById("score-empates");
    if (jugador)
        jugador.textContent = String(victoriasJugador);
    if (pc)
        pc.textContent = String(victoriasPC);
    if (emp)
        emp.textContent = String(empates);
}
function actualizarResultado(opcionJugador, opcionPC, mensaje, estado) {
    var _a, _b, _c, _d;
    const lastPlay = document.getElementById("last-play");
    const message = document.getElementById("message");
    const iconJugador = (_b = (_a = opciones.find((o) => o.nombre === opcionJugador)) === null || _a === void 0 ? void 0 : _a.icono) !== null && _b !== void 0 ? _b : "";
    const iconPC = (_d = (_c = opciones.find((o) => o.nombre === opcionPC)) === null || _c === void 0 ? void 0 : _c.icono) !== null && _d !== void 0 ? _d : "";
    if (lastPlay) {
        lastPlay.innerHTML = opcionJugador && opcionPC
            ? `
        <div class="duel">
          <div class="duel-side">
            <div class="duel-emoji" aria-hidden="true">${iconJugador}</div>
            <div class="duel-label">Tú — ${opcionJugador}</div>
          </div>
          <div class="duel-vs" aria-hidden="true">VS</div>
          <div class="duel-side">
            <div class="duel-emoji" aria-hidden="true">${iconPC}</div>
            <div class="duel-label">PC — ${opcionPC}</div>
          </div>
        </div>
      `
            : "";
    }
    if (message) {
        message.textContent = mensaje;
        message.classList.remove("win", "lose", "draw");
        if (estado === "Ganaste")
            message.classList.add("win");
        else if (estado === "Perdiste")
            message.classList.add("lose");
        else if (estado === "Empate")
            message.classList.add("draw");
    }
}
function setButtonsDisabled(disabled) {
    const buttons = Array.from(document.querySelectorAll(".choice"));
    const resetBtn = document.getElementById("reset");
    buttons.forEach((b) => (b.disabled = disabled));
    if (resetBtn)
        resetBtn.disabled = disabled;
}
function spinPC(opcionJugador, target, durationMs = 1200) {
    return new Promise((resolve) => {
        const start = Date.now();
        let i = 0;
        const tick = () => {
            const elapsed = Date.now() - start;
            if (elapsed >= durationMs) {
                actualizarResultado(opcionJugador, target.nombre, "");
                resolve();
                return;
            }
            const current = opciones[i % opciones.length];
            actualizarResultado(opcionJugador, current.nombre, "La PC está eligiendo...");
            i += 1;
            setTimeout(tick, 70);
        };
        tick();
    });
}
function jugarRonda(opcionJugador) {
    return __awaiter(this, void 0, void 0, function* () {
        const pc = elegirOpcionPC();
        setButtonsDisabled(true);
        yield spinPC(opcionJugador, pc, 1200);
        const resultado = resolverRonda(opcionJugador, pc.nombre);
        if (resultado === "Ganaste") {
            victoriasJugador += 1;
            try {
                confetti === null || confetti === void 0 ? void 0 : confetti({ particleCount: 90, spread: 75, startVelocity: 40, origin: { y: 0.7 } });
                confetti === null || confetti === void 0 ? void 0 : confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
                confetti === null || confetti === void 0 ? void 0 : confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
            }
            catch (_a) { }
        }
        else if (resultado === "Perdiste") {
            victoriasPC += 1;
        }
        else {
            empates += 1;
        }
        // reproducir sonido según resultado
        try {
            playSound(resultado);
        }
        catch (_b) { }
        actualizarMarcador();
        actualizarResultado(opcionJugador, pc.nombre, mensajeResultado(resultado), resultado);
        setButtonsDisabled(false);
    });
}
function mensajeResultado(r) {
    if (r === "Ganaste")
        return "¡Ganaste la ronda!";
    if (r === "Perdiste")
        return "Perdiste la ronda";
    return "Empate";
}
renderApp();
