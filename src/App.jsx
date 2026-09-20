import React, { useState } from "react";
import games from "../ludoteca.json";
import GameCard from "./components/GameCard.jsx";

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const tabs = [
  ["all", "Todos los juegos"],
  ["two", "Para 2"],
  ["unplayed", "Por estrenar"],
  ["played", "Ya jugados"],
];
export default function App() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("name");
  const [category, setCategory] = useState("");
  const [expansionsOnly, setExpansionsOnly] = useState(false);
  const categories = [
    ...new Set(
      games.flatMap((game) =>
        Array.isArray(game.category) ? game.category : [],
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));
  const pendingExpansions = games.filter(
    (game) => game.unplayedExpansion === true,
  ).length;
  const unplayed = games.filter((game) => !game.played).length;
  const visible = games
    .filter(
      (game) =>
        normalize(game.name).includes(normalize(query.trim())) &&
        (tab !== "two" || (game.minPlayers <= 2 && game.maxPlayers >= 2)) &&
        (tab !== "unplayed" || !game.played) &&
        (tab !== "played" || game.played) &&
        (!category || game.category?.includes(category)) &&
        (!expansionsOnly || game.unplayedExpansion === true),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "es")
        : sort === "players"
          ? a.minPlayers - b.minPlayers || a.id - b.id
          : a.id - b.id,
    );
  function reset() {
    setQuery("");
    setTab("all");
    setCategory("");
    setExpansionsOnly(false);
  }
  return (
    <>
      <header className="site-header">
        <a href="#" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ⚄
          </span>{" "}
          entre turnos<span className="brand-dot">.</span>
        </a>
        <span className="header-note">MI LUDOTECA PERSONAL</span>
        <a className="collection-link" href="#coleccion">
          La Colección <span>↗</span>
        </a>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> EL PLAN EMPIEZA EN LA MESA
            </p>
            <h1>
              Buenos juegos.
              <br />
              <em>Mejores momentos.</em>
            </h1>
            <p className="hero-description">
              Una colección de mundos por explorar, estrategias por probar
              <br className="desktop-break" /> y excusas para juntarnos. ¿Qué
              sale a la mesa hoy?
            </p>
            <a href="#coleccion" className="hero-link">
              Explorá la colección <span>↓</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✧</span>
            <div className="tile tile-back">
              <span>EL PRÓXIMO</span>
              <strong>
                gran
                <br />
                plan.
              </strong>
              <span>ESTÁ EN UNA CAJA</span>
            </div>
            <div className="dice">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="round-token">
              a jugar
              <br />
              <span>↗</span>
            </div>
          </div>
        </section>
        <section className="stats" aria-label="Resumen de la Colección">
          <div>
            <strong>{games.length}</strong>
            <span>juegos en la Colección</span>
          </div>
          <div>
            <strong>{games.length - unplayed}</strong>
            <span>ya compartieron mesa</span>
          </div>
          <div>
            <strong>{unplayed}</strong>
            <span>aventuras por estrenar</span>
          </div>
          <div className="expansion-stat">
            <strong>{pendingExpansions}</strong>
            <span>juegos con expansión sin jugar</span>
          </div>
        </section>
        <section id="coleccion" className="collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EL ESTANTE DE LOS BUENOS PLANES</p>
              <h2>
                La Colección<span>.</span>
              </h2>
            </div>
            <label className="search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscá tu próximo juego…"
                aria-label="Buscar juegos por nombre"
              />
            </label>
          </div>
          <div className="toolbar">
            <div className="tabs" aria-label="Filtrar juegos">
              {tabs.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={tab === value}
                  className={tab === value ? "active" : ""}
                  onClick={() => setTab(value)}
                >
                  {label}
                  {value === "all" && <span>{games.length}</span>}
                </button>
              ))}
            </div>
            <div className="selects">
              {categories.length > 0 && (
                <label>
                  Categoría{" "}
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Todas</option>
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Ordenar por{" "}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="collection">Colección</option>
                  <option value="name">Nombre A–Z</option>
                  <option value="players">Jugadores</option>
                </select>
              </label>
            </div>
          </div>
          <div className="expansion-filter-row">
            <label className="expansion-filter">
              <input
                type="checkbox"
                checked={expansionsOnly}
                onChange={(event) => setExpansionsOnly(event.target.checked)}
              />
              <span>Con expansión sin jugar</span>
              <span className="filter-count">{pendingExpansions}</span>
            </label>
            {(query || tab !== "all" || category || expansionsOnly) && (
              <button type="button" className="clear-filters" onClick={reset}>
                Limpiar filtros
              </button>
            )}
          </div>
          <p className="results" role="status">
            {visible.length} {visible.length === 1 ? "juego" : "juegos"} para tu
            próxima partida
            {tab === "two" && <span> · Admiten 2 jugadores</span>}
            {category && <span> · {category}</span>}
            {expansionsOnly && <span> · Con expansión sin jugar</span>}
          </p>
          {visible.length ? (
            <div className="game-grid">
              {visible.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <span>✧</span>
              <h3>No encontramos juegos</h3>
              <p>Probá con otro nombre o cambiá los filtros.</p>
              <button onClick={reset}>Ver todos los juegos</button>
            </div>
          )}
        </section>
      </main>
      <footer>
        <a href="#" className="brand">
          entre turnos.
        </a>
        <p>Los mejores recuerdos se juegan en compañía.</p>
        <span>{games.length} cajas. Infinitas historias.</span>
      </footer>
    </>
  );
}
