import { useEffect, useState, useMemo } from "react";
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

  // Build unique specialties from loaded doctors (case-insensitive dedupe, preserve first-seen casing)
  const specialtyOptions = useMemo(() => {
    const map = new Map<string, string>();
    doctors.forEach(d => {
      const s = (d.specialty || "").trim();
      if (!s) return;
      const key = s.toLowerCase();
      if (!map.has(key)) map.set(key, s);
    });
    return Array.from(map.values());
  }, [doctors]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = specialtyFilter === "all" ||
      (doctor.specialty || "").toLowerCase() === specialtyFilter.toLowerCase();

    return matchesSearch && matchesSpecialty;
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
                  <SelectItem value="all">ყველა პროვაიდერები</SelectItem>
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
                  {specialtyOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Doctors List */}
        {loading && <p className="mb-4 text-sm text-muted-foreground">ვეძებთ ექიმებს...</p>}
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <div className="grid gap-[1px] md:grid-cols-2 lg:grid-cols-3 justify-center justify-items-center">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="bg-gradient-card w-[300px] h-[500px] p-3 shadow-card transition-smooth hover:shadow-elevated flex flex-col justify-between">
              {doctor.image ? (
                <div className="overflow-hidden rounded-lg h-[220px] w-full flex-shrink-0">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover object-center" />
                </div>
              ) : (
                <div className="h-[220px] w-full flex items-center justify-center bg-muted rounded-lg">
                  <span className="text-lg font-medium text-muted-foreground">{doctor.name.charAt(0)}</span>
                </div>
              )}

              <div className="mb-4 flex-grow mt-4 overflow-hidden">
                <h3 className="mb-1 text-lg font-semibold text-card-foreground">{doctor.name}</h3>
                <p className="text-sm font-medium text-primary">{doctor.specialty}</p>

                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{doctor.clinic}</span>
                  </div>
                  {doctor.address && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">მისამართი:</span>
                      <span>{doctor.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full mt-2"
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
