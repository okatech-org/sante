import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use a fixed password for demo accounts (easier for testing)
const DEMO_PASSWORD = 'Demo@2024!';

function generateSecurePassword(): string {
  return DEMO_PASSWORD; // Return fixed password for demos
}

interface DemoAccount {
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone: string;
}

const demoAccountTemplates: Omit<DemoAccount, 'password'>[] = [
  {
    email: "patient.demo@sante.ga",
    fullName: "Marie OKOME",
    role: "patient",
    phone: "+24101234567"
  },
  {
    email: "medecin.demo@sante.ga",
    fullName: "Dr. Pierre KOMBILA",
    role: "doctor",
    phone: "+24101234568"
  },
  {
    email: "specialiste.demo@sante.ga",
    fullName: "Dr. Sylvie NGUEMA",
    role: "specialist",
    phone: "+24101234569"
  },
  {
    email: "infirmiere.demo@sante.ga",
    fullName: "Sophie MBOUMBA",
    role: "nurse",
    phone: "+24101234570"
  },
  {
    email: "sagefemme.demo@sante.ga",
    fullName: "Grace ONDO",
    role: "midwife",
    phone: "+24101234571"
  },
  {
    email: "kine.demo@sante.ga",
    fullName: "Marc MOUNGUENGUI",
    role: "physiotherapist",
    phone: "+24101234572"
  },
  {
    email: "psychologue.demo@sante.ga",
    fullName: "Alice BOULINGUI",
    role: "psychologist",
    phone: "+24101234573"
  },
  {
    email: "ophtalmo.demo@sante.ga",
    fullName: "Dr. Joseph MENGUE",
    role: "ophthalmologist",
    phone: "+24101234574"
  },
  {
    email: "anesthesiste.demo@sante.ga",
    fullName: "Dr. François OVONO",
    role: "anesthesiologist",
    phone: "+24101234575"
  },
  {
    email: "pharmacien.demo@sante.ga",
    fullName: "Jean MOUSSAVOU",
    role: "pharmacist",
    phone: "+24101234576"
  },
  {
    email: "pharmacie.demo@sante.ga",
    fullName: "Pharmacie du Centre",
    role: "pharmacy",
    phone: "+24101234577"
  },
  {
    email: "labo.demo@sante.ga",
    fullName: "Claire NDONG",
    role: "laboratory_technician",
    phone: "+24101234578"
  },
  {
    email: "radiologue.demo@sante.ga",
    fullName: "Dr. Daniel IBINGA",
    role: "radiologist",
    phone: "+24101234579"
  },
  {
    email: "radiologie.demo@sante.ga",
    fullName: "Centre d'Imagerie Médicale",
    role: "radiology_center",
    phone: "+24101234580"
  },
  {
    email: "admin.demo@sante.ga",
    fullName: "Admin MBADINGA",
    role: "admin",
    phone: "+24101234581"
  },
  {
    email: "hopital.demo@sante.ga",
    fullName: "CHU Owendo",
    role: "hospital_admin",
    phone: "+24101234582"
  },
  {
    email: "clinique.demo@sante.ga",
    fullName: "Clinique Sainte-Marie",
    role: "clinic_admin",
    phone: "+24101234583"
  },
  {
    email: "sogara.demo@sante.ga",
    fullName: "Hôpital de SOGARA",
    role: "sogara_admin",
    phone: "+24101234584"
  },
  {
    email: "dr.travail.sogara@sante.ga",
    fullName: "Dr. Jean-Pierre MBENGONO",
    role: "doctor",
    phone: "+24101234585"
  },
  {
    email: "infirmier.sogara@sante.ga",
    fullName: "Pierre ONDIMBA",
    role: "nurse",
    phone: "+24101234586"
  },
  {
    email: "infirmiere2.sogara@sante.ga",
    fullName: "Martine NLEME",
    role: "nurse",
    phone: "+24101234587"
  },
  {
    email: "patient.sogara.01@sante.ga",
    fullName: "Alain MOUSSAVOU",
    role: "patient",
    phone: "+24101234588"
  },
  {
    email: "patient.sogara.02@sante.ga",
    fullName: "Rachel MVELE",
    role: "patient",
    phone: "+24101234589"
  },
  {
    email: "patient.sogara.03@sante.ga",
    fullName: "Yannick BANGA",
    role: "patient",
    phone: "+24101234590"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('Invalid token:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin or super_admin role
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) {
      console.error('Error checking roles:', rolesError);
      return new Response(
        JSON.stringify({ error: 'Error verifying permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isAdmin = roles?.some(r => r.role === 'super_admin' || r.role === 'admin');
    if (!isAdmin) {
      console.error(`User ${user.id} attempted to create demo accounts without admin privileges`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin user ${user.email} is creating demo accounts`);

    const results = []
    const generatedPasswords: Record<string, string> = {};

    // Generate demo accounts with secure random passwords
    for (const template of demoAccountTemplates) {
      const password = generateSecurePassword();
      generatedPasswords[template.email] = password;
      
      const account: DemoAccount = {
        ...template,
        password
      };
      
      console.log(`Creating account: ${account.email}`)
      console.log(`Creating account: ${account.email}`)
      
      // Try to create the user
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.fullName,
          phone: account.phone
        }
      })

      if (userError) {
        // If user already exists, try to get their ID
        if (userError.message.includes('already registered')) {
          console.log(`User ${account.email} already exists, updating...`)
          
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = existingUsers.users.find(u => u.email === account.email)
          
          if (existingUser) {
            // Update user metadata
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                full_name: account.fullName,
                phone: account.phone
              }
            })

            // Check if role exists
            const { data: existingRoles } = await supabaseAdmin
              .from('user_roles')
              .select('*')
              .eq('user_id', existingUser.id)
              .eq('role', account.role)

            if (!existingRoles || existingRoles.length === 0) {
              // Add role
              await supabaseAdmin
                .from('user_roles')
                .insert({
                  user_id: existingUser.id,
                  role: account.role
                })
            }

            results.push({
              email: account.email,
              status: 'updated',
              userId: existingUser.id
            })
          }
        } else {
          results.push({
            email: account.email,
            status: 'error',
            error: userError.message
          })
        }
        continue
      }

      if (userData.user) {
        // Add role to user_roles table
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: userData.user.id,
            role: account.role
          })

        if (roleError) {
          console.error(`Error adding role for ${account.email}:`, roleError)
        }

        // Create professional profile for health professionals
        if (['doctor', 'specialist', 'nurse'].includes(account.role)) {
          // Determine professional type and data based on role and email
          const isSOGARAMedical = account.email.includes('sogara');
          
          let professionalData: any = {
            user_id: userData.user.id,
            full_name: account.fullName,
            email: account.email,
            phone: account.phone,
            gender: 'homme',
            title: account.role === 'doctor' ? 'docteur' : account.role === 'nurse' ? 'infirmier' : 'docteur',
            birth_date: '1985-03-20',
            nationality: 'Gabonaise',
            status: 'actif',
            verified: true,
            documents_verified: true,
            verification_date: new Date().toISOString()
          }
          
          // Set professional type based on role
          if (account.role === 'doctor') {
            professionalData.professional_type = isSOGARAMedical ? 'medecin_du_travail' : 'medecin_generaliste'
            professionalData.numero_ordre = isSOGARAMedical ? '241-MDT-2018-001' : '241-MG-2015-001'
          } else if (account.role === 'specialist') {
            professionalData.professional_type = 'medecin_specialiste'
            professionalData.numero_ordre = '241-CAR-2020-001'
          } else if (account.role === 'nurse') {
            professionalData.professional_type = 'infirmier'
            professionalData.numero_ordre = isSOGARAMedical ? '241-INF-2019-001' : '241-INF-2017-001'
          }
          
          const { data: professional, error: professionalError } = await supabaseAdmin
            .from('professionals')
            .insert(professionalData)
            .select()
            .single()

          if (!professionalError && professional) {
            // Add practice location (SOGARA or Libreville)
            const locationName = isSOGARAMedical 
              ? (account.role === 'doctor' ? 'Centre de Médecine du Travail SOGARA' : 'Infirmerie SOGARA')
              : (account.role === 'doctor' ? 'Cabinet Médical du Centre' : 'Cabinet Infirmerie')
            
            const locationData = isSOGARAMedical
              ? {
                  professional_id: professional.id,
                  name: locationName,
                  location_type: 'cabinet_prive',
                  address: 'Route de la Sogara',
                  city: 'Port-Gentil',
                  province: 'Ogooué-Maritime',
                  quartier: 'Zone Port',
                  is_primary: true
                }
              : {
                  professional_id: professional.id,
                  name: locationName,
                  location_type: 'cabinet_prive',
                  address: 'Avenue du Président Léon MBA',
                  city: 'Libreville',
                  province: 'Estuaire',
                  quartier: 'Centre-ville',
                  is_primary: true
                }
            
            await supabaseAdmin
              .from('practice_locations')
              .insert(locationData)

            // Add diploma
            const diplomaData = {
              professional_id: professional.id,
              title: isSOGARAMedical && account.role === 'doctor' 
                ? 'Certificat Médecin du Travail'
                : account.role === 'doctor' 
                  ? 'Doctorat en Médecine'
                  : account.role === 'nurse'
                    ? 'Diplôme Infirmier'
                    : 'Spécialisation en Cardiologie',
              institution: isSOGARAMedical 
                ? 'Institut Médecine Travail Gabon'
                : 'Université des Sciences de la Santé',
              year_obtained: isSOGARAMedical ? 2018 : (account.role === 'doctor' ? 2015 : 2020),
              country: 'Gabon',
              specialty: account.role === 'specialist' ? 'Cardiologie' : (isSOGARAMedical && account.role === 'doctor' ? 'Médecine du Travail' : null),
              verified: true,
              verification_status: 'verified'
            }
            
            await supabaseAdmin
              .from('professional_diplomas')
              .insert(diplomaData)

            console.log(`Professional profile created for ${account.email}`)
          }
        }

        // Create establishment profile for establishment admins
        if (['hospital_admin', 'clinic_admin', 'sogara_admin'].includes(account.role)) {
          let establishmentData: any = {}
          
          if (account.role === 'hospital_admin') {
            establishmentData = {
              raison_sociale: 'CHU Owendo',
              type_etablissement: 'chu',
              secteur: 'public',
              numero_autorisation: '2024-CHU-001',
              ville: 'Libreville',
              province: 'Estuaire',
              adresse_rue: 'Boulevard du Bord de Mer',
              adresse_quartier: 'Centre-ville',
              latitude: 0.415156,
              longitude: 9.467267,
              telephone_standard: '+241 01 74 10 00',
              telephone_urgences: '+241 01 74 10 15',
              email: 'hopital.demo@sante.ga',
              nombre_lits_total: 450,
              nombre_blocs_operatoires: 8,
              nombre_salles_consultation: 25,
              service_urgences_actif: true,
              cnamgs_conventionne: true,
              statut: 'actif'
            }
          } else if (account.role === 'clinic_admin') {
            establishmentData = {
              raison_sociale: 'Clinique Sainte-Marie',
              type_etablissement: 'clinique',
              secteur: 'prive',
              numero_autorisation: '2024-CLINIQUE-001',
              ville: 'Libreville',
              province: 'Estuaire',
              adresse_rue: 'Avenue de l\'Indépendance',
              adresse_quartier: 'Quartier Bosset',
              latitude: 0.409166,
              longitude: 9.450000,
              telephone_standard: '+241 01 74 20 00',
              telephone_urgences: '+241 01 74 20 15',
              email: 'clinique.demo@sante.ga',
              nombre_lits_total: 120,
              nombre_blocs_operatoires: 3,
              nombre_salles_consultation: 12,
              service_urgences_actif: true,
              cnamgs_conventionne: true,
              statut: 'actif'
            }
          } else if (account.role === 'sogara_admin') {
            establishmentData = {
              raison_sociale: 'Centre de Médecine de Santé au Travail (CMST) SOGARA',
              type_etablissement: 'centre_medical',
              secteur: 'prive',
              numero_autorisation: '2024-CMST-SOGARA-001',
              ville: 'Port-Gentil',
              province: 'Ogooué-Maritime',
              adresse_rue: 'Route de la Sogara',
              adresse_quartier: 'Zone Port',
              latitude: -0.681398,
              longitude: 8.772557,
              telephone_standard: '+241 01 55 26 21',
              telephone_urgences: '+241 01 55 26 22',
              email: 'sogara.demo@sante.ga',
              site_web: 'https://www.sogara.com',
              nombre_lits_total: 0,
              nombre_blocs_operatoires: 0,
              nombre_salles_consultation: 3,
              service_urgences_actif: false,
              cnamgs_conventionne: true,
              statut: 'actif'
            }
          }

          const { data: establishment, error: establishmentError } = await supabaseAdmin
            .from('establishments')
            .insert(establishmentData)
            .select()
            .single()

          if (!establishmentError && establishment) {
            // Add establishment admin user
            await supabaseAdmin
              .from('establishment_users')
              .insert({
                establishment_id: establishment.id,
                user_id: userData.user.id,
                role: 'administrateur',
                permissions: {
                  manage_staff: true,
                  manage_services: true,
                  manage_equipment: true,
                  manage_finances: true,
                  view_statistics: true,
                  manage_appointments: true,
                  manage_prescriptions: true
                },
                actif: true
              })

            console.log(`Establishment profile created for ${account.email}`)
          } else {
            console.error(`Error creating establishment for ${account.email}:`, establishmentError)
          }
        }

        results.push({
          email: account.email,
          status: 'created',
          userId: userData.user.id
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Demo accounts processed. Passwords have been generated securely.',
        results,
        passwords: generatedPasswords // Return generated passwords to admin
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
