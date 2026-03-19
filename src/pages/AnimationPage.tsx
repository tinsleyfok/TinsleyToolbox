import { FileItem } from "../components/FileItem";

export function AnimationPage() {
  return (
    <div className="flex flex-col gap-0 pt-2 md:flex-row md:gap-5 md:p-5 md:px-6">
      <FileItem to="/animation/onboarding" title="Onboarding: Interest Distribution" />
      <FileItem to="/animation/flip-card" title="Flip card" />
    </div>
  );
}
