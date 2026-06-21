import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSubmitContact } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  inquiryType: z.enum(["private", "corporate", "tournament", "general"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const submitMutation = useSubmitContact();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      inquiryType: "general",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    submitMutation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Inquiry Submitted",
          description: "We'll get back to you shortly.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to submit. Please try again.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight mb-6">
                Host It<br />At SCAVA
              </h1>
              <p className="text-xl text-foreground/70 font-light mb-12">
                Tournaments. Corporate offsites. Private gatherings. 
                Bring your energy, we'll provide the space.
              </p>
              
              <div className="space-y-8 mb-12">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Location</h4>
                  <address className="not-italic text-foreground leading-relaxed">
                    Scava Café<br />
                    26-12-1077-2, RTO Office Rd<br />
                    Rajula Complex, Bank Colony<br />
                    Nellore, Andhra Pradesh 524004
                  </address>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-2">Connect</h4>
                  <p className="text-foreground">@scavacafe</p>
                </div>
              </div>

              <img 
                src="/attached_assets/719506408_18117386863681451_7638047361452930122_n_1782019857036.jpg" 
                alt="SCAVA Cafe" 
                className="w-full h-64 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border p-8 md:p-12"
            >
              <h3 className="text-2xl font-display font-bold uppercase mb-8">Send an Inquiry</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
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
                          <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus-visible:ring-0 focus-visible:border-primary px-0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Inquiry Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent focus:ring-0 focus:border-primary px-0">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none">
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="private">Private Event</SelectItem>
                            <SelectItem value="corporate">Corporate Booking</SelectItem>
                            <SelectItem value="tournament">Tournament Hosting</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold tracking-widest text-muted-foreground">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your event..." 
                            className="min-h-[120px] rounded-none border-2 bg-transparent focus-visible:ring-0 focus-visible:border-primary resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={submitMutation.isPending}
                    className="w-full rounded-none h-14 uppercase font-bold tracking-widest text-sm"
                  >
                    {submitMutation.isPending ? "Sending..." : "Submit Inquiry"}
                  </Button>
                </form>
              </Form>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
