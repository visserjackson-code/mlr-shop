import "./VinylColorDisplay.css";

export default function VinylColorDisplay({ record, size = "lg", showDot = true }) {
  if (!record) return null;

  const display = record.colorDisplay;
  const isColored = record.isColored;

  const dotClass = `vinyl-dot vinyl-dot--${size}`;

  const Dot = ({ bg, color, title }) =>
    showDot ? (
      <span
        className={dotClass}
        title={title}
        style={{
          backgroundImage: bg ? bg : undefined,
          backgroundColor: bg ? "transparent" : (color ?? "#999"),
        }}
      />
    ) : null;

  // fallback for standard black vinyl (or missing display)
  if (!isColored || !display) {
    return (
      <span className="vinyl-pill fw-bold" style={{ backgroundColor: "rgba(255,255,255,0.45)" }}>
        Black Vinyl
      </span>
    );
  }

  const mode = (display?.mode ?? "").toLowerCase().trim();

  // ---------- SINGLE DISC ----------
  if (mode === "singledisc") {
    const d = Array.isArray(display.discs) ? display.discs[0] : null;

    return (
      <span className="vinyl-pill fw-bold">
        <Dot color={d?.hex ?? "#999"} title={d?.name ?? "Vinyl color"} />
        {d?.name ?? "Colored"} Vinyl
      </span>
    );
  }

  // ---------- MULTI DISC ----------
  if (mode === "multidisc") {
    const discs = Array.isArray(display.discs) ? display.discs : [];

    if (discs.length === 0) {
      return (
        <span className="vinyl-pill fw-bold">
          <Dot color="#999" title="Colored Vinyl" />
          Colored Vinyl
        </span>
      );
    }

    return (
      <div className="vinyl-pill-group">
        {discs.map((d, idx) => (
          <span key={idx} className="vinyl-pill fw-bold">
            <Dot color={d?.hex ?? "#999"} title={d?.name ?? `Disc ${idx + 1}`} />
            {d?.name ?? `Disc ${idx + 1}`} Vinyl
          </span>
        ))}
      </div>
    );
  }

  // ---------- BLEND / MULTICOLORED ----------
  const discs = Array.isArray(display?.discs) ? display.discs : [];
  const hexes = discs.map(d => d.hex).filter(Boolean);
// console.log("discs:", discs);
// console.log("hexes:", hexes);

  if (mode === "blend") {
    const colors = Array.isArray(display.colors)
      ? display.colors
      : Array.isArray(display.discs)
      ? display.discs
      : [];

    if (colors.length === 0) {
      return (
        <span className="vinyl-pill fw-bold">
          <Dot color="#999" title="Multi-Color Vinyl" />
          Multi-Color Vinyl
        </span>
      );
    }

    // crisp “pie slice” blend for tri-color (and beyond)
    

    const bg =
  mode === "blend" && hexes.length >= 2
    ? `conic-gradient(from 90deg, ${hexes.join(", ")})`
    : hexes.length === 1
      ? hexes[0]
      : `linear-gradient(90deg, ${hexes.join(", ")})`; // or your existing stripes

    const label =
      colors.map((c) => c?.name).filter(Boolean).join(" / ") ||
      display.label ||
      "Multi-Color";

    return (
      <span className="vinyl-pill fw-bold">
        <Dot bg={bg} title={label} />
        {label} Vinyl
      </span>
    );
  }

  // unknown mode → safe fallback
  return (
    <span className="vinyl-pill fw-bold">
      <Dot color="#999" title="Vinyl" />
      Vinyl
    </span>
  );
}
