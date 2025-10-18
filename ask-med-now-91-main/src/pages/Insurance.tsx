import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Building2, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Insurance = () => {
  const navigate = useNavigate();
  const [selectedInsurance, setSelectedInsurance] = useState("");

  const insuranceProviders = [
    {
      id: "clinic-1",
      name: "Blue Cross Blue Shield",
      doctors: 234,
      clinics: 45,
    },
    {
      id: "clinic-2",
      name: "Aetna",
      doctors: 198,
      clinics: 38,
    },
    {
      id: "clinic-3",
      name: "United Healthcare",
      doctors: 276,
      clinics: 52,
    },
    {
      id: "clinic-4",
      name: "Cigna",
      doctors: 167,
      clinics: 31,
    },
  ];

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
          <h1 className="mb-2 text-3xl font-bold text-foreground">Insurance Coverage</h1>
          <p className="text-muted-foreground">Find doctors and clinics covered by your insurance plan</p>
        </div>

        <Card className="mb-8 bg-gradient-card p-6 shadow-card">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Select Your Insurance Provider</label>
            <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your insurance provider" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="blue-cross">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="aetna">Aetna</SelectItem>
                <SelectItem value="united">United Healthcare</SelectItem>
                <SelectItem value="cigna">Cigna</SelectItem>
                <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {insuranceProviders.map((provider) => (
            <Card 
              key={provider.id} 
              className="cursor-pointer bg-gradient-card p-6 shadow-card transition-smooth hover:shadow-elevated"
              onClick={() => navigate(`/clinic/${provider.id}`)}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-hero shadow-soft">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-card-foreground">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">In-Network Coverage</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-card-foreground">
                    <strong>{provider.doctors}</strong> doctors available
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-card-foreground">
                    <strong>{provider.clinics}</strong> partnered clinics
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-card-foreground">Full coverage for preventive care</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insurance;
