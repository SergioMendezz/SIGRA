import { useState } from "react";

const COLORS = {
    green: "#5EB453",
    greenDark: "#4CA23D",
    greenTint: "#EAF6E8",
    white: "#FFFFFF",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
    red: "#C0392B",
    redTint: "#FCEBEB",
};

const FONT = "'Source Serif 4', Georgia, 'Times New Roman', serif";

const VALID_USERS = [
    { email: "ricardo.infante@radifaxcr.com", password: "RadifaxCR2026", name: "Ricardo Infante", role: "Técnico", initials: "RI" },
    { email: "maria.ceciliano@radifaxcr.com", password: "Coord#2026", name: "María Fernanda Ceciliano", role: "Coordinador técnico", initials: "MC" },
    { email: "kimberly.sanchez@radifaxcr.com", password: "Ventas#2026", name: "Kimberly Sánchez", role: "Vendedor / Ejecutivo de cuenta", initials: "KS" },
    { email: "adriana.mora@radifaxcr.com", password: "Gerencia#2026", name: "Adriana Mora Quirós", role: "Gerente", initials: "AM" },
    { email: "admin@radifaxcr.com", password: "Admin#2026", name: "Administrador Radifax", role: "Administrador del sistema", initials: "AR" },
];

function Field({ label, type = "text", name, defaultValue, children }) {
    return (
        <label className="block mb-5">
            <span className="block text-xs mb-2" style={{ color: COLORS.charcoal, letterSpacing: "0.02em" }}>
                {label}
            </span>
            {children ?? (
                <input
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="rf-input w-full px-4 py-3 rounded-lg text-sm bg-white"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                />
            )}
        </label>
    );
}

function LoginForm({ onAuthSuccess, onForgotPassword }) {
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const email = (data.get("email") || "").trim().toLowerCase();
        const password = data.get("password") || "";


        const match = VALID_USERS.find((u) => u.email === email && u.password === password);
        if (match) {
            setError("");
            onAuthSuccess({ name: match.name, role: match.role, initials: match.initials });
        } else {
            setError("Credenciales incorrectas. Usá alguna de las cuentas de prueba de abajo.");

        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Field label="Correo corporativo" type="email" name="email" defaultValue="ricardo.infante@radifaxcr.com" />
            <Field label="Contraseña" type="password" name="password" defaultValue="RadifaxCR2026" />

            {error && (
                <div className="mb-5 px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: COLORS.redTint, color: COLORS.red }}>
                    {error}
                </div>
            )}

            <div className="flex items-center justify-between mb-8 text-xs">
                <label className="flex items-center gap-2" style={{ color: COLORS.muted }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: COLORS.green }} />
                    Recordarme
                </label>
                <button type="button" onClick={onForgotPassword} className="rf-link" style={{ color: COLORS.green, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
            <button
                type="submit"
                className="rf-btn w-full py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: COLORS.green, color: COLORS.white }}
            >
                Iniciar sesión
            </button>

=======

            <details className="mt-6">
                <summary className="text-xs cursor-pointer" style={{ color: COLORS.muted }}>
                    Cuentas de prueba (una por rol)
                </summary>
                <ul className="mt-3 space-y-1.5">
                    {VALID_USERS.map((u) => (
                        <li key={u.email} className="text-xs" style={{ color: COLORS.muted }}>
                            <span style={{ color: COLORS.charcoal, fontWeight: 600 }}>{u.role}:</span> {u.email} / {u.password}
                        </li>
                    ))}
                </ul>
            </details>

        </form>
    );
}

function RegisterForm({ onAuthSuccess }) {
    function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const fullName = (data.get("fullName") || "Nuevo usuario").trim();
        const role = data.get("role") || "Usuario";
        const initials = fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join("");

        onAuthSuccess({ name: fullName, role, initials: initials || "U" });
    }

    return (
        <form onSubmit={handleSubmit}>
            <Field label="Nombre completo" name="fullName" defaultValue="Kimberly Sánchez" />
            <Field label="Correo corporativo" type="email" name="email" defaultValue="kimberly.sanchez@radifaxcr.com" />
            <Field label="Teléfono" type="tel" name="phone" defaultValue="8842-1167" />
            <Field label="Rol">
                <select
                    name="role"
                    defaultValue="Vendedor / Ejecutivo de cuenta"
                    className="rf-input w-full px-4 py-3 rounded-lg text-sm bg-white"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                >
                    <option>Administrador del sistema</option>
                    <option>Gerente</option>
                    <option>Coordinador técnico</option>
                    <option>Técnico</option>
                    <option>Vendedor / Ejecutivo de cuenta</option>
                </select>
            </Field>
            <Field label="Contraseña" type="password" name="password" defaultValue="Ventas#2026" />
            <Field label="Confirmar contraseña" type="password" name="confirmPassword" defaultValue="Ventas#2026" />
            <button
                type="submit"
                className="rf-btn w-full py-3 rounded-lg text-sm font-medium mt-2"
                style={{ backgroundColor: COLORS.green, color: COLORS.white }}
            >
                Crear cuenta
            </button>
        </form>
    );
}

