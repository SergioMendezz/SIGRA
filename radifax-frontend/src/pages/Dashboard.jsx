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
  Waves,
  LogOut,
} from "lucide-react";

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

const MODULES = [
  {
    id: "tickets",
    label: "Tickets de servicio técnico",
    icon: Wrench,
    metrics: [
      { label: "Boletas abiertas", value: "14" },
      { label: "En taller", value: "6" },
      { label: "Cerradas este mes", value: "52" },
    ],
    columns: ["Boleta", "Cliente", "Técnico", "Estado"],
    rows: [
      ["BOL-00187", "Hotel Los Sueños", "Ricardo Infante", "En proceso"],
      ["BOL-00186", "ICT", "Tomás Díaz", "Cerrada"],
      ["BOL-00185", "Bomberos de Costa Rica", "Ricardo Infante", "Asignada"],
    ],
  },
  {
    id: "alquiler",
    label: "Alquiler de radios y repetidoras",
    icon: Radio,
    metrics: [
      { label: "Contratos activos", value: "38" },
      { label: "Por vencer (30 días)", value: "5" },
      { label: "Baterías por cambiar", value: "9" },
    ],
    columns: ["Contrato", "Cliente", "Equipos", "Vence"],
    rows: [
      ["CT-0042", "Hotel Los Sueños", "12 radios", "15/09/2026"],
      ["CT-0041", "Bomberos de Costa Rica", "3 repetidoras", "02/08/2026"],
      ["CT-0039", "ICT", "8 radios", "30/11/2026"],
    ],
  },
  {
    id: "inventario",
    label: "Inventario de equipos",
    icon: Package,
    metrics: [
      { label: "Equipos totales", value: "214" },
      { label: "Disponibles", value: "61" },
      { label: "En taller", value: "6" },
    ],
    columns: ["Serie", "Modelo", "Categoría", "Estado"],
    rows: [
      ["SN-88213", "Motorola CP200", "Radio portátil", "Disponible"],
      ["SN-88214", "Kenwood TK-3170", "Radio portátil", "Alquilado"],
      ["SN-77002", "Repetidora UHF-40", "Repetidora", "En mantenimiento"],
    ],
  },
  {
    id: "usuarios",
    label: "Usuarios y accesos",
    icon: Users,
    metrics: [
      { label: "Usuarios activos", value: "11" },
      { label: "Roles", value: "5" },
      { label: "Sesiones hoy", value: "7" },
    ],
    columns: ["Nombre", "Rol", "Estado"],
    rows: [
      ["Ricardo Infante", "Técnico", "Activo"],
      ["Kimberly Sánchez", "Vendedor", "Activo"],
      ["María Fernanda Ceciliano", "Recepción", "Activo"],
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard y reportes",
    icon: LayoutDashboard,
    metrics: [
      { label: "Ingresos del mes", value: "₡4.2M" },
      { label: "Alertas activas", value: "12" },
      { label: "Tickets abiertos", value: "14" },
    ],
    columns: ["Reporte", "Período", "Formato"],
    rows: [
      ["Contratos por vencer", "Julio 2026", "PDF"],
      ["Servicios facturados", "Julio 2026", "Excel"],
      ["Bitácora de tickets", "Junio 2026", "PDF"],
    ],
  },
  {
    id: "ia",
    label: "Agente de inteligencia artificial",
    icon: Sparkles,
    metrics: [
      { label: "Consultas hoy", value: "23" },
      { label: "Resueltas automáticamente", value: "19" },
      { label: "Escaladas", value: "4" },
    ],
    columns: ["Consulta", "Usuario", "Resultado"],
    rows: [
      ["Contratos que vencen este mes", "Kimberly Sánchez", "Resuelto"],
      ["Resumen de boleta BOL-00187", "Ricardo Infante", "Resuelto"],
      ["Clasificación de ticket nuevo", "Sistema", "Escalado"],
    ],
  },
  {
    id: "contratos",
    label: "Contratos y facturación",
    icon: FileText,
    metrics: [
      { label: "Facturado este mes", value: "₡3.1M" },
      { label: "En garantía", value: "3" },
      { label: "Pagos pendientes", value: "2" },
    ],
    columns: ["Factura", "Cliente", "Monto", "Estado"],
    rows: [
      ["FA-01188", "Hotel Los Sueños", "₡185,000", "Cobrada"],
      ["FA-01187", "ICT", "₡92,500", "Pendiente"],
      ["FA-01186", "Bomberos de Costa Rica", "₡410,000", "Cobrada"],
    ],
  },
  {
    id: "giras",
    label: "Giras y planificación de rutas",
    icon: Route,
    metrics: [
      { label: "Giras este mes", value: "9" },
      { label: "En curso", value: "1" },
      { label: "Boletas generadas", value: "27" },
    ],
    columns: ["Gira", "Técnico", "Clientes", "Estado"],
    rows: [
      ["GIR-014", "Tomás Díaz", "4 clientes", "En proceso"],
      ["GIR-013", "Ricardo Infante", "3 clientes", "Cerrada"],
      ["GIR-012", "Tomás Díaz", "5 clientes", "Cerrada"],
    ],
  },
  {
    id: "crm",
    label: "CRM y prospectos",
    icon: Handshake,
    metrics: [
      { label: "Prospectos activos", value: "17" },
      { label: "Cotizaciones en curso", value: "6" },
      { label: "Convertidos este mes", value: "3" },
    ],
    columns: ["Prospecto", "Vendedor", "Estado"],
    rows: [
      ["Marina Pez Vela", "Kimberly Sánchez", "Cotización enviada"],
      ["Refinadora Costarricense", "Henry Ortiz", "En negociación"],
      ["Autobuses San José", "Alejandro Arias", "Nuevo"],
    ],
  },
  {
    id: "frecuencias",
    label: "Frecuencias de radio",
    icon: Waves,
    metrics: [
      { label: "Frecuencias vigentes", value: "22" },
      { label: "Por renovar (6 meses)", value: "4" },
      { label: "En trámite", value: "2" },
    ],
    columns: ["Cliente", "Frecuencia", "Vence"],
    rows: [
      ["Hotel Los Sueños", "462.550 MHz", "12/2026"],
      ["Bomberos de Costa Rica", "154.100 MHz", "03/2027"],
      ["ICT", "467.750 MHz", "09/2026"],
    ],
  },
];

function Sidebar({ active, onSelect, user, onLogout }) {
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

        {MODULES.map((m) => {
          const Icon = m.icon;
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

function ModuleView({ module }) {
  const Icon = module.icon;
  return (
    <div className="flex-1 px-10 py-10 max-w-4xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.greenTint }}>
          <Icon size={18} color={COLORS.green} />
        </div>
        <h1 className="text-xl" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
          {module.label}
        </h1>
      </div>
      <p className="text-xs mb-8 ml-12" style={{ color: COLORS.muted }}>
        Vista previa — datos de ejemplo
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {module.metrics.map((m) => (
          <div key={m.label} className="rounded-lg p-4" style={{ backgroundColor: COLORS.greenTint }}>
            <p className="text-xs mb-1" style={{ color: COLORS.muted }}>
              {m.label}
            </p>
            <p className="text-2xl" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: COLORS.greenTint }}>
              {module.columns.map((c) => (
                <th key={c} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: COLORS.muted, fontWeight: 600 }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {module.rows.map((row, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3" style={{ color: COLORS.charcoal }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
      {currentModule ? <ModuleView module={currentModule} /> : <Welcome user={user} />}
    </div>
  );
}