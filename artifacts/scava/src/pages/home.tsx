import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/attached_assets/697104088_18113622721681451_8866964268758494484_n_1782019857032.webp"
            alt="SCAVA Brew & Play"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center flex flex-col items-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-foreground tracking-tighter leading-none mb-6">
              ENERGY<br/><span className="text-primary">FINDS</span><br/>STILLNESS
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-foreground/80 font-light max-w-2xl mt-4 tracking-wide"
          >
            More than coffee. More than a court.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/court" className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300">
              Book a Court
            </Link>
            <Link href="/menu" className="bg-transparent border border-foreground text-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300">
              Explore Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dual Entry Points */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group cursor-pointer"
            >
              <Link href="/court" className="block relative aspect-[4/5] overflow-hidden mb-6 bg-muted">
                <img 
                  src="/attached_assets/701681409_18114005704681451_1845685546638975569_n_1782019857033.webp" 
                  alt="Pickleball Action"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
              </Link>
              <h3 className="text-3xl font-display font-bold uppercase mb-2">The Court</h3>
              <p className="text-foreground/70 font-light mb-4">High energy. Precision. Community. Book your session on Nellore's premium pickleball surface.</p>
              <span className="text-primary font-bold tracking-widest uppercase text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                Reserve <span className="text-lg">→</span>
              </span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group cursor-pointer mt-16 md:mt-0"
            >
              <Link href="/menu" className="block relative aspect-[4/5] overflow-hidden mb-6 bg-muted">
                <img 
                  src="/attached_assets/696911460_18113623228681451_6374299818862206657_n_1782019857032.webp" 
                  alt="Coffee Pour"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
              </Link>
              <h3 className="text-3xl font-display font-bold uppercase mb-2">The Brew</h3>
              <p className="text-foreground/70 font-light mb-4">Slow rituals. Precision pouring. Experience our signature roasts and crafted bites.</p>
              <span className="text-primary font-bold tracking-widest uppercase text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                View Menu <span className="text-lg">→</span>
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-8">Est. 2026</h2>
            <p className="text-3xl md:text-5xl font-display leading-tight mb-12">
              We built SCAVA for those who live with purpose. A Scandinavian-inspired pause button in the heart of Nellore.
            </p>
            <img 
              src="/attached_assets/705137631_18114490417681451_1703738698746805045_n_1782019857034.webp"
              alt="Energy finds stillness"
              className="w-full max-w-2xl mx-auto opacity-80 mix-blend-lighten"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-4 md:py-8 bg-background overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8">
          <img src="/attached_assets/707826874_18115258984681451_4359587910290484933_n_1782019857035.webp" className="aspect-square object-cover w-full bg-muted" alt="Brewcycle" />
          <img src="/attached_assets/724767809_18118349683681451_8599785582232317447_n_1782019857036.webp" className="aspect-square object-cover w-full bg-muted" alt="SCAVA Character" />
          <img src="/attached_assets/704546859_18114433660681451_23922467555766077_n_1782019857033.webp" className="aspect-square object-cover w-full bg-muted" alt="Coffee OClock" />
          <img src="/attached_assets/707397977_18115302730681451_7256662145388895970_n_1782019857035.webp" className="aspect-square object-cover w-full bg-muted" alt="Collage" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
