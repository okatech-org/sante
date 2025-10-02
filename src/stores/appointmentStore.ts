import { create } from 'zustand';
import { Provider } from '@/lib/providers-data';

export type ConsultationType = 'cabinet' | 'telemedicine' | null;
export type PaymentMethod = 'mobile-money' | 'card' | 'on-site' | null;

export interface AppointmentState {
  // Provider info
  provider: Provider | null;
  
  // Step 1: Consultation type
  consultationType: ConsultationType;
  
  // Step 2: Date & time
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  
  // Step 3: Reason & info
  reason: string;
  isFirstVisit: boolean | null;
  documents: string[];
  additionalInfo: string;
  
  // Step 4: Payment
  paymentMethod: PaymentMethod;
  mobileMoneyNumber: string;
  mobileMoneyOperator: 'airtel' | 'moov' | null;
  acceptedTerms: boolean;
  
  // Pricing
  consultationPrice: number;
  conventionedPrice: number;
  cnamgsCoverage: number;
  gap: number;
  totalToPay: number;
  
  // Actions
  setProvider: (provider: Provider) => void;
  setConsultationType: (type: ConsultationType) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTimeSlot: (slot: string | null) => void;
  setReason: (reason: string) => void;
  setIsFirstVisit: (isFirst: boolean | null) => void;
  toggleDocument: (doc: string) => void;
  setAdditionalInfo: (info: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setMobileMoneyNumber: (number: string) => void;
  setMobileMoneyOperator: (operator: 'airtel' | 'moov' | null) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  calculatePricing: () => void;
  resetAppointment: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  provider: null,
  consultationType: null,
  selectedDate: null,
  selectedTimeSlot: null,
  reason: '',
  isFirstVisit: null,
  documents: [],
  additionalInfo: '',
  paymentMethod: null,
  mobileMoneyNumber: '',
  mobileMoneyOperator: null,
  acceptedTerms: false,
  consultationPrice: 0,
  conventionedPrice: 0,
  cnamgsCoverage: 0,
  gap: 0,
  totalToPay: 0,

  setProvider: (provider) => {
    set({ provider });
    get().calculatePricing();
  },

  setConsultationType: (type) => set({ consultationType: type }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setReason: (reason) => set({ reason }),
  setIsFirstVisit: (isFirst) => set({ isFirstVisit: isFirst }),
  
  toggleDocument: (doc) => {
    const { documents } = get();
    if (documents.includes(doc)) {
      set({ documents: documents.filter(d => d !== doc) });
    } else {
      set({ documents: [...documents, doc] });
    }
  },
  
  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setMobileMoneyNumber: (number) => set({ mobileMoneyNumber: number }),
  setMobileMoneyOperator: (operator) => set({ mobileMoneyOperator: operator }),
  setAcceptedTerms: (accepted) => set({ acceptedTerms: accepted }),

  calculatePricing: () => {
    const { provider } = get();
    if (!provider || !provider.consultationPrice) return;

    const consultationPrice = provider.consultationPrice;
    const conventionedPrice = provider.cnamgsPrice || consultationPrice;
    const cnamgsCoverage = Math.round(conventionedPrice * 0.8); // 80%
    const ticketModerateur = conventionedPrice - cnamgsCoverage;
    const gap = consultationPrice - conventionedPrice;
    const totalToPay = ticketModerateur + gap;

    set({
      consultationPrice,
      conventionedPrice,
      cnamgsCoverage,
      gap,
      totalToPay
    });
  },

  resetAppointment: () => set({
    provider: null,
    consultationType: null,
    selectedDate: null,
    selectedTimeSlot: null,
    reason: '',
    isFirstVisit: null,
    documents: [],
    additionalInfo: '',
    paymentMethod: null,
    mobileMoneyNumber: '',
    mobileMoneyOperator: null,
    acceptedTerms: false,
    consultationPrice: 0,
    conventionedPrice: 0,
    cnamgsCoverage: 0,
    gap: 0,
    totalToPay: 0
  })
}));
