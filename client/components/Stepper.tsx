const titles = ["Basics", "Details", "More", "Review"];

export default function Stepper({ step }: { step: number }) {
  return (
    <div className="mb-8 flex items-center">
      {titles.map((title, i) => {
        const n = i + 1;
        return (
          <div key={title} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= n ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > n ? "✓" : n}
              </div>
              <span className="mt-1 text-xs text-slate-500">{title}</span>
            </div>
            {n < 4 && (
              <div className={`mx-2 mb-5 h-0.5 flex-1 ${step > n ? "bg-indigo-600" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}