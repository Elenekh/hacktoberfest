import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  address?: string;
  image?: string;
}

const Doctors = () => {
  const navigate = useNavigate();
  const [insuranceFilter, setInsuranceFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/doctors/`);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();

        // Map backend fields to Doctor interface
        const mapped: Doctor[] = data.map((d: any, idx: number) => ({
          id: d.id?.toString() || String(idx + 1),
          name: d.Name || d.name || 'Unknown',
          specialty: d.Speciality || d.specialty || 'General',
          clinic: d.Clinic || d.clinic || '',
          address: d.Address || d.address || '',
          image: d.Image_URL || d.image || '',
        }));
        setDoctors(mapped);
      } catch (err: any) {
        console.error('Failed to load doctors', err);
        setError(err.message || 'Failed to load doctors');
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">იპოვეთ თქვენი ექიმი</h1>
          <p className="text-muted-foreground">დაჯავშნეთ ვიზიტი კვალიფიცირებულ სპეციალისტებთან</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">სადაზღვეო პროვაიდერი</label>
              <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">ყველა პროვაიდერი</SelectItem>
                  <SelectItem value="blue-cross"></SelectItem>
                  <SelectItem value="aetna">Aetna</SelectItem>
                  <SelectItem value="united">United Healthcare</SelectItem>
                  <SelectItem value="cigna">Cigna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">სპეციალობა</label>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="general">General Practice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Doctors List */}
        {loading && <p className="mb-4 text-sm text-muted-foreground">ვეძებთ ექიმებს...</p>}
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="bg-gradient-card p-6 shadow-card transition-smooth hover:shadow-elevated">
              {doctor.image && (
                <div className="mb-4 flex justify-center">
                  <img src={doctor.image} alt={doctor.name} className="h-32 w-32 object-cover rounded-full border" />
                </div>
              )}
              <div className="mb-4">
                <h3 className="mb-1 text-xl font-semibold text-card-foreground">{doctor.name}</h3>
                <p className="text-sm font-medium text-primary">{doctor.specialty}</p>
              </div>
              <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.clinic}</span>
                </div>
                {doctor.address && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">მისამართი:</span>
                    <span>{doctor.address}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                დეტალების ნახვა
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
