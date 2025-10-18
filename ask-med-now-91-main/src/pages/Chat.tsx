import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, ArrowLeft, Search, Star, MapPin, Calendar } from "lucide-react";
import { doctorsService } from "@/services/doctors";
import Navbar from "@/components/Navbar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  reviews: number;
  insurance: string[];
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    clinic: "Heart & Vascular Center",
    rating: 4.9,
    reviews: 156,
    insurance: ["Blue Cross", "Aetna", "United"],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    clinic: "Skin Care Specialists",
    rating: 4.8,
    reviews: 203,
    insurance: ["Aetna", "Cigna", "Kaiser"],
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "General Practitioner",
    clinic: "Family Health Clinic",
    rating: 4.7,
    reviews: 184,
    insurance: ["Blue Cross", "United", "Cigna"],
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    clinic: "City Medical Center",
    rating: 4.8,
    reviews: 142,
    insurance: ["Blue Cross", "United"],
  },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedDoctors?: Doctor[];
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI health assistant. Please describe your symptoms, and I'll help you identify which type of doctor you should visit.",
    },
  ]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      // Get recommended doctors based on symptoms (simulated logic)
      const recommendedSpecialties = ["Cardiologist", "Dermatologist", "General Practitioner"];
      const recommended = mockDoctors.filter(doctor => 
        recommendedSpecialties.some(specialty => 
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
        )
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Based on your symptoms, I recommend consulting with the following specialists. You can search for specific doctors below or view all available doctors:",
        recommendedDoctors: recommended.length > 0 ? recommended : mockDoctors,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setSearchQuery(""); // Reset search when new recommendations appear
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto flex flex-1 flex-col px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">AI Health Assistant</h1>
          <p className="text-muted-foreground">Describe your symptoms to get personalized doctor recommendations</p>
        </div>

        <Card className="flex flex-1 flex-col bg-gradient-card shadow-card">
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-soft">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-muted text-card-foreground"
                  }`}
                >
                  {message.content}
                  {message.recommendedDoctors && message.recommendedDoctors.length > 0 && (
                    <div className="mt-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search recommended doctors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-background"
                        />
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {message.recommendedDoctors
                          .filter(doctor => 
                            searchQuery === "" || 
                            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((doctor) => (
                            <Card key={doctor.id} className="p-4 bg-background hover:bg-accent/50 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-card-foreground">{doctor.name}</h4>
                                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{doctor.clinic}</p>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {doctor.rating} ({doctor.reviews} reviews)
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/booking/${doctor.id}`)}
                                  className="shrink-0"
                                >
                                  <Calendar className="mr-1 h-3 w-3" />
                                  Book
                                </Button>
                              </div>
                            </Card>
                          ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => navigate("/doctors")}
                        className="w-full bg-background hover:bg-accent"
                      >
                        View All Doctors
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shadow-soft">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Describe your symptoms..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} variant="hero" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
