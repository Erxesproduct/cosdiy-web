import { LabTabs } from "@/components/lab/lab-tabs";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <LabTabs />
      {children}
    </div>
  );
}
