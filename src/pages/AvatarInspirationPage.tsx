import { useMemo } from "react";
import { useTheme } from "../hooks/useTheme";
import { inspirations } from "../inspirations/registry";
import type { Inspiration } from "../inspirations/types";

const avatarItems = inspirations.filter((i) => i.group === "Avatar");

function AvatarCard({ item, isDark }: { item: Inspiration; isDark: boolean }) {
  const isProposal = item.source.startsWith("Generated");
  return (
    <div className={`rounded-2xl overflow-hidden transition-colors ${isDark ? "bg-[#2c2c2c] shadow-[0_2px_12px_rgba(0,0,0,0.3)]" : "bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]"}`}>
      <div className={`relative overflow-hidden border-b ${isDark ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(0,0,0,0.04)]"}`}>
        <img src={item.image} alt={item.title} className="w-full object-cover" style={{ aspectRatio: "16/9" }} />
        {isProposal && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[rgba(0,0,0,0.5)] text-white backdrop-blur-sm">PROPOSAL</div>
        )}
      </div>
      <div className="p-4">
        <h3 className={`text-[15px] font-semibold m-0 ${isDark ? "text-[#ebebeb]" : "text-[#37352f]"}`}>{item.title}</h3>
        <p className={`text-[13px] mt-1.5 mb-0 leading-relaxed ${isDark ? "text-[#9b9b9b]" : "text-[#787774]"}`}>{item.description}</p>
        {item.source.startsWith("http") ? (
          <a href={item.source} target="_blank" rel="noopener noreferrer" className={`block text-[11px] mt-2 mb-0 no-underline hover:underline ${isDark ? "text-[#5a5a5a] hover:text-[#9b9b9b]" : "text-[#b4b4b0] hover:text-[#787774]"}`}>
            Source ↗
          </a>
        ) : (
          <p className={`text-[11px] mt-2 mb-0 ${isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"}`}>{item.source}</p>
        )}
      </div>
    </div>
  );
}

export function AvatarInspirationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { existing, proposals } = useMemo(() => {
    const existing: Inspiration[] = [];
    const proposals: Inspiration[] = [];
    for (const item of avatarItems) {
      if (item.source.startsWith("Generated")) proposals.push(item);
      else existing.push(item);
    }
    return { existing, proposals };
  }, []);

  if (avatarItems.length === 0) {
    return (<div className="flex items-center justify-center h-64 opacity-40 text-sm">No avatar inspirations yet.</div>);
  }

  return (
    <div className="px-4 pb-8 pt-2 md:px-6">
      {existing.length > 0 && (
        <section className="mb-8">
          <h2 className={`text-[13px] font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"}`}>Existing Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existing.map((item) => (<AvatarCard key={item.id} item={item} isDark={isDark} />))}
          </div>
        </section>
      )}
      {proposals.length > 0 && (
        <section className="mb-8">
          <h2 className={`text-[13px] font-semibold uppercase tracking-wider mb-3 ${isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"}`}>Proposals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((item) => (<AvatarCard key={item.id} item={item} isDark={isDark} />))}
          </div>
        </section>
      )}
    </div>
  );
}
