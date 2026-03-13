import Link from "next/link";

const steps = [
  { number: 1, label: "Allocate your ideal budget" },
  { number: 2, label: "We analyze voting records" },
  { number: 3, label: "See your ranked politician matches" },
];

export function AlignmentTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
          Which Politicians Match Your Priorities?
        </h2>
        <p className="mt-4 text-lg text-black/60 max-w-3xl mx-auto font-medium">
          Complete the budget survey, then see how your preferences align with
          real federal politicians&apos; voting records.
        </p>
      </div>
      <div className="max-w-xl mx-auto p-8 bg-pink-100 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-500 border-2 border-black flex items-center justify-center text-white font-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {step.number}
              </div>
              <p className="text-base font-bold text-black">{step.label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-black/50 font-medium mt-6">
          Your report gets a shareable URL.
        </p>
        <div className="mt-6">
          <Link
            href="/vote"
            className="inline-block px-8 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Start Your Alignment Report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
