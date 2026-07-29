import { useState } from "react";
import {
    Home,
    Wrench,
    Radio,
    Package,
    Users,
    LayoutDashboard,
    Sparkles,
    FileText,
    Route,
    Handshake,
<<<<<<< HEAD
=======
    Building2,
>>>>>>> e97be07 (Fix de vista)
    Waves,
    LogOut,
} from "lucide-react";
import { MODULES } from "../data/modules";
import ModuleView from "../components/ModuleView";
<<<<<<< HEAD
=======
import NotificationsBell from "../components/NotificationsBell";
import IAChatPanel from "../components/IAChatPanel";
>>>>>>> e97be07 (Fix de vista)

const COLORS = {
    green: "#5EB453",
    greenDark: "#4CA23D",
    greenTint: "#EAF6E8",
    white: "#FFFFFF",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

const FONT = "'Source Serif 4', Georgia, 'Times New Roman', serif";

const ICONS = {
    usuarios: Users,
    tickets: Wrench,
    alquiler: Radio,
    inventario: Package,
    dashboard: LayoutDashboard,
    ia: Sparkles,
    contratos: FileText,
    giras: Route,
    crm: Handshake,
<<<<<<< HEAD
=======
    clientes: Building2,
>>>>>>> e97be07 (Fix de vista)
    frecuencias: Waves,
};

function Sidebar({ active, onSelect, user, onLogout }) {
<<<<<<< HEAD
=======
    const visibleModules = MODULES.filter((m) => !m.adminOnly || user.role === "Administrador del sistema");

>>>>>>> e97be07 (Fix de vista)
    return (
        <aside
            className="w-72 shrink-0 h-screen sticky top-0 flex flex-col px-5 py-6"
            style={{ borderRight: `1px solid ${COLORS.border}`, backgroundColor: COLORS.white }}
        >
            <div className="mb-8 px-2">
                <div style={{ color: COLORS.charcoal, letterSpacing: "0.12em" }} className="text-lg font-semibold uppercase">
                    Radifax
                </div>
                <div style={{ color: COLORS.muted }} className="text-xs uppercase tracking-widest mt-1">
                    Portal interno
                </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-3 mb-6 rounded-lg" style={{ backgroundColor: COLORS.greenTint }}>
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{ backgroundColor: COLORS.green, color: COLORS.white }}
                >
                    {user.initials}
                </div>
                <div className="min-w-0">
                    <p className="text-sm truncate" style={{ color: COLORS.charcoal }}>
                        {user.name}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.muted }}>
                        {user.role}
                    </p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto">
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left text-sm"
                    style={{
                        backgroundColor: active === null ? COLORS.greenTint : "transparent",
                        color: active === null ? COLORS.green : COLORS.charcoal,
                        fontWeight: active === null ? 600 : 400,
                    }}
                >
                    <Home size={17} color={active === null ? COLORS.green : COLORS.muted} />
                    Inicio
                </button>

<<<<<<< HEAD
                {MODULES.map((m) => {
=======
                {visibleModules.map((m) => {
>>>>>>> e97be07 (Fix de vista)
                    const Icon = ICONS[m.id];
                    const isActive = active === m.id;
                    return (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => onSelect(m.id)}
                            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg mb-1 text-left text-sm leading-snug"
                            style={{
                                backgroundColor: isActive ? COLORS.greenTint : "transparent",
                                color: isActive ? COLORS.green : COLORS.charcoal,
                                fontWeight: isActive ? 600 : 400,
                            }}
                        >
                            <Icon size={17} className="mt-0.5 shrink-0" color={isActive ? COLORS.green : COLORS.muted} />
                            {m.label}
                        </button>
                    );
                })}
            </nav>

            <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm mt-4"
                style={{ color: COLORS.muted }}
            >
                <LogOut size={17} color={COLORS.muted} />
                Cerrar sesión
            </button>
        </aside>
    );
}

function Welcome({ user }) {
    const today = new Date().toLocaleDateString("es-CR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden px-6">
            <svg
                className="absolute pointer-events-none"
                style={{ top: "-6rem", right: "-6rem", opacity: 0.5 }}
                width="420"
                height="420"
                viewBox="0 0 420 420"
            >
                <circle cx="210" cy="210" r="60" fill="none" stroke={COLORS.green} strokeOpacity="0.15" strokeWidth="1.5" />
                <circle cx="210" cy="210" r="110" fill="none" stroke={COLORS.green} strokeOpacity="0.12" strokeWidth="1.5" />
                <circle cx="210" cy="210" r="160" fill="none" stroke={COLORS.green} strokeOpacity="0.08" strokeWidth="1.5" />
            </svg>
            <div className="text-center relative z-10">
                <p style={{ color: COLORS.muted }} className="text-xs uppercase tracking-widest mb-4 capitalize">
                    {today}
                </p>
                <h1 className="text-3xl mb-3" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                    Bienvenido, {user.name.split(" ")[0]}
                </h1>
                <p className="text-base" style={{ color: COLORS.muted }}>
                    Espero que tengas un excelente día.
                </p>
            </div>
        </div>
    );
}

export default function Dashboard({ user, onLogout }) {
    const [active, setActive] = useState(null);
    const currentModule = MODULES.find((m) => m.id === active) || null;

    return (
        <div style={{ fontFamily: FONT }} className="min-h-screen w-full flex bg-white">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600&display=swap');
      `}</style>
            <Sidebar active={active} onSelect={setActive} user={user} onLogout={onLogout} />
<<<<<<< HEAD
            {currentModule ? <ModuleView module={currentModule} Icon={ICONS[currentModule.id]} key={currentModule.id} /> : <Welcome user={user} />}
        </div>
    );
}
=======
            {currentModule ? (
                <ModuleView module={currentModule} Icon={ICONS[currentModule.id]} user={user} key={currentModule.id} />
            ) : (
                <Welcome user={user} />
            )}
            <NotificationsBell role={user.role} />
            <IAChatPanel />
        </div>
    );
}
>>>>>>> e97be07 (Fix de vista)
