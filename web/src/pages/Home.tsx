import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { Gift, Share2, CheckCircle, Sparkles, Smartphone, Heart, ShoppingBag, Users, Star } from 'lucide-react'

export function Home() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'he'

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-md z-[1000] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-[var(--color-primary)] no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline">{t('app.name')}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[15px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">
              {t('home.nav.howItWorks')}
            </a>
            <a href="#how-it-works" className="text-[15px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">
              {t('home.nav.features')}
            </a>
            <a href="#testimonials" className="text-[15px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors no-underline">
              {t('home.nav.testimonials')}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/signin">
              <Button variant="ghost" size="sm">
                {t('auth.signIn')}
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="primary" size="sm">
                {t('home.hero.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-[72px] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[var(--color-pink)]/20 to-[var(--color-cream)]" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-pink)]/30 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <div className="max-w-xl text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-full text-sm font-semibold text-[var(--color-accent)] mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{t('home.hero.badge')}</span>
              </div>

              <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-extrabold text-[var(--color-text-primary)] leading-[1.1] mb-6">
                {t('home.hero.titleLine1')}
                <br />
                <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
                  {t('home.hero.titleLine2')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <Link to="/auth/signup">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 transition-shadow">
                    {t('home.hero.cta')}
                    <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Button>
                </Link>
                <Link to="/auth/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('home.hero.secondaryCta')}
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 lg:gap-12 justify-center lg:justify-start">
                <div className="text-center lg:text-start">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">15K+</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{t('home.hero.stats.gifts')}</div>
                </div>
                <div className="text-center lg:text-start">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">98%</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{t('home.hero.stats.satisfaction')}</div>
                </div>
                <div className="text-center lg:text-start">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">₪2M+</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{t('home.hero.stats.collected')}</div>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Floating Cards */}
              <div className="hidden lg:block absolute top-[5%] -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-[var(--color-primary)]/10 animate-[float_6s_ease-in-out_infinite] z-20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/70 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{t('home.hero.floatingCard1.title')}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('home.hero.floatingCard1.subtitle')}</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute bottom-[15%] -left-8 bg-white rounded-2xl p-4 shadow-xl shadow-[var(--color-primary)]/10 animate-[float_6s_ease-in-out_infinite] z-20" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-pink-dark)] rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-text-primary)]">{t('home.hero.floatingCard2.title')}</h4>
                    <p className="text-xs text-[var(--color-text-muted)]">{t('home.hero.floatingCard2.subtitle')}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="w-[300px] md:w-[340px] h-[600px] md:h-[680px] bg-[var(--color-primary)] rounded-[50px] p-3 shadow-2xl shadow-[var(--color-primary)]/30 relative">
                <div className="w-full h-full bg-white rounded-[42px] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-8 bg-[var(--color-primary)] rounded-b-3xl z-10" />

                  {/* App Content */}
                  <div className="pt-12 px-5 h-full bg-gradient-to-b from-[var(--color-cream)] to-white">
                    {/* App Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-pink-dark)]/30 flex items-center justify-center text-2xl">
                        👶
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-[var(--color-text-primary)]">{t('home.phone.greeting')} 💜</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{t('home.phone.subGreeting')}</div>
                      </div>
                    </div>

                    {/* Progress Card */}
                    <div className="p-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-pink-dark)] rounded-3xl mb-5 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm opacity-90">{t('home.phone.weekTitle')}</span>
                        <span className="text-sm font-semibold">72 {t('home.phone.daysLeft')}</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-[73%] bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-[var(--color-primary)]">32</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{t('home.phone.items')}</div>
                      </div>
                      <div className="bg-[var(--color-accent)] rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-[11px] text-white/80">{t('home.phone.purchased')}</div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-xl font-bold text-[var(--color-primary)]">₪8.4K</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{t('home.phone.remaining')}</div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">{t('home.phone.myItems')}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <div className="aspect-square bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-pink)]/20 flex items-center justify-center text-4xl relative">
                          🛏️
                          <span className="absolute top-2 right-2 px-2 py-1 bg-[var(--color-accent)] text-white text-[9px] font-bold rounded-md">{t('home.phone.available')}</span>
                        </div>
                        <div className="p-3">
                          <div className="text-xs font-medium text-[var(--color-text-primary)] mb-1">{t('home.phone.product1')}</div>
                          <div className="text-sm font-bold text-[var(--color-primary)]">₪1,500</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <div className="aspect-square bg-gradient-to-br from-[var(--color-cream)] to-[var(--color-accent)]/10 flex items-center justify-center text-4xl relative">
                          🚗
                          <span className="absolute top-2 right-2 px-2 py-1 bg-[var(--color-primary)] text-white text-[9px] font-bold rounded-md flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="text-xs font-medium text-[var(--color-text-primary)] mb-1">{t('home.phone.product2')}</div>
                          <div className="text-sm font-bold text-[var(--color-primary)]">₪2,400</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-semibold rounded-full mb-4">
              <Star className="w-4 h-4" />
              {t('home.features.label')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, titleKey: 'anyStore', descKey: 'anyStoreDesc', color: 'from-[var(--color-primary)] to-[var(--color-pink-dark)]' },
              { icon: Share2, titleKey: 'sharing', descKey: 'sharingDesc', color: 'from-[var(--color-accent)] to-[#00D4B0]' },
              { icon: CheckCircle, titleKey: 'noDuplicates', descKey: 'noDuplicatesDesc', color: 'from-[var(--color-primary)] to-[var(--color-accent)]' },
              { icon: Gift, titleKey: 'surprises', descKey: 'surprisesDesc', color: 'from-[var(--color-pink-dark)] to-[var(--color-primary)]' },
              { icon: Smartphone, titleKey: 'app', descKey: 'appDesc', color: 'from-[var(--color-accent)] to-[var(--color-primary)]' },
              { icon: Heart, titleKey: 'messages', descKey: 'messagesDesc', color: 'from-[var(--color-pink-dark)] to-[var(--color-accent)]' },
            ].map((feature, index) => (
              <div key={index} className="group bg-[var(--color-cream)] rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[var(--color-primary)]/10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                  {t(`home.features.items.${feature.titleKey}`)}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {t(`home.features.items.${feature.descKey}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-[var(--color-cream)] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-semibold rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              {t('home.howItWorks.label')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center relative group">
                {step < 4 && (
                  <div className={`hidden lg:block absolute top-10 ${isRTL ? 'left-0 -translate-x-1/2 rotate-180' : 'right-0 translate-x-1/2'} w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent`} />
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform shadow-lg shadow-[var(--color-primary)]/30">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  {t(`home.howItWorks.steps.${step}.title`)}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {t(`home.howItWorks.steps.${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-pink-dark)] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
              <Users className="w-4 h-4" />
              {t('home.testimonials.label')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-white/80">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div key={testimonial} className="bg-white rounded-3xl p-8 text-[var(--color-text-primary)] hover:-translate-y-2 transition-transform">
                <div className="flex gap-1 text-[var(--color-accent)] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  "{t(`home.testimonials.items.${testimonial}.text`)}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-primary)]/20 flex items-center justify-center text-xl">
                    {testimonial === 1 ? '👩' : testimonial === 2 ? '👨' : '👩'}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-text-primary)]">
                      {t(`home.testimonials.items.${testimonial}.name`)}
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)]">
                      {t(`home.testimonials.items.${testimonial}.role`)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--color-pink)]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl mb-8 shadow-xl shadow-[var(--color-primary)]/30">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup">
              <Button variant="primary" size="lg" className="shadow-lg shadow-[var(--color-primary)]/25">
                {t('home.hero.cta')}
                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              {t('home.cta.findRegistry')}
            </Button>
          </div>
          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            {t('home.cta.note')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-text-primary)] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 text-xl font-bold text-white mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span>{t('app.name')}</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {t('home.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-base font-bold mb-5">{t('home.footer.product')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.createRegistry')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.findRegistry')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.howItWorks')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-bold mb-5">{t('home.footer.company')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.blog')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-bold mb-5">{t('home.footer.legal')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{t('home.footer.accessibility')}</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5">
            <p className="text-sm text-white/40">© 2025 {t('app.name')}. {t('home.footer.rights')}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Float Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  )
}
