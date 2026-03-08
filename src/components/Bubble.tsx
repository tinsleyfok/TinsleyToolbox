import { useState } from "react";

interface BubbleProps {
  emoji: string;
  label: string;
  onToggle?: (selected: boolean) => void;
}

export function Bubble({ emoji, label, onToggle }: BubbleProps) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`bubble ${selected ? "bubble-selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        const next = !selected;
        setSelected(next);
        onToggle?.(next);
      }}
    >
      <span className="flex flex-col items-center gap-[0.2em]">
        <span className="text-[1.75rem] leading-none select-none">{emoji}</span>
        <span
          className="bubble-text text-[13px] font-normal font-rethink select-none text-center leading-[1.3] transition-colors"
          dangerouslySetInnerHTML={{ __html: label }}
        />
      </span>
    </div>
  );
}
