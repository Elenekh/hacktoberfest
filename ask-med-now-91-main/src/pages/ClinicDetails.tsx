import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Star, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

const ClinicDetails = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  // Mock clinic data - replace with API call to your Python backend
  const clinic = {
    id: clinicId,
    name: "City Medical Center",
    address: "123 Healthcare Ave, Medical District",
    phone: "(555) 123-4567",
    rating: 4.8,
  };

  // Mock doctors data - replace with API call to your Python backend
  const doctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 143,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
    },
    {
      id: "3",
      name: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      rating: 4.7,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Clinic Header */}
        <Card className="mb-8 bg-gradient-card p-8 shadow-elevated">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-hero shadow-card">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold text-card-foreground">{clinic.name}</h1>
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-semibold text-card-foreground">{clinic.rating}</span>
                  <span className="text-muted-foreground">clinic rating</span>
                </div>
              </div>
              <p className="text-muted-foreground">Phone: {clinic.phone}</p>
            </div>
          </div>
        </Card>

        {/* Doctors Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground">Our Doctors</h2>
          <p className="text-muted-foreground">Meet our team of specialists</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden bg-gradient-card shadow-card transition-smooth hover:shadow-elevated">
              <div className="flex gap-4 p-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-card-foreground">{doctor.name}</h3>
                  <p className="mb-2 text-sm text-primary">{doctor.specialty}</p>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-sm font-semibold text-card-foreground">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <Button 
                  onClick={() => navigate(`/doctor/${doctor.id}`)} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicDetails;
