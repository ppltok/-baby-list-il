import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Categories from "@/components/Categories"
import CTASection from "@/components/CTASection"
import Footer from "@/components/Footer"

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
