import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground text-card py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/images/683656743_18110379232681451_7397324887801731439_n.jpeg" 
              alt="SCAVA Logo Alt" 
              className="h-12 w-auto mb-6 opacity-90"
            />
            <p className="text-muted/80 max-w-sm mb-8 text-lg font-light">
              More than coffee. More than a court. Energy finds stillness.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/scavacafe" target="_blank" rel="noreferrer" className="text-card hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase">
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted mb-6">Location</h4>
            <address className="not-italic text-sm text-card/80 leading-relaxed font-light">
              Scava Café<br />
              26-12-1077-2, RTO Office Rd<br />
              Rajula Complex, Bank Colony<br />
              Nellore, Andhra Pradesh 524004
            </address>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted mb-6">Hours</h4>
            <div className="text-sm text-card/80 space-y-2 font-light">
              <p className="flex justify-between">
                <span>Mon - Fri</span>
                <span>7:00 AM - 10:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sat - Sun</span>
                <span>6:00 AM - 11:00 PM</span>
              </p>
            </div>
            <div className="mt-8">
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors border-b border-primary/30 pb-1">
                Private Events & Inquiries
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-card/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted/50 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} SCAVA. EST 2026.</p>
          <div className="flex gap-6">
            <Link href="/menu" className="hover:text-card transition-colors">Menu</Link>
            <Link href="/court" className="hover:text-card transition-colors">Court</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
