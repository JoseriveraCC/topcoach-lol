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
  const [errors, setErrors] = useState({ email: false, password: false });
  const [heading, submitLabel] = copy[mode];
  const needsPassword = mode !== "recover";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = { email: !email.trim(), password: needsPassword && !password.trim() };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) return;

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
          <div className="field"><label htmlFor="auth-email">Correo electrónico</label><input id="auth-email" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: false })); }} aria-invalid={errors.email || undefined} aria-describedby={errors.email ? "auth-email-error" : undefined} />{errors.email && <p className="field-error" id="auth-email-error" role="alert">Ingresá tu correo electrónico.</p>}</div>
          {needsPassword && <div className="field"><label htmlFor="auth-password">Contraseña</label><input id="auth-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: false })); }} aria-invalid={errors.password || undefined} aria-describedby={errors.password ? "auth-password-error" : undefined} />{errors.password && <p className="field-error" id="auth-password-error" role="alert">Ingresá tu contraseña.</p>}</div>}
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
