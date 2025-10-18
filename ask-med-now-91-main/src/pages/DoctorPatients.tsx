import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Users, ArrowLeft, FileText } from "lucide-react";
import { resultsService, TestResult, DoctorResponse } from "@/services/results";
import { useToast } from "@/hooks/use-toast";

const DoctorPatients = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { toast } = useToast();
  const [patients, setPatients] = useState<TestResult[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<TestResult | null>(null);
  const [response, setResponse] = useState<DoctorResponse>({
    notes: "",
    prescription: "",
    requestAppointment: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (patientId && patients.length > 0) {
      const patient = patients.find(p => p.patientId === patientId);
      if (patient) setSelectedPatient(patient);
    }
  }, [patientId, patients]);

  const loadPatients = async () => {
    try {
      const data = await resultsService.getDoctorPatients();
      setPatients(data);
    } catch (error: any) {
      toast({
        title: "Error loading patients",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedPatient) return;
    
    setIsSending(true);
    try {
      await resultsService.respondToResults(selectedPatient.id, response);
      toast({
        title: "Response sent",
        description: "Your response has been sent to the patient.",
      });
      setResponse({ notes: "", prescription: "", requestAppointment: false });
      loadPatients();
    } catch (error: any) {
      toast({
        title: "Error sending response",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate(selectedPatient ? "/doctor/patients" : "/doctor/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {selectedPatient ? "Back to Patients" : "Back to Dashboard"}
        </Button>

        {!selectedPatient ? (
          <>
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-foreground">My Patients</h1>
              <p className="text-muted-foreground">Patients who have sent you test results</p>
            </div>

            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading patients...</div>
            ) : patients.length === 0 ? (
              <Card className="border-border bg-card p-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">No patients yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {patients.map((patient) => (
                  <Card
                    key={patient.id}
                    className="cursor-pointer border-border bg-card p-6 transition-all hover:shadow-card"
                    onClick={() => {
                      setSelectedPatient(patient);
                      navigate(`/doctor/patients/${patient.patientId}`);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-card-foreground">
                          {patient.patientName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{patient.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(patient.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Test Results</h2>
              <Card className="border-border bg-card p-6">
                <h3 className="mb-2 font-semibold text-card-foreground">{selectedPatient.patientName}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{selectedPatient.fileName}</p>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    PDF preview would appear here. View full results at:
                  </p>
                  <a 
                    href={selectedPatient.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Open PDF
                  </a>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Your Response</h2>
              <Card className="border-border bg-card p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes / Diagnosis</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter your diagnosis and notes..."
                      value={response.notes}
                      onChange={(e) => setResponse(prev => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prescription">Prescription</Label>
                    <Textarea
                      id="prescription"
                      placeholder="Enter prescription details..."
                      value={response.prescription}
                      onChange={(e) => setResponse(prev => ({ ...prev, prescription: e.target.value }))}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requestAppointment"
                      checked={response.requestAppointment}
                      onChange={(e) => setResponse(prev => ({ ...prev, requestAppointment: e.target.checked }))}
                      className="h-4 w-4 rounded border-border"
                    />
                    <Label htmlFor="requestAppointment" className="cursor-pointer">
                      Ask patient to book an appointment
                    </Label>
                  </div>

                  <Button
                    onClick={handleSendResponse}
                    disabled={isSending || (!response.notes && !response.prescription)}
                    className="w-full"
                  >
                    {isSending ? "Sending..." : "Send Response"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorPatients;
