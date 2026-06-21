import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetAvailableSlots, useCreateBooking, getGetAvailableSlotsQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone required"),
});

export default function Court() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [players, setPlayers] = useState(2);
  
  const queryClient = useQueryClient();
  const formattedDate = format(date, "yyyy-MM-dd");
  
  const { data: slots, isLoading: slotsLoading } = useGetAvailableSlots(
    { date: formattedDate },
    { query: { enabled: !!formattedDate, queryKey: getGetAvailableSlotsQueryKey({ date: formattedDate }) } }
  );

  const createBooking = useCreateBooking();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const handleNext = () => {
    if (step === 1 && !selectedSlot) return;
    setStep(s => s + 1);
  };

  const onSubmit = (data: z.infer<typeof bookingSchema>) => {
    if (!selectedSlot) return;
    
    createBooking.mutate({
      data: {
        ...data,
        date: formattedDate,
        timeSlot: selectedSlot,
        players,
      }
    }, {
      onSuccess: () => {
        setStep(4); // Success step
        queryClient.invalidateQueries({ queryKey: getGetAvailableSlotsQueryKey({ date: formattedDate }) });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Court Hero */}
        <section className="relative h-[60vh] bg-foreground text-background overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
            <img 
              src="/images/704697063_18114619471681451_6335093727679225469_n.jpeg"
              alt="Court Diagram"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 md:px-8">
            <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tight mb-4">The Court</h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl text-background/80">
              Premium surface. Perfect lighting. Your arena awaits.
            </p>
          </div>
        </section>

        <section className="py-24 container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Info */}
            <div className="lg:col-span-4 space-y-12">
              <div>
                <h3 className="text-xl font-display font-bold uppercase mb-4">Court Details</h3>
                <ul className="space-y-4 text-foreground/70 font-light">
                  <li className="flex justify-between border-b border-border pb-2">
                    <span>Surface</span> <span className="font-medium text-foreground">Pro-Cushion Acrylic</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span>Lighting</span> <span className="font-medium text-foreground">LED Tournament Grade</span>
                  </li>
                  <li className="flex justify-between border-b border-border pb-2">
                    <span>Max Players</span> <span className="font-medium text-foreground">8 per session</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted p-8">
                <h3 className="text-lg font-display font-bold uppercase mb-2">Rules</h3>
                <p className="text-sm text-foreground/70 font-light mb-4">Non-marking shoes required. Please arrive 10 minutes early. Cancellations require 24h notice.</p>
              </div>
            </div>

            {/* Right: Booking Flow */}
            <div className="lg:col-span-8">
              <div className="bg-card border border-border p-6 md:p-12 min-h-[500px] flex flex-col">
                
                {/* Steps Header */}
                {step < 4 && (
                  <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
                    <div className="flex gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={cn(
                          "w-3 h-3 rounded-full transition-colors",
                          step === i ? "bg-primary" : step > i ? "bg-foreground" : "bg-muted-foreground/30"
                        )} />
                      ))}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Step {step} of 3
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                      <h2 className="text-3xl font-display font-bold uppercase mb-8">Select Time</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal rounded-none h-12 border-border hover:bg-muted">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(date, "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-none border-border">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || date > addDays(new Date(), 30)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Players</label>
                          <div className="flex items-center border border-border h-12">
                            <button onClick={() => setPlayers(p => Math.max(1, p - 1))} className="px-4 hover:bg-muted h-full transition-colors">-</button>
                            <div className="flex-1 text-center font-mono font-bold">{players}</div>
                            <button onClick={() => setPlayers(p => Math.min(8, p + 1))} className="px-4 hover:bg-muted h-full transition-colors">+</button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Available Slots</label>
                        {slotsLoading ? (
                          <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
                        ) : slots?.length ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {slots.map(slot => (
                              <button
                                key={slot.slot}
                                disabled={!slot.available}
                                onClick={() => setSelectedSlot(slot.slot)}
                                className={cn(
                                  "py-3 text-sm font-mono border transition-all",
                                  !slot.available ? "opacity-30 bg-muted border-transparent cursor-not-allowed" :
                                  selectedSlot === slot.slot ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"
                                )}
                              >
                                {slot.slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">No slots available for this date.</p>
                        )}
                      </div>

                      <div className="mt-auto pt-12 flex justify-end">
                        <Button 
                          onClick={handleNext} 
                          disabled={!selectedSlot}
                          className="rounded-none px-8 h-12 uppercase font-bold tracking-widest"
                        >
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                      <h2 className="text-3xl font-display font-bold uppercase mb-8">Your Details</h2>
                      
                      <Form {...form}>
                        <form id="booking-form" onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Full Name</FormLabel>
                                <FormControl>
                                  <Input className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Email</FormLabel>
                                <FormControl>
                                  <Input type="email" className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Phone</FormLabel>
                                <FormControl>
                                  <Input className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>

                      <div className="mt-auto pt-12 flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(1)} className="rounded-none uppercase font-bold tracking-widest">Back</Button>
                        <Button type="submit" form="booking-form" className="rounded-none px-8 h-12 uppercase font-bold tracking-widest">Review</Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                      <h2 className="text-3xl font-display font-bold uppercase mb-8">Confirm Booking</h2>
                      
                      <div className="bg-muted p-8 mb-8">
                        <div className="grid grid-cols-2 gap-y-6">
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Date</span>
                            <span className="font-medium">{format(date, "MMMM d, yyyy")}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Time</span>
                            <span className="font-mono font-medium">{selectedSlot}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Players</span>
                            <span className="font-medium">{players}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Name</span>
                            <span className="font-medium">{form.getValues().name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(2)} disabled={createBooking.isPending} className="rounded-none uppercase font-bold tracking-widest">Back</Button>
                        <Button 
                          onClick={form.handleSubmit(onSubmit)} 
                          disabled={createBooking.isPending}
                          className="rounded-none px-8 h-12 uppercase font-bold tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background"
                        >
                          {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center py-12">
                      <CheckCircle2 className="w-20 h-20 text-primary mb-6" />
                      <h2 className="text-4xl font-display font-bold uppercase mb-4">See You On Court</h2>
                      <p className="text-foreground/70 font-light mb-8 max-w-sm">
                        Your booking for {format(date, "MMM d")} at {selectedSlot} is confirmed. A confirmation has been sent to your email.
                      </p>
                      <Button 
                        onClick={() => {
                          setStep(1);
                          setSelectedSlot(null);
                          form.reset();
                        }}
                        variant="outline" 
                        className="rounded-none px-8 uppercase font-bold tracking-widest border-foreground"
                      >
                        Book Another
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
