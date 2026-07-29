import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";

const COLORS = {
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

function buildAuditTrail(record) {
    const id = record.id ?? "el registro";
    return [
        { fecha: "hace 2 días", usuario: "Sistema", accion: `Se creó ${id} con estado inicial.` },
        { fecha: "hace 1 día", usuario: "María Fernanda Ceciliano", accion: `Se actualizaron los datos generales de ${id}.` },
        { fecha: "hoy", usuario: "Sistema", accion: `Estado actual: ${record.estado ?? "sin definir"}.` },
    ];
}

function AuditTrail({ record }) {
    const [open, setOpen] = useState(false);
    const entries = buildAuditTrail(record);
    return (
        <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 text-xs"
                style={{ color: COLORS.muted, fontWeight: 600 }}
            >
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Bitácora de auditoría
            </button>
            {open && (
                <ul className="mt-3 space-y-2.5">
                    {entries.map((e, i) => (
                        <li key={i} className="text-xs" style={{ color: COLORS.muted }}>
                            <span style={{ color: COLORS.charcoal, fontWeight: 600 }}>{e.fecha}</span> — {e.accion} ({e.usuario})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function DetailPanel({ open, record, fields, idLabel, onClose, onEdit }) {
    if (!record) return null;
    return (
        <Modal open={open} onClose={onClose} title={record.id ?? "Detalle"} subtitle={idLabel}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {fields.map((f) => (
                    <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                        <dt className="text-xs mb-1" style={{ color: COLORS.muted }}>
                            {f.label}
                        </dt>
                        <dd className="text-sm" style={{ color: COLORS.charcoal }}>
                            {f.key === "estado" ? <StatusBadge value={record[f.key]} /> : record[f.key] || "—"}
                        </dd>
                    </div>
                ))}
            </dl>

            <AuditTrail record={record} />

            <div className="flex justify-end gap-3 mt-7 pt-5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm" style={{ color: COLORS.muted }}>
                    Cerrar
                </button>
                <button
                    type="button"
                    onClick={onEdit}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: "#5EB453", color: "#FFFFFF", border: "none" }}
                >
                    Editar
                </button>
            </div>
        </Modal>
    );
}