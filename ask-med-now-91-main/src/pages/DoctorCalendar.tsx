import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Calendar, ArrowLeft } from "lucide-react";
import { bookingsService, Booking } from "@/services/bookings";
import { useToast } from "@/hooks/use-toast";

const DoctorCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await bookingsService.getDoctorBookings();
      setAppointments(data);
    } catch (error: any) {
      toast({
        title: "Error loading appointments",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/doctor/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">My Calendar</h1>
          <p className="text-muted-foreground">All your scheduled appointments</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <Card className="border-border bg-card p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No appointments scheduled yet</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="cursor-pointer border-border bg-card p-6 transition-all hover:shadow-card"
                onClick={() => navigate(`/doctor/patients/${appointment.patientId}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-card-foreground">
                      {appointment.patientName}
                    </h3>
                    <p className="mb-2 text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
                    <p className="text-sm text-muted-foreground">{appointment.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">${appointment.fee}</p>
                    <p className="text-xs text-muted-foreground capitalize">{appointment.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorCalendar;
