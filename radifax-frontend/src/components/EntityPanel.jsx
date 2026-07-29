<<<<<<< HEAD
﻿import { useState } from "react";
=======
import { useState } from "react";
>>>>>>> e97be07 (Fix de vista)
import { Plus } from "lucide-react";
import DataTable from "./DataTable";
import Modal from "./Modal";
import RecordForm from "./RecordForm";
import DetailPanel from "./DetailPanel";

const COLORS = {
    green: "#5EB453",
    white: "#FFFFFF",
    muted: "#6E6E6E",
};

<<<<<<< HEAD
export default function EntityPanel({ idPrefix, entityLabel, columns, fields, seed, searchPlaceholder }) {
    const [rows, setRows] = useState(seed);
=======
// EntityPanel ahora puede funcionar en dos modos:
// - No controlado (por defecto): recibe `seed` y maneja sus propias filas internamente.
// - Controlado: recibe `rows` + `onRowsChange` y el padre (ModuleView) decide dónde vive el estado.
//   Esto permite compartir datos entre pestañas (p. ej. Plantillas -> Facturas en Contratos)
//   y aplicar reglas por rol (p. ej. qué reportes ve cada usuario), siempre con datos locales.
export default function EntityPanel({
    idPrefix,
    entityLabel,
    columns,
    fields,
    seed,
    rows: controlledRows,
    onRowsChange,
    searchPlaceholder,
    allowCreate = true,
    onRowClick,
    extraContent,
    rowFilter,
}) {
    const isControlled = Array.isArray(controlledRows);
    const [internalRows, setInternalRows] = useState(seed ?? []);
    const rows = isControlled ? controlledRows : internalRows;
    const setRows = isControlled ? onRowsChange : setInternalRows;
    // rowFilter solo afecta qué se muestra en la tabla (p. ej. "mis boletas" o "reportes de mi rol");
    // crear/editar siguen operando sobre el arreglo completo para no perder los demás registros.
    const visibleRows = rowFilter ? rows.filter(rowFilter) : rows;

>>>>>>> e97be07 (Fix de vista)
    const [selected, setSelected] = useState(null);
    const [formMode, setFormMode] = useState(null);

    function handleCreate(values) {
<<<<<<< HEAD
        const newRow = { ...values };
=======
        const newRow = { ...values, activo: true };
>>>>>>> e97be07 (Fix de vista)
        if (!newRow.id) {
            newRow.id = `${idPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        setRows((r) => [newRow, ...r]);
        setFormMode(null);
    }

    function handleEdit(values) {
        setRows((r) => r.map((row) => (row.id === selected.id ? { ...row, ...values, id: row.id } : row)));
        setSelected((s) => (s ? { ...s, ...values, id: s.id } : s));
        setFormMode(null);
    }

<<<<<<< HEAD
    return (
        <div>
            <div className="flex items-center justify-end mb-4">
                <button
                    type="button"
                    onClick={() => setFormMode("create")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0"
                    style={{ backgroundColor: COLORS.green, color: COLORS.white, border: "none" }}
                >
                    <Plus size={16} />
                    Nuevo
                </button>
            </div>

            <DataTable columns={columns} rows={rows} onRowClick={setSelected} searchPlaceholder={searchPlaceholder ?? `Buscar en ${entityLabel.toLowerCase()}...`} />
=======
    function handleToggleActive() {
        if (!selected) return;
        const nextActive = selected.activo === false ? true : false;
        setRows((r) => r.map((row) => (row.id === selected.id ? { ...row, activo: nextActive } : row)));
        setSelected((s) => (s ? { ...s, activo: nextActive } : s));
    }

    function handleRowClick(row) {
        if (onRowClick) {
            onRowClick(row);
            return;
        }
        setSelected(row);
    }

    return (
        <div>
            {extraContent}

            <div className="flex items-center justify-end mb-4">
                {allowCreate && (
                    <button
                        type="button"
                        onClick={() => setFormMode("create")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0"
                        style={{ backgroundColor: COLORS.green, color: COLORS.white, border: "none" }}
                    >
                        <Plus size={16} />
                        Nuevo
                    </button>
                )}
            </div>

            <DataTable columns={columns} rows={visibleRows} onRowClick={handleRowClick} searchPlaceholder={searchPlaceholder ?? `Buscar en ${entityLabel.toLowerCase()}...`} />
>>>>>>> e97be07 (Fix de vista)

            <DetailPanel
                open={!!selected && formMode !== "edit"}
                record={selected}
                fields={fields}
                idLabel={columns[0]?.label}
                onClose={() => setSelected(null)}
                onEdit={() => setFormMode("edit")}
<<<<<<< HEAD
            />

            <Modal open={formMode === "create"} onClose={() => setFormMode(null)} title={`Nuevo registro — ${entityLabel}`} subtitle="Los datos ingresados solo se guardan en esta sesión.">
                <RecordForm fields={fields} onSubmit={handleCreate} onCancel={() => setFormMode(null)} submitLabel="Crear" />
            </Modal>
=======
                onToggleActive={handleToggleActive}
            />

            {allowCreate && (
                <Modal open={formMode === "create"} onClose={() => setFormMode(null)} title={`Nuevo registro — ${entityLabel}`} subtitle="Los datos ingresados solo se guardan en esta sesión.">
                    <RecordForm fields={fields} onSubmit={handleCreate} onCancel={() => setFormMode(null)} submitLabel="Crear" />
                </Modal>
            )}
>>>>>>> e97be07 (Fix de vista)

            <Modal open={formMode === "edit"} onClose={() => setFormMode(null)} title={`Editar — ${selected?.id ?? ""}`} subtitle="Los cambios solo se guardan en esta sesión.">
                {selected && <RecordForm fields={fields} initialValues={selected} onSubmit={handleEdit} onCancel={() => setFormMode(null)} submitLabel="Guardar cambios" />}
            </Modal>
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> e97be07 (Fix de vista)
