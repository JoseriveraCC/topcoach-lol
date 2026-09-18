import { Brand, Button, Panel } from "../components/ui";

export function LandingPage() {
  return <main className="public-shell">
    <nav className="public-nav"><Brand /><div className="public-nav__actions"><Button href="#/login" variant="link">Iniciar sesión</Button><Button href="#/registro">Registrarme</Button></div></nav>
    <section className="landing-hero"><p className="eyebrow">Entrenamiento post-partida · Top Lane</p><h1>Jugá con intención.<span> Mejorá con evidencia.</span></h1><p>Vinculá tu cuenta de Riot y convertí bloques de 10 partidas válidas en prioridades claras y un plan concreto para tus próximas 3 partidas.</p><div className="hero-actions"><Button href="#/registro">Crear cuenta gratis</Button><Button href="#/login" variant="link">Ya tengo cuenta</Button></div></section>
    <section className="feature-grid" aria-label="Beneficios"><Panel><span className="feature-index">01</span><h2>Debilidades detectadas</h2><p>Patrones respaldados por métricas observables y sus limitaciones.</p></Panel><Panel><span className="feature-index">02</span><h2>Plan de práctica</h2><p>Tres partidas con una meta específica, medible y fácil de recordar.</p></Panel><Panel><span className="feature-index">03</span><h2>Seguimiento real</h2><p>Compará evaluaciones de 10 partidas nuevas sin promesas de subir de rango.</p></Panel></section>
    <footer className="legal-note">TopCoach LoL no está respaldado por Riot Games y no refleja sus opiniones.</footer>
  </main>;
}
