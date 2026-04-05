            <button
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C9A96E] hover:bg-[#B8985D] text-[#0F1419] font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A96E]/20 hover:scale-[1.02]"
            >
              Start Secure Case Check
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
            <a
              href="tel:+18002273669"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/15 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-300"
            >
              <Phone size={16} />
              Call Now
            </a>
          </div>

          <p className="text-white/25 text-sm">
            Secure. Private. Takes about 2 minutes.
          </p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 11: FOOTER                                                           */}
      {/* ============================================================================ */}
      <footer className="bg-[#0A0E14] border-t border-white/[0.04] py-14">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="mb-4">
                <span className="text-white font-bold text-sm tracking-widest">CASEPORT</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                CasePort helps injured people take the next step after an accident.
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">Company</p>
              <div className="space-y-2.5">
                {["For Law Firms", "Insights", "Contact"].map((link) => (
                  <a key={link} href="#" className="block text-white/35 text-sm hover:text-[#C9A96E] transition-colors duration-300">{link}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">Legal</p>
              <div className="space-y-2.5">
                {["Privacy Policy", "Terms", "Disclaimer"].map((link) => (
                  <a key={link} href="#" className="block text-white/35 text-sm hover:text-[#C9A96E] transition-colors duration-300">{link}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-8">
            <p className="text-white/20 text-xs leading-relaxed max-w-3xl">
              CasePort is not a law firm and does not provide legal advice. Independent attorneys are responsible for their own services. Submitting information does not create an attorney-client relationship.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================================ */}
      {/* STICKY MOBILE CTA BAR — appears after hero scroll on mobile                   */}
      {/* ============================================================================ */}
      {showMobileCtaBar && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0F1419] border-t border-white/10 p-4 animate-slideUpFromBottom z-40">
          <div className="flex gap-3">
            <button
              onClick={openForm}
              className="flex-1 bg-[#C9A96E] text-[#0F1419] font-semibold py-3 px-4 rounded-lg hover:bg-[#D4B896] transition-colors duration-300 text-sm"
            >
              Start Case Check
            </button>
            <a
              href="tel:1-800-CASE-NOW"
              className="flex-1 bg-white/10 text-white font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={16} /> Call Now
            </a>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* FORM MODAL                                                                   */}
      {/* ============================================================================ */}
      <SecureCaseCheckForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
