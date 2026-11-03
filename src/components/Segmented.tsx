interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({
  options,
  value,
  onChange,
}: SegmentedProps) {
  return (
    <div className="segmented" role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented__option ${
            value === option.value ? 'is-active' : ''
          }`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
