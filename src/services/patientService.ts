import { supabase } from '@/integrations/supabase/client';

// Types
export interface PatientProfile {
  id: string;
  email: string;
  full_name: string;
  birth_date?: string | null;
  gender?: string | null;
  phone?: string;
  address?: string;
  city?: string | null;
  province?: string | null;
  country?: string;
  blood_group?: string | null;
  allergies?: string[];
  chronic_conditions?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  cnamgs_number?: string | null;
  cnamgs_fund?: string | null;
  insurance_status?: 'active' | 'inactive' | 'pending';
  weight_kg?: number | null;
  height_m?: number | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  type: 'consultation' | 'urgence' | 'hospitalisation' | 'chirurgie';
  date: string;
  doctor_name: string;
  establishment: string;
  diagnosis?: string;
  symptoms?: string[];
  treatment?: string;
  prescriptions?: Prescription[];
  notes?: string;
  follow_up_date?: string;
  attachments?: string[];
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_name: string;
  date: string;
  medications: Medication[];
  pharmacy?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_name: string;
  speciality: string;
  date: string;
  time: string;
  establishment: string;
  type: 'consultation' | 'controle' | 'urgence' | 'teleconsultation';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  reason?: string;
  notes?: string;
  reminder_sent?: boolean;
}

export interface LabResult {
  id: string;
  patient_id: string;
  date: string;
  laboratory: string;
  doctor_name?: string;
  type: 'blood' | 'urine' | 'radiology' | 'scanner' | 'irm' | 'other';
  tests: LabTest[];
  status: 'pending' | 'partial' | 'complete';
  pdf_url?: string;
  notes?: string;
}

export interface LabTest {
  name: string;
  value: string;
  unit?: string;
  normal_range?: string;
  status: 'normal' | 'abnormal' | 'critical';
}

