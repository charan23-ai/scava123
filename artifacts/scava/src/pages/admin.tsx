import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  useHealthCheck, 
  useListBookings, 
  useGetStats, 
  useCancelBooking,
  useGetBooking,
  getListBookingsQueryKey,
  getGetStatsQueryKey,
  getGetBookingQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function BookingDetailsDialog({ bookingId, onClose }: { bookingId: number | null, onClose: () => void }) {
  const { data: booking, isLoading } = useGetBooking(bookingId!, {
    query: {
      enabled: !!bookingId,
      queryKey: getGetBookingQueryKey(bookingId!)
    }
  });

  return (
    <Dialog open={!!bookingId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-none border-border">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-widest">Booking Details</DialogTitle>
          <DialogDescription>ID: {bookingId}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
        ) : booking ? (
          <div className="space-y-4 font-light">
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Name</strong> {booking.name}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Email</strong> {booking.email}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Phone</strong> {booking.phone}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Date</strong> {format(new Date(booking.date), 'MMM d, yyyy')}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Slot</strong> {booking.timeSlot}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Players</strong> {booking.players}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Notes</strong> {booking.notes || 'None'}</div>
            <div><strong className="font-bold text-xs uppercase tracking-widest text-muted-foreground block">Status</strong> {booking.status}</div>
          </div>
        ) : (
          <p>Booking not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const { data: health } = useHealthCheck();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: bookings, isLoading: bookingsLoading } = useListBookings();
  const cancelBooking = useCancelBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Booking cancelled" });
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold uppercase tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-foreground/70 font-light flex items-center gap-2">
                System Status: 
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                  {health?.status || 'Unknown'}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Total Bookings</h3>
              {statsLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <p className="text-3xl font-mono">{stats?.totalBookings || 0}</p>}
            </div>
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Today's Bookings</h3>
              {statsLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <p className="text-3xl font-mono">{stats?.todayBookings || 0}</p>}
            </div>
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Popular Slot</h3>
              {statsLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <p className="text-xl font-mono">{stats?.popularSlot || 'N/A'}</p>}
            </div>
            <div className="bg-card border border-border p-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Avg Players</h3>
              {statsLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <p className="text-3xl font-mono">{stats?.popularPlayers || 0}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold uppercase mb-6">Recent Bookings</h2>
            
            {bookingsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
            ) : bookings?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-xs uppercase tracking-widest font-bold text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Slot</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Players</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-mono">{format(new Date(booking.date), 'MMM d, yyyy')}</td>
                        <td className="px-4 py-3 font-mono">{booking.timeSlot}</td>
                        <td className="px-4 py-3 font-medium">{booking.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{booking.email}<br/>{booking.phone}</td>
                        <td className="px-4 py-3 font-mono">{booking.players}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest ${booking.status === 'confirmed' ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedBooking(booking.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {booking.status === 'confirmed' && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancelBooking.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground italic bg-card border border-border p-8 text-center">No bookings found.</p>
            )}
          </div>
        </div>
      </main>

      <BookingDetailsDialog 
        bookingId={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />

      <Footer />
    </div>
  );
}
