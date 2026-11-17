import React, { useEffect, useRef, useState } from "react";

const colors = ["#426b62", "#b85d42", "#8262a3", "#317a9b", "#a57526"];
function GameImage({ game }) {
  const [failed, setFailed] = useState(false);
  return game.image && !failed ? <img src={game.image} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span className="picker-placeholder" aria-hidden="true">⚄</span>;
}
export default function RoulettePicker({ visible }) {
  const [selected, setSelected] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const dialog = useRef(null);
  const startButton = useRef(null);
  const animation = useRef(null);
  useEffect(() => () => cancelAnimationFrame(animation.current), []);
  const toggle = (game) => setSelected(current => current.some(item => item.id === game.id) ? current.filter(item => item.id !== game.id) : current.length < 5 ? [...current, game] : current);
  function spin() {
    if (spinning) return;
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const index = Math.floor(random[0] / 4294967296 * selected.length);
    const slice = 360 / selected.length;
    const target = (360 - (index + .5) * slice) % 360;
    const next = rotation + 360 * 6 + ((target - rotation % 360 + 360) % 360);
    setWinner(null);
    setSpinning(true);
    const from = rotation;
    const started = performance.now();
    function animate(now) {
      const progress = Math.min((now - started) / 5000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRotation(from + (next - from) * eased);
      if (progress < 1) {
        animation.current = requestAnimationFrame(animate);
      } else {
        setWinner(selected[index]);
        setSpinning(false);
      }
    }
    animation.current = requestAnimationFrame(animate);
  }
  function close() {
    cancelAnimationFrame(animation.current);
    setSpinning(false);
    dialog.current.close();
  }
  return <>
    <div className="selection-bar">
      <div><strong>{selected.length} de 5 seleccionados</strong><p>Elegí hasta cinco juegos y dejá que la ruleta decida.</p></div>
      <button ref={startButton} className="primary-button" disabled={!selected.length} onClick={() => { setWinner(null); dialog.current.showModal(); }}>Empezar</button>
      {!!selected.length && <div className="selection-chips">{selected.map(game => <button key={game.id} onClick={() => toggle(game)} aria-label={`Quitar ${game.name}`}>{game.name} ×</button>)}</div>}
    </div>
    {selected.length === 5 && <p className="selection-hint" role="status">Llegaste al máximo de cinco. Quitá un juego para elegir otro.</p>}
    <div className="picker-grid">{visible.map(game => {
      const checked = selected.some(item => item.id === game.id);
      return <label key={game.id} className={`picker-game ${checked ? "is-selected" : ""}`}>
        <GameImage game={game} /><span>{game.name}</span>
        <input type="checkbox" checked={checked} disabled={!checked && selected.length === 5} onChange={() => toggle(game)} aria-label={`Seleccionar ${game.name}`} />
      </label>;
    })}</div>
    {!visible.length && <div className="empty"><h3>No encontramos juegos</h3><p>Probá cambiando los filtros. Tu selección sigue guardada.</p></div>}
    <dialog ref={dialog} className="roulette-modal" aria-labelledby="roulette-title" onCancel={close} onClose={() => startButton.current?.focus()} onClick={event => { if (event.target === dialog.current) close(); }}>
      <button className="modal-close" onClick={close} aria-label="Cerrar ruleta">×</button>
      <p className="eyebrow">EL AZAR ELIGE LA PARTIDA</p><h2 id="roulette-title">Que decida la ruleta.</h2>
      <div className={`wheel-frame ${spinning ? "is-spinning" : ""}`}><span className="wheel-pointer" aria-hidden="true" />
        <div className="roulette-wheel" style={{ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${selected.map((_, i) => `${colors[i]} ${i * 360 / selected.length}deg ${(i + 1) * 360 / selected.length}deg`).join(",")})` }}>
          {selected.map((game, i) => {
            const angle = (i + .5) * 2 * Math.PI / selected.length;
            return <div className="wheel-option" key={game.id} style={{ transform: `translate(-50%, -50%) rotate(${-rotation}deg)`, left: `${50 + Math.sin(angle) * (selected.length === 1 ? 0 : 31)}%`, top: `${50 - Math.cos(angle) * (selected.length === 1 ? 0 : 31)}%` }}><GameImage game={game} /><span>{game.name}</span></div>;
          })}
        </div>
      </div>
      <div className="roulette-controls">
      <p className={`roulette-result ${winner ? "has-winner" : ""}`} role="status" aria-live="polite">{spinning ? "La ruleta está girando…" : winner ? `¡Jugamos ${winner.name}!` : "Todo listo para elegir el próximo juego."}</p>
      <button className="primary-button" disabled={spinning} onClick={spin}>{spinning ? "Girando…" : winner ? "Volver a girar" : "Girar ruleta"}</button>
      <ul className="wheel-legend">{selected.map((game, i) => <li key={game.id}><i style={{ background: colors[i] }} />{game.name}</li>)}</ul>
      </div>
    </dialog>
  </>;
}
