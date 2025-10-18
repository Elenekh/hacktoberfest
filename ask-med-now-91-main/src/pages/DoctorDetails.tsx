import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin, Calendar, Award, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";



const DoctorDetails = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [externalInfo, setExternalInfo] = React.useState<string | null>(null);
  const [externalLoading, setExternalLoading] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setExternalInfo(null);
    setExternalLoading(false);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
    fetch(`${apiUrl}/doctors/`)
      .then(res => res.json())
      .then((data) => {
        // Find doctor by id (number)
        const found = data.find((d: any) => String(d.id) === id);
        setDoctor(found || null);
        // ...existing code...
      })
      .catch((e) => setError('Failed to load doctor info'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">ექიმი არ არის ნაპოვნი</p>
        </div>
      </div>
    );
  }

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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card p-6 shadow-card">
              <div className="mb-6 flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-hero shadow-soft overflow-hidden">
                  {doctor.Image_URL ? (
                    <img src={doctor.Image_URL} alt={doctor.Name || doctor.name} className="h-24 w-24 object-cover rounded-xl" />
                  ) : (
                    <Award className="h-12 w-12 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold text-card-foreground">{doctor.Name || doctor.name}</h1>
                  <p className="mb-2 text-lg font-medium text-primary">{doctor.Speciality || doctor.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {doctor.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-card-foreground">{doctor.rating}</span>
                        <span>({doctor.reviews} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.Clinic || doctor.clinic}</span>
                    </div>
                    {doctor.Address && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">მისამართი:</span>
                        <span>{doctor.Address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-3 text-xl font-semibold text-card-foreground">შესახებ</h2>
                <p className="text-muted-foreground">მთლიანი პროფილი: {doctor.Detail_Link && (
                  <a href={doctor.Detail_Link} target="_blank" rel="noopener noreferrer" className="text-primary underline">{doctor.Detail_Link}</a>
                )}</p>
                {/* ...existing code... */}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-card p-6 shadow-card">
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => navigate(`/booking/${doctor.id}`)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Visit
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
