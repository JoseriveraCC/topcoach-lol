import { useState, type FormEvent } from "react";
import { Brand, Button, Panel } from "../components/ui";

export function LinkAccountPage() {
  const [riotId, setRiotId] = useState("");
  const [tag, setTag] = useState("");
  const [region, setRegion] = useState("LAS");
  const [errors, setErrors] = useState({ riotId: false, tag: false });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = { riotId: !riotId.trim(), tag: !tag.trim() };
    setErrors(nextErrors);
    if (nextErrors.riotId || nextErrors.tag) return;

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
          <div className="field"><label htmlFor="riot-id">Riot ID</label><input id="riot-id" type="text" autoComplete="off" value={riotId} onChange={(event) => { setRiotId(event.target.value); setErrors((current) => ({ ...current, riotId: false })); }} aria-invalid={errors.riotId || undefined} aria-describedby={errors.riotId ? "riot-id-error" : undefined} />{errors.riotId && <p className="field-error" id="riot-id-error" role="alert">Ingresá tu Riot ID.</p>}</div>
          <div className="field"><label htmlFor="riot-tag">Tag</label><input id="riot-tag" type="text" autoComplete="off" value={tag} onChange={(event) => { setTag(event.target.value); setErrors((current) => ({ ...current, tag: false })); }} aria-invalid={errors.tag || undefined} aria-describedby={errors.tag ? "riot-tag-error" : undefined} />{errors.tag && <p className="field-error" id="riot-tag-error" role="alert">Ingresá tu Tag.</p>}</div>
          <label className="field">Región<select value={region} onChange={(event) => setRegion(event.target.value)}><option value="LAS">LAS</option><option value="LAN">LAN</option><option value="BR">BR</option><option value="NA">NA</option></select></label>
          <Button type="submit">Vincular cuenta demo</Button>
        </form>
      </Panel>
    </div>
  </main>;
}
