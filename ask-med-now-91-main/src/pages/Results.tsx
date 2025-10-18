import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Download, Info, ArrowLeft, UserCheck, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { doctorsService, type Doctor } from "@/services/doctors";
import { resultsService } from "@/services/results";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  showDoctorSend?: boolean;
}

const Results = () => {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "I'm here to help you understand your test results. Feel free to ask any questions! I can also help you send these results to your prescribing doctor for review.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showDoctorSearch, setShowDoctorSearch] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const allDoctors = await doctorsService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (error) {
      console.error("Error loading doctors:", error);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    setTimeout(() => {
      const lowerInput = chatInput.toLowerCase();
      const shouldShowDoctorSend = 
        lowerInput.includes("send") && 
        (lowerInput.includes("doctor") || lowerInput.includes("results"));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: shouldShowDoctorSend 
          ? "I can help you send these results to your prescribing doctor for review. Would you like to select a doctor to send these results to? Note that some doctors may charge for reviewing test results."
          : "Based on your test results, everything appears to be within normal ranges. However, I recommend discussing any concerns with your doctor during your next visit.",
        showDoctorSend: shouldShowDoctorSend,
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendToDoctor = async (doctorId: string) => {
    if (!resultId) {
      toast({
        title: "Error",
        description: "No result ID found",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      await resultsService.sendResultsToDoctor(resultId, doctorId);
      toast({
        title: "Results Sent",
        description: "Your test results have been sent to the doctor for review.",
      });
      setShowDoctorSearch(false);
      
      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Great! I've sent your test results to the doctor. They will review them and get back to you with their feedback. You'll be notified once they respond.",
      };
      setChatMessages((prev) => [...prev, confirmMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send results to doctor",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="mb-2 text-3xl font-bold text-foreground">Test Results</h1>
          <p className="text-muted-foreground">View and understand your medical test results with AI-powered explanations</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">Your Test Results PDF</h2>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <div className="aspect-[8.5/11] rounded-lg border border-border bg-muted/50 p-8">
                <p className="text-center text-sm text-muted-foreground">
                  PDF preview would appear here. In a real application, this would display the actual test results document.
                </p>
              </div>
            </Card>

            <Card className="bg-gradient-card p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-card-foreground">AI Summary</h2>
              </div>
              <div className="rounded-lg border border-border bg-accent/30 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your test results from January 15, 2024 show that all measured values are within normal healthy ranges. Your cholesterol levels, blood glucose, and hemoglobin A1C are all excellent, indicating good cardiovascular health and no diabetes risk. Continue maintaining your current healthy lifestyle with balanced nutrition and regular physical activity. If you have any specific concerns, please discuss them with your healthcare provider during your next visit.
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 bg-gradient-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">Ask Questions</h3>
              
              <div className="mb-4 h-96 space-y-4 overflow-y-auto rounded-lg bg-muted/30 p-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero shadow-soft">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-card-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shadow-soft">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {message.showDoctorSend && (
                      <div className="ml-11">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDoctorSearch(!showDoctorSearch)}
                          className="gap-2"
                        >
                          <UserCheck className="h-4 w-4" />
                          Select Doctor
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {showDoctorSearch && (
                  <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search doctors by name or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {filteredDoctors.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">
                          No doctors found
                        </p>
                      ) : (
                        filteredDoctors.map((doctor) => (
                          <Card
                            key={doctor.id}
                            className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => handleSendToDoctor(doctor.id)}
                          >
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                              <p className="text-xs text-muted-foreground">{doctor.clinic}</p>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your results..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} variant="hero" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
