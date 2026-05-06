import { NURTURE_WORKFLOWS } from "@/lib/nurture-workflows";

export default function NurtureWorkflowsAdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black text-black">Nurture Workflow Engine</h1>
      <p className="mt-2 max-w-3xl text-black/70">
        Structured email/SMS nurture definitions for consultation follow-up, educational sequences, concern-specific nurturing, and booking reminders.
      </p>

      <div className="mt-6 space-y-4">
        {NURTURE_WORKFLOWS.map((workflow) => (
          <article key={workflow.id} className="rounded-2xl border-2 border-black bg-white p-5">
            <h2 className="text-xl font-bold text-[#E6007E]">{workflow.name}</h2>
            <p className="mt-1 text-sm text-black/70">trigger: {workflow.trigger}</p>
            <p className="mt-2 text-sm text-black/80">
              concerns: {workflow.concernTags.join(", ")} · treatments: {workflow.treatmentTags.join(", ")}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-black/80">
              {workflow.steps.map((step) => (
                <li key={`${workflow.id}-${step.templateKey}`}>
                  day {step.dayOffset} · {step.channel} · {step.templateKey} — {step.purpose}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </main>
  );
}
