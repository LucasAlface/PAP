function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function formatValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function getMaxValue(items, key) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const maxValue = items.reduce((max, item) => {
    const value = Number(item?.[key]);
    return Number.isFinite(value) && value > max ? value : max;
  }, 0);

  return Math.ceil(maxValue);
}

export function getNextMaxLimit(currentLimit, items, key) {
  return Math.max(currentLimit, getMaxValue(items, key));
}

export default function RangeSliderFilter({
  label,
  minValue,
  maxValue,
  maxLimit,
  onMinChange,
  onMaxChange,
}) {
  const resolvedMax = Math.max(0, toNumber(maxLimit));
  const step = resolvedMax > 20 ? 1 : 0.1;
  const currentMin = Math.min(
    toNumber(minValue, 0),
    maxValue === "" ? resolvedMax : toNumber(maxValue, resolvedMax)
  );
  const currentMax = Math.max(
    maxValue === "" ? resolvedMax : toNumber(maxValue, resolvedMax),
    currentMin
  );
  const minPercent = resolvedMax ? (currentMin / resolvedMax) * 100 : 0;
  const maxPercent = resolvedMax ? (currentMax / resolvedMax) * 100 : 100;

  const handleMinChange = (event) => {
    const nextValue = Math.min(toNumber(event.target.value), currentMax);
    onMinChange(String(nextValue));
  };

  const handleMaxChange = (event) => {
    const nextValue = Math.max(toNumber(event.target.value), currentMin);
    onMaxChange(String(nextValue));
  };

  return (
    <div className="range-slider-filter">
      <label>{label}</label>
      <div className="range-slider-values">
        <span>{formatValue(currentMin)}</span>
        <span>{formatValue(currentMax)}</span>
      </div>
      <div
        className="range-slider-track"
        style={{
          "--range-start": `${minPercent}%`,
          "--range-end": `${maxPercent}%`,
        }}
      >
        <input
          type="range"
          min="0"
          max={resolvedMax}
          step={step}
          value={currentMin}
          onChange={handleMinChange}
          aria-label={`${label} mínimo`}
        />
        <input
          type="range"
          min="0"
          max={resolvedMax}
          step={step}
          value={currentMax}
          onChange={handleMaxChange}
          aria-label={`${label} máximo`}
        />
      </div>
      <div className="range-slider-limits">
        <span>0</span>
        <span>{formatValue(resolvedMax)}</span>
      </div>
    </div>
  );
}
