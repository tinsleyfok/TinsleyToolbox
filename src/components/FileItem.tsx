import { Link } from "react-router";
import { useTheme } from "../hooks/useTheme";

interface FileItemProps {
  to: string;
  title: string;
}

export function FileItem({ to, title }: FileItemProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Link
      to={to}
      className={`flex flex-row items-center gap-4 py-3.5 px-5 w-full no-underline text-inherit cursor-pointer border-b active:bg-black/4 md:flex-col md:gap-2.5 md:p-0 md:w-fit md:border-0 md:transition-transform md:duration-200 md:hover:-translate-y-0.5 ${
        isDark ? "border-[rgba(255,255,255,0.07)]" : "border-[rgba(55,53,47,0.06)]"
      }`}
    >
      <div className="file-icon w-[120px] h-[160px] mx-auto shrink-0" />
      <div className={`flex-1 text-left text-[17px] font-medium w-auto md:flex-initial md:text-sm md:font-semibold md:text-center md:w-40 md:leading-[1.8] ${
        isDark ? "text-[#ebebeb]" : "text-[#37352f]"
      }`}>
        {title}
      </div>
      <span className={`text-[22px] leading-none md:hidden ${isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"}`}>
        ›
      </span>
    </Link>
  );
}
