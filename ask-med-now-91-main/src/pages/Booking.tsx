import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }
    
    toast.success("Appointment booked successfully!");
    setTimeout(() => navigate("/appointments"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Back
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">დაჯავშნეთ თქვენი ვიზიტი</h1>
          <p className="text-muted-foreground">აირჩიეთ თარიღი და დრო თქვენი ვიზიტისთვის</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card p-6 shadow-card">
              <div className="mb-6">
                <Label className="mb-3 flex items-center gap-2 text-lg">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-lg border border-border bg-card"
                  />
                </div>
              </div>

              {date && (
                <div>
                  <Label className="mb-3 block text-lg">აირჩიეთ ხელმისაწვდომი დრო</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card className="sticky top-4 bg-gradient-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">ჯავშნის დეტალები</h3>
              
              <div className="mb-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">თარიღი:</span>
                  <span className="font-medium text-card-foreground">
                    {date ? date.toLocaleDateString() : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">დრო:</span>
                  <span className="font-medium text-card-foreground">
                    {selectedTime || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">კონსულტაციის თანხა:</span>
                  <span className="font-medium text-card-foreground">$150</span>
                </div>
              </div>

              <div className="mb-4 border-t border-border pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-card-foreground">ჯამი:</span>
                  <span className="text-primary">$150</span>
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full"
                onClick={handleBooking}
                disabled={!date || !selectedTime}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                გადახდა
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Your payment is secure and encrypted
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
