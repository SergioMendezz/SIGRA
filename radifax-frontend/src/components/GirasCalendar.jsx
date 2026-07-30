import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const COLORS = {
    green: "#5EB453",
    greenTint: "#EAF6E8",
    white: "#FFFFFF",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Vista de calendario mensual para Giras: las tarjetas se pueden arrastrar
// y soltar entre días para reprogramarlas. Es interacción de interfaz pura
// (drag & drop de HTML5) — no hay lógica de negocio ni validación de choques
// de agenda todavía, eso queda para el curso de implementación.
export default function GirasCalendar({ rows, onRowsChange, onSelectGira }) {
    const seedMonth = rows[0]?.fecha ? new Date(rows[0].fecha) : new Date();
    const [cursor, setCursor] = useState(new Date(seedMonth.getFullYear(), seedMonth.getMonth(), 1));
    const [dragId, setDragId] = useState(null);

    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const byDate = useMemo(() => {
        const map = {};
        rows.forEach((r) => {
            if (!r.fecha) return;
            (map[r.fecha] ??= []).push(r);
        });
        return map;
    }, [rows]);

    const cells = useMemo(() => {
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const arr = [];
        for (let i = 0; i < firstWeekday; i++) arr.push(null);
        for (let d = 1; d <= daysInMonth; d++) arr.push(d);
        return arr;
    }, [year, month]);

    function handleDrop(day) {
        if (!dragId) return;
        const newFecha = toDateKey(year, month, day);
        onRowsChange((rs) => rs.map((r) => (r.id === dragId ? { ...r, fecha: newFecha } : r)));
        setDragId(null);
    }

    return (
        <div className="rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${COLORS.border}` }}>
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.greenTint }}>
                <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-1 rounded" style={{ color: COLORS.charcoal }} aria-label="Mes anterior">
                    <ChevronLeft size={18} />
                </button>
                <p className="text-sm" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                    {MESES[month]} {year}
                </p>
                <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-1 rounded" style={{ color: COLORS.charcoal }} aria-label="Mes siguiente">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                {DIAS.map((d) => (
                    <div key={d} className="text-center text-xs py-2" style={{ color: COLORS.muted, fontWeight: 600 }}>
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                    const dateKey = day ? toDateKey(year, month, day) : null;
                    const giras = dateKey ? byDate[dateKey] ?? [] : [];
                    return (
                        <div
                            key={i}
                            onDragOver={(e) => day && e.preventDefault()}
                            onDrop={() => day && handleDrop(day)}
                            className="min-h-[92px] p-1.5"
                            style={{ borderRight: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, backgroundColor: day ? COLORS.white : "#FAFAFA" }}
                        >
                            {day && (
                                <>
                                    <p className="text-xs mb-1" style={{ color: COLORS.muted }}>
                                        {day}
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {giras.map((g) => (
                                            <div
                                                key={g.id}
                                                draggable
                                                onDragStart={() => setDragId(g.id)}
                                                onClick={() => onSelectGira?.(g)}
                                                className="px-1.5 py-1 rounded text-xs cursor-grab"
                                                style={{ backgroundColor: COLORS.greenTint, color: COLORS.charcoal, opacity: g.activo === false ? 0.5 : 1 }}
                                                title="Arrastrá para reprogramar, hacé clic para ver el detalle"
                                            >
                                                <p className="truncate" style={{ fontWeight: 600 }}>
                                                    {g.id} · {g.tecnico}
                                                </p>
                                                <div className="mt-0.5">
                                                    <StatusBadge value={g.estado} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <p className="text-xs" style={{ color: COLORS.muted }}>
                    Arrastrá una gira a otro día para reprogramarla. Hacé clic en una gira para ver el detalle.
                </p>
            </div>
        </div>
    );
}