import { useState, type FormEvent } from "react";
import { Brand, Button, Panel } from "../components/ui";

type AuthMode = "login" | "register" | "recover";

const copy = {
  login: ["Volvé a tu entrenamiento", "Iniciar sesión"],
  register: ["Creá tu cuenta", "Crear cuenta"],
  recover: ["Restablecer contraseña", "Enviar enlace demo"],
} as const;

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [heading, submitLabel] = copy[mode];
  const needsPassword = mode !== "recover";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || (needsPassword && !password.trim())) {
      setError("Completá los campos obligatorios para continuar.");
      return;
    }

    setError("");
    const nextRoute = mode === "register" ? "#/vincular" : mode === "login" ? "#/dashboard" : "#/login";
    window.location.hash = nextRoute;
  };

  return <main className="auth-shell">
    <div className="auth-card">
      <Brand />
      <Panel>
        <p className="eyebrow">Acceso demo</p>
        <h1>{heading}</h1>
        <p className="auth-intro">Usá cualquier dato no vacío para recorrer el prototipo.</p>
        <form onSubmit={submit} noValidate>
          <label className="field">Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error)} /></label>
          {needsPassword && <label className="field">Contraseña<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={Boolean(error)} /></label>}
          {error && <p className="field-error" role="alert">{error}</p>}
          <Button type="submit">{submitLabel}</Button>
        </form>
        <div className="auth-links">
          {mode === "login" && <><Button href="#/recuperar" variant="link">Olvidé mi contraseña</Button><Button href="#/registro" variant="link">Crear una cuenta</Button></>}
          {mode !== "login" && <Button href="#/login" variant="link">Volver a iniciar sesión</Button>}
        </div>
      </Panel>
    </div>
  </main>;
}
