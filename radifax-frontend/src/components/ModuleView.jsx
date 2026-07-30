
import { useState } from "react";
import { List, Calendar as CalendarIcon } from "lucide-react";
import EntityPanel from "./EntityPanel";
import Modal from "./Modal";
import RecordForm from "./RecordForm";
import GirasCalendar from "./GirasCalendar";
import StatusBadge from "./StatusBadge";
import { REPORT_TYPES_BY_ROLE } from "../data/modules";

const COLORS = {
    green: "#5EB453",
    greenTint: "#EAF6E8",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

function idPrefixFor(id) {
    return id.toUpperCase().slice(0, 3);
}

function TabSwitcher({ tabs, active, onSelect }) {
    return (
        <div className="flex items-center gap-1 mb-6" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            {tabs.map((t) => {
                const isActive = t.key === active;
                return (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => onSelect(t.key)}
                        className="px-4 py-2.5 text-sm"
                        style={{
                            color: isActive ? COLORS.green : COLORS.muted,
                            fontWeight: isActive ? 600 : 400,
                            borderBottom: isActive ? `2px solid ${COLORS.green}` : "2px solid transparent",
                            marginBottom: "-1px",
                        }}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}


function GenerarReporteWidget({ role, onGenerate }) {
    const options = REPORT_TYPES_BY_ROLE[role] ?? [];
    const [tipo, setTipo] = useState(options[0] ?? "");
    const [periodo, setPeriodo] = useState("");
    const [formato, setFormato] = useState("PDF");

    if (options.length === 0) return null;

    function handleSubmit(e) {
        e.preventDefault();
        if (!tipo || !periodo.trim()) return;
        onGenerate({ tipo, periodo: periodo.trim(), formato });
        setPeriodo("");
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-xl p-4 mb-6 flex flex-wrap items-end gap-3" style={{ border: `1px solid ${COLORS.border}` }}>
            <label className="block">
                <span className="block text-xs mb-1.5" style={{ color: COLORS.charcoal }}>
                    Tipo de reporte
                </span>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}>
                    {options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </label>
            <label className="block">
                <span className="block text-xs mb-1.5" style={{ color: COLORS.charcoal }}>
                    Período
                </span>
                <input
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    placeholder="Ej. Agosto 2026"
                    className="px-3.5 py-2.5 rounded-lg text-sm"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                />
            </label>
            <label className="block">
                <span className="block text-xs mb-1.5" style={{ color: COLORS.charcoal }}>
                    Formato
                </span>
                <select value={formato} onChange={(e) => setFormato(e.target.value)} className="px-3.5 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}>
                    <option>PDF</option>
                    <option>Excel</option>
                </select>
            </label>
            <button type="submit" className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.green, color: "#FFFFFF", border: "none" }}>
                Generar
            </button>
            <p className="w-full text-xs mt-1" style={{ color: COLORS.muted }}>
                Solo ves los tipos de reporte disponibles para tu rol ({role}). Los reportes no se crean manualmente desde aquí, este módulo únicamente los genera.
            </p>
        </form>
    );
}

function RouteMapPreview() {
    return (
        <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${COLORS.border}` }}>
            <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-2" style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.greenTint }}>
                <p className="text-sm" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                    Vista previa de ruta (ejemplo)
                </p>
                <p className="text-xs" style={{ color: COLORS.muted }}>
                    Tiempo estimado: ~52 min · Gran Área Metropolitana
                </p>
            </div>
            <iframe
                title="Vista previa de ruta"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-84.20%2C9.86%2C-83.95%2C10.05&layer=mapnik"
                style={{ width: "100%", height: "220px", border: "none" }}
                loading="lazy"
            />
        </div>
    );
}

function TemplateDocumentModal({ plantilla, fields, onClose, onSubmit }) {
    const today = new Date().toISOString().slice(0, 10);
    const initialValues = {
        cliente: "",
        concepto: "Alquiler",
        monto: "",
        fecha: today,
        estado: "Pendiente",
    };
    return (
        <Modal
            open={!!plantilla}
            onClose={onClose}
            title={`Nuevo documento — a partir de "${plantilla?.id}"`}
            subtitle="Se creará como una nueva factura en la pestaña Facturas."
            width="max-w-2xl"
        >
            <RecordForm fields={fields} initialValues={initialValues} onSubmit={onSubmit} onCancel={onClose} submitLabel="Crear documento" />
        </Modal>
    );
}

export default function ModuleView({ module, Icon, user }) {
    const hasTabs = Array.isArray(module.tabs) && module.tabs.length > 0;

    const [tabRows, setTabRows] = useState(() => (hasTabs ? Object.fromEntries(module.tabs.map((t) => [t.key, t.seed])) : {}));
    const [singleRows, setSingleRows] = useState(() => (hasTabs ? [] : module.seed ?? []));
    const [activeTab, setActiveTab] = useState(hasTabs ? module.tabs[0].key : null);
    const [templateDraft, setTemplateDraft] = useState(null);
    const [girasView, setGirasView] = useState("lista");
    const [calendarGira, setCalendarGira] = useState(null);

    const currentTab = hasTabs ? module.tabs.find((t) => t.key === activeTab) ?? module.tabs[0] : null;

    if (module.adminOnly && user.role !== "Administrador del sistema") {
        return (
            <div className="flex-1 px-10 py-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.greenTint }}>
                        <Icon size={18} color={COLORS.green} />
                    </div>
                    <h1 className="text-xl" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                        {module.label}
                    </h1>
                </div>
                <p className="text-sm ml-12" style={{ color: COLORS.muted }}>
                    El historial y el dashboard de consultas de este módulo son visibles únicamente para el rol Administrador del sistema. Si necesitás
                    hablar con el asistente, usá el botón flotante en la esquina inferior derecha.
                </p>
            </div>
        );
    }

    const showMetrics = !module.metricsRoles || module.metricsRoles.includes(user.role);

    let displayMetrics = module.metrics;
    let ticketsFilter = null;
    if (module.id === "tickets" && user.role === "Técnico") {
        ticketsFilter = (r) => r.tecnico === user.name;
        const mine = singleRows.filter(ticketsFilter);
        const abiertas = mine.filter((r) => r.estado !== "Cerrada").length;
        const thisMonth = new Date().toISOString().slice(0, 7);
        const cerradasMes = mine.filter((r) => r.estado === "Cerrada" && (r.fechaIngreso || "").startsWith(thisMonth)).length;
        displayMetrics = [
            { label: "Mis boletas abiertas", value: String(abiertas) },
            { label: "Cerradas este mes (mías)", value: String(cerradasMes) },
            { label: "Total por estado", value: `${mine.length} asignadas` },
        ];
    }

    let reportsFilter = null;
    if (module.id === "dashboard") {
        reportsFilter = (r) => !r.rolesVisibles || r.rolesVisibles.includes(user.role);
    }

    function handleGenerateReport({ tipo, periodo, formato }) {
        const newRow = { id: `${tipo} (${periodo})`, periodo, formato, estado: "Generado", rolesVisibles: [user.role], activo: true };
        setSingleRows((rows) => [newRow, ...rows]);
    }

    function handleCreateFromTemplate(values) {
        const newRow = { ...values, id: `FA-${Math.floor(1000 + Math.random() * 9000)}`, activo: true };
        setTabRows((prev) => ({ ...prev, facturas: [newRow, ...(prev.facturas ?? [])] }));
        setTemplateDraft(null);
        setActiveTab("facturas");
    }

    const facturasFields = hasTabs ? module.tabs.find((t) => t.key === "facturas")?.fields : null;

    return (
        <div className="flex-1 px-10 py-10">
            <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.greenTint }}>
                        <Icon size={18} color={COLORS.green} />
                    </div>
                    <div>
                        <h1 className="text-xl" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                            {module.label}
                        </h1>
                        <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>
                            {module.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {showMetrics && (
                <div className="grid grid-cols-3 gap-4 mb-8 mt-6">
                    {displayMetrics.map((m) => (
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
            )}

            {module.id === "giras" && <RouteMapPreview />}

            {module.id === "giras" && (
                <div className="flex items-center gap-2 mb-4">
                    <button
                        type="button"
                        onClick={() => setGirasView("lista")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs"
                        style={{
                            border: `1px solid ${COLORS.border}`,
                            backgroundColor: girasView === "lista" ? COLORS.greenTint : "transparent",
                            color: girasView === "lista" ? COLORS.green : COLORS.muted,
                            fontWeight: girasView === "lista" ? 600 : 400,
                        }}
                    >
                        <List size={14} />
                        Lista
                    </button>
                    <button
                        type="button"
                        onClick={() => setGirasView("calendario")}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs"
                        style={{
                            border: `1px solid ${COLORS.border}`,
                            backgroundColor: girasView === "calendario" ? COLORS.greenTint : "transparent",
                            color: girasView === "calendario" ? COLORS.green : COLORS.muted,
                            fontWeight: girasView === "calendario" ? 600 : 400,
                        }}
                    >
                        <CalendarIcon size={14} />
                        Calendario
                    </button>
                </div>
            )}


            {module.id === "giras" && girasView === "calendario" ? (
                <GirasCalendar rows={singleRows} onRowsChange={setSingleRows} onSelectGira={setCalendarGira} />
            ) : hasTabs ? (
                <>
                    <TabSwitcher tabs={module.tabs} active={currentTab.key} onSelect={setActiveTab} />
                    <EntityPanel
                        key={currentTab.key}
                        idPrefix={idPrefixFor(currentTab.key)}
                        entityLabel={currentTab.label}
                        columns={currentTab.columns}
                        fields={currentTab.fields}
                        rows={tabRows[currentTab.key] ?? []}
                        onRowsChange={(updater) =>
                            setTabRows((prev) => ({
                                ...prev,
                                [currentTab.key]: typeof updater === "function" ? updater(prev[currentTab.key] ?? []) : updater,
                            }))
                        }
                        allowCreate={currentTab.key !== "plantillas"}
                        onRowClick={currentTab.key === "plantillas" ? setTemplateDraft : undefined}
                    />
                </>
            ) : (
                <EntityPanel
                    idPrefix={idPrefixFor(module.id)}
                    entityLabel={module.label}
                    columns={module.columns}
                    fields={module.fields}
                    rows={singleRows}
                    onRowsChange={setSingleRows}
                    rowFilter={ticketsFilter ?? reportsFilter ?? undefined}
                    allowCreate={module.allowCreate !== false}
                    extraContent={module.id === "dashboard" ? <GenerarReporteWidget role={user.role} onGenerate={handleGenerateReport} /> : undefined}
                />
            )}

            {templateDraft && facturasFields && (
                <TemplateDocumentModal plantilla={templateDraft} fields={facturasFields} onClose={() => setTemplateDraft(null)} onSubmit={handleCreateFromTemplate} />
            )}

            <Modal open={!!calendarGira} onClose={() => setCalendarGira(null)} title={calendarGira?.id ?? "Gira"} subtitle="Vista rápida desde el calendario">
                {calendarGira && (
                    <div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                            <div>
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Técnico asignado</dt>
                                <dd className="text-sm" style={{ color: COLORS.charcoal }}>{calendarGira.tecnico || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Fecha programada</dt>
                                <dd className="text-sm" style={{ color: COLORS.charcoal }}>{calendarGira.fecha || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Vehículo</dt>
                                <dd className="text-sm" style={{ color: COLORS.charcoal }}>{calendarGira.vehiculo || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Costo estimado</dt>
                                <dd className="text-sm" style={{ color: COLORS.charcoal }}>{calendarGira.costoEstimado || "—"}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Clientes a visitar</dt>
                                <dd className="text-sm" style={{ color: COLORS.charcoal }}>{calendarGira.clientes || "—"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>Estado</dt>
                                <dd className="text-sm"><StatusBadge value={calendarGira.estado} /></dd>
                            </div>
                        </dl>
                        <div className="flex justify-end gap-3 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                            <button type="button" onClick={() => setCalendarGira(null)} className="px-4 py-2.5 rounded-lg text-sm" style={{ color: COLORS.muted }}>
                                Cerrar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setGirasView("lista");
                                    setCalendarGira(null);
                                }}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: COLORS.green, color: "#FFFFFF", border: "none" }}
                            >
                                Ver en la lista
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
