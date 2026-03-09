import { FileItem } from "../components/FileItem";

export function InspirationPage() {
  return (
    <div className="flex flex-col gap-0 pt-2 md:flex-row md:gap-5 md:p-5 md:px-6">
      <FileItem to="/inspiration/animations" title="Animations" />
      <FileItem to="/inspiration/themes" title="Themes" />
      <FileItem to="/inspiration/avatars" title="Avatars" />
      <FileItem to="/inspiration/avatars" title="Avatars" />
    </div>
  );
}
