import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { FileText, ArrowLeft, Calendar, DollarSign, MapPin, Package } from "lucide-react";
import { resultsService, TestResult } from "@/services/results";
import { useToast } from "@/hooks/use-toast";
import { medicationsService, Medication, MedicationPrice } from "@/services/medications";

const DoctorFeedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [medicationPrices, setMedicationPrices] = useState<Record<string, Record<string, MedicationPrice[]>>>({});
  const [loadingPrices, setLoadingPrices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await resultsService.getPatientResults();
      setResults(data);
    } catch (error: any) {
      toast({
        title: "Error loading results",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMedicationPrices = async (resultId: string, prescription: string) => {
    setLoadingPrices(prev => ({ ...prev, [resultId]: true }));
    
    try {
      const medications = medicationsService.parsePrescription(prescription);
      const pricesMap: Record<string, MedicationPrice[]> = {};
      
      for (const med of medications) {
        const prices = await medicationsService.getMedicationPrices(med.name);
        pricesMap[med.name] = prices;
      }
      
      setMedicationPrices(prev => {
        const newState: Record<string, Record<string, MedicationPrice[]>> = { ...prev };
        newState[resultId] = pricesMap;
        return newState;
      });
    } catch (error: any) {
      toast({
        title: "Error loading prices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingPrices(prev => ({ ...prev, [resultId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Doctor's Feedback</h1>
          <p className="text-muted-foreground">View responses from your doctors</p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading feedback...</div>
        ) : results.filter(r => r.doctorResponse).length === 0 ? (
          <Card className="border-border bg-card p-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No doctor responses yet</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {results
              .filter(result => result.doctorResponse)
              .map((result) => (
                <Card key={result.id} className="border-border bg-card p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-card-foreground">
                        {result.fileName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Response received on {new Date(result.doctorResponse!.respondedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {result.doctorResponse?.requestAppointment && (
                      <Badge variant="default">Appointment Requested</Badge>
                    )}
                  </div>

                  {result.doctorResponse?.notes && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-card-foreground">Doctor's Notes</h4>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {result.doctorResponse.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {result.doctorResponse?.prescription && (
                    <div className="mb-4">
                      <h4 className="mb-2 font-medium text-card-foreground">Prescription</h4>
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {result.doctorResponse.prescription}
                        </p>
                      </div>
                      
                      {!medicationPrices[result.id] && (
                        <Button
                          variant="outline"
                          onClick={() => loadMedicationPrices(result.id, result.doctorResponse!.prescription)}
                          disabled={loadingPrices[result.id]}
                          className="mt-3"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          {loadingPrices[result.id] ? 'Loading prices...' : 'Find Best Prices'}
                        </Button>
                      )}

                      {medicationPrices[result.id] && (
                        <div className="mt-4 space-y-4">
                          <h5 className="font-medium text-card-foreground">Compare Prices at Local Pharmacies</h5>
                          {Object.entries(medicationPrices[result.id]).map(([medName, prices]) => (
                            <div key={medName} className="space-y-2">
                              <p className="text-sm font-medium text-card-foreground">{medName}</p>
                              <div className="grid gap-2">
                                {prices
                                  .sort((a, b) => a.price - b.price)
                                  .map((price, idx) => (
                                    <div
                                      key={idx}
                                      className={`flex items-center justify-between rounded-lg border p-3 ${
                                        idx === 0 ? 'border-primary bg-primary/5' : 'border-border'
                                      }`}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium text-card-foreground">
                                            {price.storeName}
                                          </p>
                                          {idx === 0 && (
                                            <Badge variant="default" className="text-xs">Best Price</Badge>
                                          )}
                                          <Badge
                                            variant={
                                              price.availability === 'in-stock'
                                                ? 'default'
                                                : price.availability === 'limited'
                                                ? 'secondary'
                                                : 'destructive'
                                            }
                                            className="text-xs"
                                          >
                                            <Package className="mr-1 h-3 w-3" />
                                            {price.availability === 'in-stock'
                                              ? 'In Stock'
                                              : price.availability === 'limited'
                                              ? 'Limited'
                                              : 'Out of Stock'}
                                          </Badge>
                                        </div>
                                        {price.distance && (
                                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {price.distance}
                                          </p>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-primary">
                                          ${price.price.toFixed(2)}
                                        </p>
                                        {idx > 0 && (
                                          <p className="text-xs text-muted-foreground">
                                            +${(price.price - prices[0].price).toFixed(2)}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {result.doctorResponse?.requestAppointment && (
                    <Button
                      onClick={() => navigate("/doctors")}
                      className="w-full"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book an Appointment
                    </Button>
                  )}
                </Card>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorFeedback;
