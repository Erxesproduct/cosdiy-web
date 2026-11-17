import type { Metadata } from "next";
import { LabHero } from "@/components/lab/lab-hero";
import { RoutineBuilder } from "@/components/lab/routine-builder";
import { GOALS, labProducts, routineSteps, SKIN, type GoalId } from "@/lib/lab";

export const metadata: Metadata = {
  title: "Build My Routine · Арчилгаагаа бүтээ",
  description: "Арьсны төрөл, зорилгоо сонгоод Cosdiy-ийн бүтээгдэхүүнээр цэвэрлэгээнээс нарны тос хүртэлх арчилгааны дарааллаа бүтээж, багцаар сагслаарай.",
  alternates: { canonical: "/lab/routine" },
};

export default function RoutinePage() {
  const goals = Object.fromEntries((Object.keys(GOALS) as GoalId[]).map((g) => [g, { name: GOALS[g].name, hint: GOALS[g].hint }])) as Record<GoalId, { name: string; hint: string }>;
  const used = new Set(routineSteps.flatMap((s) => s.options));
  return (
    <div>
      <LabHero eyebrow="Build My Routine" title="Арчилгаагаа" accent="бүтээ.">
        Арьсны төрөл, зорилгоо сонгоход тохирох бүтээгдэхүүнийг түрхэх дарааллаар нь санална. Алхам бүрээ солих, хасах боломжтой; нийт үнэ шууд шинэчлэгдэж, бүгдийг нэг дор сагслана.
      </LabHero>
      <div className="wrap py-12 md:py-16">
        <RoutineBuilder products={labProducts.filter((p) => used.has(p.slug))} steps={routineSteps.filter((s) => s.options.length)} goals={goals} skins={SKIN} />
      </div>
    </div>
  );
}
