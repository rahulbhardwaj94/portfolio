"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full border border-white/[0.14] px-[15px] py-[7px] text-[13.5px] text-[#e2e3e5] transition-colors hover:border-white/25 print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
