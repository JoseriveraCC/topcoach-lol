const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function App() {
  return (
    <main>
      <p className="eyebrow">SEMINARIO PROFESIONAL 2 · MVP</p>
      <h1>TopCoach LoL</h1>
      <p>Entrenamiento post-partida basado en bloques de 10 partidas válidas de Top Lane.</p>
      <section>
        <h2>Alcance inicial</h2>
        <ul>
          <li>Ranked Solo/Duo · queueId 420</li>
          <li>Métricas determinísticas y reglas TOP versionadas</li>
          <li>AWS Bedrock como explicador controlado</li>
          <li>Historial y reevaluación con 10 partidas nuevas</li>
        </ul>
      </section>
      <small>API configurada: {apiUrl}</small>
    </main>
  );
}
