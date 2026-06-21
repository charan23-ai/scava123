import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useListMenuItems } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const [activeTab, setActiveTab] = useState<"all" | "coffee" | "bites">("all");
  const { data: menuItems, isLoading } = useListMenuItems();

  const filteredItems = menuItems?.filter(item => 
    activeTab === "all" ? true : item.category === activeTab
  ) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">
              The Brew & Bite
            </h1>
            <p className="text-xl text-foreground/70 font-light">
              Carefully sourced. Precision roasted. Served with intention.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-16 border-b border-border pb-4">
            {["all", "coffee", "bites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2 text-sm font-bold uppercase tracking-widest transition-all",
                  activeTab === tab 
                    ? "bg-foreground text-background" 
                    : "bg-transparent text-foreground hover:bg-muted"
                )}
              >
                {tab === "all" ? "Everything" : tab === "coffee" ? "Coffee Rituals" : "Bites"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-none" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {filteredItems.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className="group flex flex-col sm:flex-row gap-6 items-start"
                >
                  <div className="w-full sm:w-32 h-32 bg-muted flex-shrink-0 relative overflow-hidden">
                    {item.category === "coffee" ? (
                      <img src="/attached_assets/696911460_18113623228681451_6374299818862206657_n_1782019857032.webp" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500" alt="Coffee" />
                    ) : (
                      <img src="/attached_assets/721323014_18117765889681451_571777943826944455_n_1782019857036.webp" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-500" alt="Bite" />
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2 border-b border-border/50 pb-2">
                      <h3 className="text-xl font-display font-bold uppercase">{item.name}</h3>
                      <span className="font-mono text-primary font-bold">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-foreground/70 font-light leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex gap-2">
                      {item.tag && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-1">
                          {item.tag}
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                          Spicy
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
