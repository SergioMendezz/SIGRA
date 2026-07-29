import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "./StatusBadge";

const COLORS = {
    green: "#5EB453",
    greenTint: "#EAF6E8",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

export default function DataTable({ columns, rows, onRowClick, searchPlaceholder = "Buscar..." }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return rows;
        const q = query.trim().toLowerCase();
        return rows.filter((row) => Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q)));
    }, [rows, query]);

    return (
        <div>
            <div className="relative mb-4 max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={COLORS.muted} />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                />
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: COLORS.greenTint }}>
                            {columns.map((c) => (
                                <th key={c.key} className="text-left px-4 py-3 text-xs uppercase tracking-wide" style={{ color: COLORS.muted, fontWeight: 600 }}>
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm" style={{ color: COLORS.muted }}>
                                    No hay registros que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                        {filtered.map((row, i) => (
                            <tr
                                key={row.id ?? i}
                                onClick={() => onRowClick?.(row)}
                                className="cursor-pointer"
                                style={{ borderTop: `1px solid ${COLORS.border}` }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                {columns.map((c) => (
                                    <td key={c.key} className="px-4 py-3" style={{ color: COLORS.charcoal }}>
                                        {c.key === "estado" ? <StatusBadge value={row[c.key]} /> : row[c.key] || "—"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs mt-2" style={{ color: COLORS.muted }}>
                {filtered.length} de {rows.length} registros
            </p>
        </div>
    );
}