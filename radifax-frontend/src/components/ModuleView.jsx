import { useState } from "react";
import EntityPanel from "./EntityPanel";
import IAChatPanel from "./IAChatPanel";

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

export default function ModuleView({ module, Icon }) {
    const hasTabs = Array.isArray(module.tabs) && module.tabs.length > 0;
    const [activeTab, setActiveTab] = useState(hasTabs ? module.tabs[0].key : null);
    const currentTab = hasTabs ? module.tabs.find((t) => t.key === activeTab) ?? module.tabs[0] : null;

    return (
        <div className="flex-1 px-10 py-10 max-w-5xl">
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

            <p className="text-xs mb-8 ml-12" style={{ color: COLORS.muted }}>
                Datos de ejemplo — presentación / prototipo, sin conexión a base de datos real.
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

            {module.id === "ia" && <IAChatPanel />}

            {hasTabs ? (
                <>
                    <TabSwitcher tabs={module.tabs} active={currentTab.key} onSelect={setActiveTab} />
                    <EntityPanel
                        key={currentTab.key}
                        idPrefix={idPrefixFor(currentTab.key)}
                        entityLabel={currentTab.label}
                        columns={currentTab.columns}
                        fields={currentTab.fields}
                        seed={currentTab.seed}
                    />
                </>
            ) : (
                <>
                    {module.id === "ia" && (
                        <h2 className="text-sm mb-4" style={{ color: COLORS.charcoal, fontWeight: 600 }}>
                            Historial de consultas
                        </h2>
                    )}
                    <EntityPanel idPrefix={idPrefixFor(module.id)} entityLabel={module.label} columns={module.columns} fields={module.fields} seed={module.seed} />
                </>
            )}
        </div>
    );
}