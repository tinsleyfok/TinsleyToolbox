import { FolderItem } from "../components/FolderItem";

export function HomePage() {
  return (
    <div className="flex flex-col gap-0 pt-2 md:flex-row md:gap-15 md:p-5 md:px-6">
      <FolderItem to="/app" title="App" />
      <FolderItem to="/animation" title="Animation" variant="blue" />
      <FolderItem to="/inspiration" title="Inspiration" />
    </div>
  );
}
