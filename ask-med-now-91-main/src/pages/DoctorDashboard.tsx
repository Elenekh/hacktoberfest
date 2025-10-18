import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Calendar, Users } from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "My Calendar",
      description: "View all your appointments",
      icon: Calendar,
      path: "/doctor/calendar",
    },
    {
      title: "My Patients",
      description: "Manage patient records and results",
      icon: Users,
      path: "/doctor/patients",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your practice</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className="group cursor-pointer border-border bg-card p-8 transition-all hover:shadow-elevated"
                onClick={() => navigate(card.path)}
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="mb-3 text-xl font-semibold text-card-foreground">{card.title}</h2>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
