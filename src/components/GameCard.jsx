import React, { useState } from 'react';

const range = (min, max) => min === max ? String(min) : `${min}–${max}`;
export default function GameCard({ game }) {
  const [failedImage, setFailedImage] = useState(null);
  const categories = Array.isArray(game.category) ? game.category : [];
  return <article className="game-card">
    <div className={`game-art palette-${(game.id - 1) % 6}`}>
      {game.image && failedImage !== game.image
        ? <img src={game.image} alt={`Caja de ${game.name}`} loading="lazy" onError={() => setFailedImage(game.image)} />
        : <div className="cover" aria-hidden="true"><span className="cover-edition">LA COLECCIÓN · {String(game.id).padStart(2, '0')}</span><span className="cover-symbol">✦</span><span className="cover-title">{game.name}</span><span className="cover-bottom">UNA NUEVA PARTIDA TE ESPERA</span></div>}
      <span className={`status ${game.played ? 'played' : 'unplayed'}`}>{game.played ? '✓ Jugado' : 'Por estrenar'}</span>
    </div>
    <div className="card-body">
      <div className="card-heading"><h3>{game.name}</h3><span className="game-number">#{String(game.id).padStart(2, '0')}</span></div>
      <div className="game-info"><div><span className="info-label">JUGADORES</span><strong>{range(game.minPlayers, game.maxPlayers)} <span>personas</span></strong></div><div><span className="info-label">MEJOR CON</span><strong>{range(game.bestMinPlayers, game.bestMaxPlayers)} <span>personas</span></strong></div></div>
      {game.unplayedExpansion === true && <div className="expansion-notice"><span aria-hidden="true">✦</span><span>Expansión sin jugar</span></div>}
      <div className="categories" aria-label="Categorías">{categories.length ? categories.map(category => <span className="category" key={category}>{category}</span>) : <span className="no-category">Categorías por descubrir</span>}</div>
    </div>
  </article>;
}
