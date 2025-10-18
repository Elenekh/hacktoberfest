export interface MedicationPrice {
  storeName: string;
  price: number;
  distance?: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  storeUrl?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  instructions: string;
}

export const medicationsService = {
  async getMedicationPrices(medicationName: string): Promise<MedicationPrice[]> {
    // Mock data - in production, this would scrape/fetch from actual pharmacy APIs
    const mockPrices: Record<string, MedicationPrice[]> = {
      'atorvastatin': [
        { storeName: 'CVS Pharmacy', price: 12.99, distance: '0.5 miles', availability: 'in-stock' },
        { storeName: 'Walgreens', price: 15.49, distance: '0.8 miles', availability: 'in-stock' },
        { storeName: 'Walmart Pharmacy', price: 9.99, distance: '1.2 miles', availability: 'in-stock' },
        { storeName: 'Rite Aid', price: 14.25, distance: '1.5 miles', availability: 'limited' },
        { storeName: 'Costco Pharmacy', price: 8.50, distance: '2.1 miles', availability: 'in-stock' },
      ],
      'omega-3 fish oil': [
        { storeName: 'CVS Pharmacy', price: 18.99, distance: '0.5 miles', availability: 'in-stock' },
        { storeName: 'Walgreens', price: 19.99, distance: '0.8 miles', availability: 'in-stock' },
        { storeName: 'Walmart Pharmacy', price: 14.99, distance: '1.2 miles', availability: 'in-stock' },
        { storeName: 'GNC', price: 22.50, distance: '1.0 miles', availability: 'in-stock' },
        { storeName: 'Amazon Pharmacy', price: 16.99, distance: 'Online', availability: 'in-stock' },
      ],
      'cetirizine': [
        { storeName: 'CVS Pharmacy', price: 8.99, distance: '0.5 miles', availability: 'in-stock' },
        { storeName: 'Walgreens', price: 9.49, distance: '0.8 miles', availability: 'in-stock' },
        { storeName: 'Walmart Pharmacy', price: 6.99, distance: '1.2 miles', availability: 'in-stock' },
        { storeName: 'Target Pharmacy', price: 7.50, distance: '0.9 miles', availability: 'in-stock' },
        { storeName: 'Amazon Pharmacy', price: 7.99, distance: 'Online', availability: 'in-stock' },
      ],
      'fluticasone': [
        { storeName: 'CVS Pharmacy', price: 16.99, distance: '0.5 miles', availability: 'in-stock' },
        { storeName: 'Walgreens', price: 17.49, distance: '0.8 miles', availability: 'in-stock' },
        { storeName: 'Walmart Pharmacy', price: 14.99, distance: '1.2 miles', availability: 'in-stock' },
        { storeName: 'Rite Aid', price: 16.25, distance: '1.5 miles', availability: 'limited' },
        { storeName: 'Amazon Pharmacy', price: 15.99, distance: 'Online', availability: 'in-stock' },
      ],
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const medicationKey = medicationName.toLowerCase().split(' ')[0];
    return mockPrices[medicationKey] || [];
  },

  parsePrescription(prescription: string): Medication[] {
    // Simple parser for prescription text
    const medications: Medication[] = [];
    const lines = prescription.split('\n').filter(line => line.trim());
    
    let currentMed: Partial<Medication> = {};
    
    for (const line of lines) {
      if (line.includes('mg') || line.includes('tablet') || line.includes('capsule')) {
        // This is likely a medication name and dosage
        const parts = line.split('-');
        if (parts.length >= 1) {
          currentMed.name = parts[0].trim();
          currentMed.dosage = parts[0].trim();
          currentMed.instructions = parts.slice(1).join('-').trim();
          medications.push(currentMed as Medication);
          currentMed = {};
        }
      }
    }
    
    return medications;
  }
};
