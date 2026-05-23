export default function StickyHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md">
      <a href="/guides" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
          <span className="font-bold text-white text-lg">CP</span>
        </div>
        <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
      </a>
      <a
        href="tel:+18002273669"
        className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
      >
        Free Case Review
      </a>
    </div>
  );
}
