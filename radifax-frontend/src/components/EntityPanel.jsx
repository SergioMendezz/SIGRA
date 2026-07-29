import { useState } from "react";
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

export default function EntityPanel({ idPrefix, entityLabel, columns, fields, seed, searchPlaceholder }) {
    const [rows, setRows] = useState(seed);
    const [selected, setSelected] = useState(null);
    const [formMode, setFormMode] = useState(null);

    function handleCreate(values) {
        const newRow = { ...values };
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

            <DetailPanel
                open={!!selected && formMode !== "edit"}
                record={selected}
                fields={fields}
                idLabel={columns[0]?.label}
                onClose={() => setSelected(null)}
                onEdit={() => setFormMode("edit")}
            />

            <Modal open={formMode === "create"} onClose={() => setFormMode(null)} title={`Nuevo registro — ${entityLabel}`} subtitle="Los datos ingresados solo se guardan en esta sesión.">
                <RecordForm fields={fields} onSubmit={handleCreate} onCancel={() => setFormMode(null)} submitLabel="Crear" />
            </Modal>

            <Modal open={formMode === "edit"} onClose={() => setFormMode(null)} title={`Editar — ${selected?.id ?? ""}`} subtitle="Los cambios solo se guardan en esta sesión.">
                {selected && <RecordForm fields={fields} initialValues={selected} onSubmit={handleEdit} onCancel={() => setFormMode(null)} submitLabel="Guardar cambios" />}
            </Modal>
        </div>
    );
}