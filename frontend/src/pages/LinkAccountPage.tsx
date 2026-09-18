import { useState, type FormEvent } from "react";
import { Brand, Button, Panel } from "../components/ui";

export function LinkAccountPage() {
  const [riotId, setRiotId] = useState("");
  const [tag, setTag] = useState("");
  const [region, setRegion] = useState("LAS");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!riotId.trim() || !tag.trim()) {
      setError("Ingresá tu Riot ID y Tag para continuar.");
      return;
    }

    setError("");
    window.location.hash = "#/dashboard";
  };

  return <main className="auth-shell">
    <div className="auth-card">
      <Brand />
      <Panel>
        <p className="eyebrow">Perfil de juego</p>
        <h1>Vinculá tu Riot ID</h1>
        <p className="auth-intro">Esta demo no consulta la API de Riot</p>
        <form onSubmit={submit} noValidate>
          <label className="field">Riot ID<input type="text" autoComplete="off" value={riotId} onChange={(event) => setRiotId(event.target.value)} aria-invalid={Boolean(error)} /></label>
          <label className="field">Tag<input type="text" autoComplete="off" value={tag} onChange={(event) => setTag(event.target.value)} aria-invalid={Boolean(error)} /></label>
          <label className="field">Región<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="LAS">LAS</option><option value="LAN">LAN</option><option value="BR">BR</option><option value="NA">NA</option></select></label>
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit">Vincular cuenta demo</Button>
        </form>
      </Panel>
    </div>
  </main>;
}
