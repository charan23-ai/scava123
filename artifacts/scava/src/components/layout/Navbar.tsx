import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/court", label: "The Court" },
    { href: "/menu", label: "Brew & Bite" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        scrolled ? "bg-background/95 backdrop-blur-md border-border shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* We will use a text logo or the image. The prompt provides logos. Let's use the dark on light logo for scrolled, or just an img */}
          <img 
            src="/images/683656743_18110379232681451_7397324887801731439_n.jpeg" 
            alt="SCAVA Logo" 
            className="h-8 w-auto mix-blend-multiply"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary",
                location === link.href ? "text-primary font-bold" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/court" className="bg-primary text-primary-foreground px-6 py-2 rounded-none text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
            Book Court
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg font-medium tracking-wide uppercase py-2 transition-colors",
                location === link.href ? "text-primary" : "text-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/court" 
            className="bg-primary text-primary-foreground text-center px-6 py-3 mt-2 rounded-none text-sm font-bold uppercase tracking-wider"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Court
          </Link>
        </div>
      )}
    </header>
  );
}
