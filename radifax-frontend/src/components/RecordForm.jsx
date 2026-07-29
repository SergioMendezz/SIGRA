import { useState } from "react";

const COLORS = {
    green: "#5EB453",
    greenDark: "#4CA23D",
    greenTint: "#EAF6E8",
    white: "#FFFFFF",
    charcoal: "#323232",
    muted: "#6E6E6E",
    border: "#E3E3E3",
};

function inputClass() {
    return "w-full px-3.5 py-2.5 rounded-lg text-sm bg-white outline-none";
}

export default function RecordForm({ fields, initialValues = {}, onSubmit, onCancel, submitLabel = "Guardar" }) {
    const [values, setValues] = useState(() => {
        const base = {};
        fields.forEach((f) => {
            base[f.key] = initialValues[f.key] ?? "";
        });
        return base;
    });

    function update(key, val) {
        setValues((v) => ({ ...v, [key]: val }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {fields.map((f) => (
                    <label key={f.key} className={f.type === "textarea" ? "sm:col-span-2 block" : "block"}>
                        <span className="block text-xs mb-1.5" style={{ color: COLORS.charcoal }}>
                            {f.label}
                            {f.required && <span style={{ color: "#C0392B" }}> *</span>}
                        </span>
                        {f.type === "select" ? (
                            <select
                                value={values[f.key]}
                                onChange={(e) => update(f.key, e.target.value)}
                                required={f.required}
                                className={inputClass()}
                                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                            >
                                <option value="" disabled>
                                    Seleccionar...
                                </option>
                                {f.options.map((o) => (
                                    <option key={o} value={o}>
                                        {o}
                                    </option>
                                ))}
                            </select>
                        ) : f.type === "textarea" ? (
                            <textarea
                                value={values[f.key]}
                                onChange={(e) => update(f.key, e.target.value)}
                                required={f.required}
                                rows={3}
                                className={inputClass()}
                                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                            />
                        ) : (
                            <input
                                type={f.type || "text"}
                                value={values[f.key]}
                                onChange={(e) => update(f.key, e.target.value)}
                                required={f.required}
                                className={inputClass()}
                                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.charcoal }}
                            />
                        )}
                    </label>
                ))}
            </div>

            <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-lg text-sm" style={{ color: COLORS.muted }}>
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: COLORS.green, color: COLORS.white, border: "none" }}
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}