// Service Patient
class PatientService {
  // ========== PROFIL ==========
  async getProfile(userId: string): Promise<PatientProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Générer le numéro CNAMGS s'il n'existe pas
      if (data && !data.cnamgs_number) {
        data.cnamgs_number = `GA${userId.substring(0, 8).toUpperCase().replace(/-/g, '')}`;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<PatientProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  // ========== DOSSIER MÉDICAL ==========
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      // Pour le moment, retourner des données mockées
      // TODO: Implémenter avec la vraie table Supabase
      const mockRecords: MedicalRecord[] = [
        {
          id: '1',
          patient_id: patientId,
          type: 'consultation',
          date: '2024-10-18',
          doctor_name: 'Dr. Marie OKEMBA',
          establishment: 'CMST SOGARA',
          diagnosis: 'Hypertension légère',
          symptoms: ['Maux de tête', 'Fatigue'],
          treatment: 'Amlodipine 5mg - 1x/jour',
          notes: 'Suivi dans 3 mois',
          follow_up_date: '2025-01-18'
        },
        {
          id: '2',
          patient_id: patientId,
          type: 'urgence',
          date: '2024-09-18',
          doctor_name: 'Dr. Paul NGUEMA',
          establishment: 'CMST SOGARA - Urgences',
          diagnosis: 'Migraine de tension',
          symptoms: ['Céphalées intenses', 'Nausées'],
          treatment: 'Paracétamol 1g, repos',
          notes: 'Stress professionnel'
        },
        {
          id: '3',
          patient_id: patientId,
          type: 'consultation',
          date: '2024-06-10',
          doctor_name: 'Dr. Marie OKEMBA',
          establishment: 'CMST SOGARA',
          diagnosis: 'Visite médicale annuelle',
          symptoms: [],
          treatment: 'RAS - Apte',
          notes: 'Bilan sanguin normal'
        },
        {
          id: '4',
          patient_id: patientId,
          type: 'consultation',
          date: '2024-03-15',
          doctor_name: 'Dr. Jean-Marc OBIANG',
          establishment: 'Cabinet Médical du Centre',
          diagnosis: 'Surmenage professionnel',
          symptoms: ['Fatigue chronique', 'Insomnie'],
          treatment: 'Repos, vitamines B12',
          notes: 'Arrêt de travail 5 jours'
        }
      ];
      
      return mockRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching medical records:', error);
      return [];
    }
  }

  // ========== RENDEZ-VOUS ==========
  async getAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_id,
          patient_name,
          appointment_date,
          appointment_time,
          status,
          appointment_type,
          reason,
          notes,
          professional_id
        `)
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Charger les infos du professionnel pour chaque rendez-vous
      const appointmentsWithDetails = await Promise.all(
        (data || []).map(async (apt) => {
          let doctorName = 'Dr. Inconnu';
          let speciality = 'Médecine Générale';
          let establishment = 'Cabinet médical';

          // Cas spécial pour Dr Démo
          if (apt.professional_id === 'dr-demo-cabinet-001') {
            doctorName = 'Dr. Jean-Pierre Démo';
            speciality = 'Médecine Générale';
            establishment = 'Cabinet Dr Démo';
          } else {
            // Récupérer les infos du professionnel depuis la base
            const { data: professional } = await supabase
              .from('professionals')
              .select('full_name, specialization, profession_type')
              .eq('id', apt.professional_id)
              .maybeSingle();

            if (professional) {
              doctorName = professional.full_name;
              speciality = professional.specialization || professional.profession_type || 'Médecine Générale';
            }
          }

          return {
            id: apt.id,
            patient_id: apt.patient_id,
            doctor_name: doctorName,
            speciality: speciality,
            date: apt.appointment_date,
            time: apt.appointment_time,
            establishment: establishment,
            type: apt.appointment_type as 'consultation' | 'controle' | 'urgence' | 'teleconsultation',
            status: apt.status as 'confirmed' | 'pending' | 'cancelled' | 'completed',
            reason: apt.reason || undefined,
            notes: apt.notes || undefined,
            reminder_sent: false
          };
        })
      );
      
      return appointmentsWithDetails;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: appointment.patient_id,
          professional_id: 'dr-demo-cabinet-001', // TODO: Utiliser le vrai ID
          appointment_date: appointment.date,
          appointment_time: appointment.time,
          appointment_type: appointment.type,
          status: appointment.status,
          reason: appointment.reason,
          notes: appointment.notes,
          patient_name: appointment.doctor_name,
          patient_phone: '',
          duration_minutes: 30
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return null;
    }
  }

  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return false;
    }
  }

  // ========== ORDONNANCES ==========
  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    try {
      const mockPrescriptions: Prescription[] = [
        {
          id: 'pres-001',
          patient_id: patientId,
          doctor_name: 'Dr. Marie OKEMBA',
          date: '2024-10-18',
          medications: [
            {
              name: 'Amlodipine',
              dosage: '5mg',
              frequency: '1 fois par jour',
              duration: '3 mois',
              instructions: 'À prendre le matin avec un verre d\'eau'
            }
          ],
          pharmacy: 'Pharmacie CMST SOGARA',
          status: 'active',
          notes: 'Traitement hypertension'
        },
        {
          id: 'pres-002',
          patient_id: patientId,
          doctor_name: 'Dr. Paul NGUEMA',
          date: '2024-09-18',
          medications: [
            {
              name: 'Paracétamol',
              dosage: '1000mg',
              frequency: '3 fois par jour si douleur',
              duration: '5 jours',
              instructions: 'Maximum 3g par jour'
            },
            {
              name: 'Ibuprofène',
              dosage: '400mg',
              frequency: '2 fois par jour',
              duration: '3 jours',
              instructions: 'Pendant les repas'
            }
          ],
          pharmacy: 'Pharmacie Centrale Port-Gentil',
          status: 'completed',
          notes: 'Traitement migraine'
        }
      ];
      
      return mockPrescriptions;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }
  }

  // ========== RÉSULTATS D'ANALYSES ==========
  async getLabResults(patientId: string): Promise<LabResult[]> {
    try {
      const mockResults: LabResult[] = [
        {
          id: 'lab-001',
          patient_id: patientId,
          date: '2024-06-10',
          laboratory: 'Laboratoire CMST SOGARA',
          doctor_name: 'Dr. Marie OKEMBA',
          type: 'blood',
          status: 'complete',
          tests: [
            {
              name: 'Hémoglobine',
              value: '13.5',
              unit: 'g/dL',
              normal_range: '12.0-16.0',
              status: 'normal'
            },
            {
              name: 'Glycémie à jeun',
              value: '0.95',
              unit: 'g/L',
              normal_range: '0.70-1.10',
              status: 'normal'
            },
            {
              name: 'Cholestérol total',
              value: '1.85',
              unit: 'g/L',
              normal_range: '<2.00',
              status: 'normal'
            },
            {
              name: 'Créatinine',
              value: '8',
              unit: 'mg/L',
              normal_range: '6-13',
              status: 'normal'
            }
          ],
          notes: 'Bilan sanguin complet - Résultats normaux'
        },
        {
          id: 'lab-002',
          patient_id: patientId,
          date: '2024-05-20',
          laboratory: 'Centre d\'Imagerie Médicale Port-Gentil',
          doctor_name: 'Dr. Sylvie MENGUE',
          type: 'radiology',
          status: 'complete',
          tests: [
            {
              name: 'Radiographie thoracique',
              value: 'Normal',
              status: 'normal'
            }
          ],
          notes: 'Pas d\'anomalie détectée'
        }
      ];
      
      return mockResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error fetching lab results:', error);
      return [];
    }
  }

  // ========== STATISTIQUES ==========
  async getPatientStats(patientId: string) {
    try {
      const [records, appointments, prescriptions, labResults] = await Promise.all([
        this.getMedicalRecords(patientId),
        this.getAppointments(patientId),
        this.getPrescriptions(patientId),
        this.getLabResults(patientId)
      ]);

      const upcomingAppointments = appointments.filter(a => 
        new Date(a.date) > new Date() && a.status === 'confirmed'
      );

      const activePrescriptions = prescriptions.filter(p => p.status === 'active');

      return {
        totalConsultations: records.length,
        upcomingAppointments: upcomingAppointments.length,
        activePrescriptions: activePrescriptions.length,
        pendingLabResults: labResults.filter(l => l.status === 'pending').length,
        lastVisit: records[0]?.date || null,
        nextAppointment: upcomingAppointments[0] || null,
        insuranceStatus: 'active' as const,
        coveragePercentage: 100
      };
    } catch (error) {
      console.error('Error fetching patient stats:', error);
      return null;
    }
  }

  // ========== NOTIFICATIONS ==========
  async getNotifications(patientId: string) {
    try {
      // Mock notifications
      return [
        {
          id: 'notif-001',
          type: 'appointment',
          title: 'Rappel de rendez-vous',
          message: 'Rendez-vous avec Dr. OKEMBA le 18/01/2025 à 10h00',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: 'notif-002',
          type: 'prescription',
          title: 'Ordonnance disponible',
          message: 'Votre ordonnance est disponible à la pharmacie',
          date: new Date().toISOString(),
          read: false
        }
      ];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
}

export const patientService = new PatientService();