function ForgotPasswordForm({ onBackToLogin }) {
    const [step, setStep] = useState("email");
    const [email, setEmail] = useState("ricardo.infante@radifaxcr.com");

    function handleRequestCode(e) {
        e.preventDefault();
        setStep("reset");
    }

    function handleReset(e) {
        e.preventDefault();
        setStep("done");
    }

    if (step === "email") {
        return (
            <form onSubmit={handleRequestCode}>
                <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
                    Ingresá tu correo corporativo y te enviaremos un código para restablecer tu contraseña.
                </p>
                <Field label="Correo corporativo">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rf-input w-full px-4 py-3 rounded-lg text-sm bg-white"
                        style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                    />
                </Field>
                <button type="submit" className="rf-btn w-full py-3 rounded-lg text-sm font-medium mt-2" style={{ backgroundColor: COLORS.green, color: COLORS.white }}>
                    Enviar código
                </button>
                <button type="button" onClick={onBackToLogin} className="rf-link block text-center text-xs mt-5 w-full" style={{ color: COLORS.muted, background: "none", border: "none", cursor: "pointer" }}>
                    ← Volver a iniciar sesión
                </button>
            </form>
        );
    }

    if (step === "reset") {
        return (
            <form onSubmit={handleReset}>
                <p className="text-sm mb-6" style={{ color: COLORS.muted }}>
                    Te enviamos un código a <strong style={{ color: COLORS.charcoal }}>{email}</strong>. Ingresalo junto con tu nueva contraseña.
                </p>
                <Field label="Código de verificación" name="code" defaultValue="482913" />
                <Field label="Nueva contraseña" type="password" name="password" defaultValue="RadifaxCR2026*" />
                <Field label="Confirmar nueva contraseña" type="password" name="confirmPassword" defaultValue="RadifaxCR2026*" />
                <button type="submit" className="rf-btn w-full py-3 rounded-lg text-sm font-medium mt-2" style={{ backgroundColor: COLORS.green, color: COLORS.white }}>
                    Restablecer contraseña
                </button>
                <button type="button" onClick={onBackToLogin} className="rf-link block text-center text-xs mt-5 w-full" style={{ color: COLORS.muted, background: "none", border: "none", cursor: "pointer" }}>
                    ← Volver a iniciar sesión
                </button>
            </form>
        );
    }

    return (
        <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: COLORS.greenTint, color: COLORS.green, fontSize: "1.25rem" }}>
                ✓
            </div>
            <p className="text-sm mb-8" style={{ color: COLORS.charcoal }}>
                Tu contraseña se actualizó correctamente. Ya podés iniciar sesión con tu nueva contraseña.
            </p>
            <button type="button" onClick={onBackToLogin} className="rf-btn w-full py-3 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.green, color: COLORS.white }}>
                Ir a iniciar sesión
            </button>
        </div>
    );
}

export default function Auth({ onAuthSuccess }) {
    const [mode, setMode] = useState("login");

    return (
        <div
            style={{ fontFamily: FONT }}
            className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden px-4 py-12"
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600&display=swap');
        .rf-input::placeholder { color: #9C9C9C; }
        .rf-input:focus { border-color: ${COLORS.green} !important; box-shadow: 0 0 0 3px ${COLORS.greenTint}; outline: none; }
        .rf-tab { background: transparent; cursor: pointer; }
        .rf-btn { border: none; cursor: pointer; }
        .rf-btn:hover { background-color: ${COLORS.greenDark} !important; }
        .rf-link { text-decoration: none; }
        .rf-link:hover { text-decoration: underline; }
      `}</style>

            <svg className="absolute pointer-events-none" style={{ top: "-6rem", right: "-6rem", opacity: 0.5 }} width="420" height="420" viewBox="0 0 420 420">
                <circle cx="210" cy="210" r="60" fill="none" stroke={COLORS.green} strokeOpacity="0.15" strokeWidth="1.5" />
                <circle cx="210" cy="210" r="110" fill="none" stroke={COLORS.green} strokeOpacity="0.12" strokeWidth="1.5" />
                <circle cx="210" cy="210" r="160" fill="none" stroke={COLORS.green} strokeOpacity="0.08" strokeWidth="1.5" />
            </svg>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div style={{ color: COLORS.charcoal, letterSpacing: "0.12em" }} className="text-2xl font-semibold uppercase">Radifax</div>
                    <div style={{ color: COLORS.muted }} className="text-xs uppercase tracking-widest mt-2">Portal interno</div>
                </div>

                <div className="bg-white rounded-2xl p-10" style={{ border: `1px solid ${COLORS.border}`, boxShadow: "0 1px 3px rgba(50,50,50,0.06)" }}>
                    {mode !== "forgot" && (
                        <div className="flex mb-8" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                            <button type="button" className="rf-tab flex-1 pb-3 text-sm" style={{ color: mode === "login" ? COLORS.charcoal : COLORS.muted, borderBottom: mode === "login" ? `2px solid ${COLORS.green}` : "2px solid transparent", marginBottom: "-1px", fontWeight: mode === "login" ? 600 : 400 }} onClick={() => setMode("login")}>
                                Iniciar sesión
                            </button>
                            <button type="button" className="rf-tab flex-1 pb-3 text-sm" style={{ color: mode === "register" ? COLORS.charcoal : COLORS.muted, borderBottom: mode === "register" ? `2px solid ${COLORS.green}` : "2px solid transparent", marginBottom: "-1px", fontWeight: mode === "register" ? 600 : 400 }} onClick={() => setMode("register")}>
                                Crear cuenta
                            </button>
                        </div>
                    )}

                    {mode === "login" && <LoginForm onAuthSuccess={onAuthSuccess} onForgotPassword={() => setMode("forgot")} />}
                    {mode === "register" && <RegisterForm onAuthSuccess={onAuthSuccess} />}
                    {mode === "forgot" && <ForgotPasswordForm onBackToLogin={() => setMode("login")} />}
                </div>

                <p className="text-center text-xs mt-8" style={{ color: COLORS.muted }}>
                    © {new Date().getFullYear()} Radifax S.A. — Sistema interno de gestión
                </p>
            </div>
        </div>
    );
}