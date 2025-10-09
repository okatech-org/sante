import { Database, Users, Building2, Shield, Link } from 'lucide-react';

export default function MultiEstablishmentArchitecture() {
  const tables = [
    {
      name: 'profiles',
      description: 'Profil utilisateur unique (1 profil = 1 personne)',
      icon: Users,
      color: 'bg-blue-500',
      fields: [
        { name: 'id', type: 'UUID', note: 'PK, lié à auth.users' },
        { name: 'email', type: 'TEXT', note: 'Unique, email principal' },
        { name: 'full_name', type: 'TEXT', note: 'Nom complet' },
        { name: 'phone', type: 'TEXT', note: 'Téléphone' },
        { name: 'birth_date', type: 'DATE', note: 'Date naissance' },
        { name: 'gender', type: 'TEXT', note: 'Sexe' },
        { name: 'province', type: 'TEXT', note: 'Province résidence' },
        { name: 'city', type: 'TEXT', note: 'Ville' },
        { name: 'profile_type', type: 'TEXT', note: 'patient | professional' },
        { name: 'created_at', type: 'TIMESTAMP', note: 'Date création' }
      ]
    },
    {
      name: 'professional_profiles',
      description: 'Données professionnelles (médecins, infirmiers, etc.)',
      icon: Shield,
      color: 'bg-green-500',
      fields: [
        { name: 'id', type: 'UUID', note: 'PK' },
        { name: 'user_id', type: 'UUID', note: 'FK → profiles.id' },
        { name: 'profession_type', type: 'TEXT', note: 'doctor | nurse | admin | technician' },
        { name: 'specialization', type: 'TEXT', note: 'Spécialité médicale' },
        { name: 'ordre_number', type: 'TEXT', note: 'N° CNOM/ONPG/Ordre' },
        { name: 'ordre_verified', type: 'BOOLEAN', note: 'Vérification ordre' },
        { name: 'years_experience', type: 'INTEGER', note: 'Années expérience' },
        { name: 'diplomas', type: 'JSONB', note: 'Liste diplômes' },
        { name: 'bio', type: 'TEXT', note: 'Biographie' },
        { name: 'consultation_fee', type: 'INTEGER', note: 'Tarif consultation (FCFA)' }
      ]
    },
    {
      name: 'establishments',
      description: 'Établissements de santé (hôpitaux, cliniques, cabinets)',
      icon: Building2,
      color: 'bg-purple-500',
      fields: [
        { name: 'id', type: 'UUID', note: 'PK' },
        { name: 'raison_sociale', type: 'TEXT', note: 'Nom établissement' },
        { name: 'type_etablissement', type: 'ENUM', note: 'hospital | clinic | cabinet | lab | pharmacy' },
        { name: 'numero_rccm', type: 'TEXT', note: 'N° Registre Commerce' },
        { name: 'numero_autorisation', type: 'TEXT', note: 'N° Autorisation MSP' },
        { name: 'secteur', type: 'ENUM', note: 'public | private | confessional' },
        { name: 'province', type: 'TEXT', note: 'Province' },
        { name: 'ville', type: 'TEXT', note: 'Ville' },
        { name: 'services', type: 'JSONB', note: 'Services médicaux offerts' },
        { name: 'capacity', type: 'JSONB', note: 'Capacité (lits, salles)' },
        { name: 'cnamgs_conventionne', type: 'BOOLEAN', note: 'Conventionnement CNAMGS' },
        { name: 'statut', type: 'ENUM', note: 'active | pending | suspended' }
      ]
    },
    {
      name: 'establishment_staff',
      description: 'Relation N-N : Professionnels ↔ Établissements avec rôles',
      icon: Link,
      color: 'bg-orange-500',
      fields: [
        { name: 'id', type: 'UUID', note: 'PK' },
        { name: 'establishment_id', type: 'UUID', note: 'FK → establishments.id' },
        { name: 'professional_id', type: 'UUID', note: 'FK → professional_profiles.id' },
        { name: 'role_in_establishment', type: 'TEXT', note: 'Rôle spécifique' },
        { name: 'permissions', type: 'TEXT[]', note: 'Permissions spécifiques' },
        { name: 'is_admin', type: 'BOOLEAN', note: 'Admin de cet établissement' },
        { name: 'schedule', type: 'JSONB', note: 'Planning dans établissement' },
        { name: 'status', type: 'TEXT', note: 'active | inactive | suspended' },
        { name: 'start_date', type: 'DATE', note: 'Date début collaboration' },
        { name: 'end_date', type: 'DATE', note: 'Date fin (nullable)' },
        { name: 'created_by', type: 'UUID', note: 'Admin qui a créé' }
      ]
    }
  ];

  const roleExamples = [
    {
      establishment: 'CHU Owendo',
      professional: 'Dr. OBAME Jean',
      roles: [
        { role: 'Médecin Généraliste', admin: false, permissions: ['consultations', 'prescriptions', 'dmp_read'] },
        { role: 'Chef Service Médecine', admin: true, permissions: ['all_medical', 'staff_manage', 'planning'] }
      ]
    },
    {
      establishment: 'Clinique Sainte-Marie',
      professional: 'Dr. OBAME Jean',
      roles: [
        { role: 'Consultant Externe', admin: false, permissions: ['consultations', 'prescriptions'] }
      ]
    },
    {
      establishment: 'Cabinet Médical Glass',
      professional: 'Dr. OBAME Jean',
      roles: [
        { role: 'Propriétaire', admin: true, permissions: ['all'] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Database className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Architecture Multi-Établissements SANTE.GA
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Un professionnel = Un profil unique, mais peut intervenir dans plusieurs établissements 
            avec des rôles et permissions différents
          </p>
        </div>

        {/* Principe Clé */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">🎯 Principe Fondamental</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-2">1 Personne</h3>
              <p className="text-sm">Un seul profil utilisateur (email unique)</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-2">N Établissements</h3>
              <p className="text-sm">Peut travailler dans plusieurs structures</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <h3 className="font-bold text-lg mb-2">N Rôles</h3>
              <p className="text-sm">Rôle et permissions par établissement</p>
            </div>
          </div>
        </div>

        {/* Tables Schema */}
        <div className="grid lg:grid-cols-2 gap-6">
          {tables.map((table, idx) => {
            const Icon = table.icon;
            return (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100">
                <div className={`${table.color} p-4 text-white flex items-center gap-3`}>
                  <Icon className="h-6 w-6" />
                  <div>
                    <h3 className="text-xl font-bold">{table.name}</h3>
                    <p className="text-sm opacity-90">{table.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {table.fields.map((field, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-gray-900">
                              {field.name}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                              {field.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{field.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exemple Concret */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="h-7 w-7 text-green-600" />
            Exemple Concret : Dr. OBAME Jean
          </h2>
          
          <div className="space-y-6">
            {roleExamples.map((example, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  📍 {example.establishment}
                </h3>
                <div className="space-y-2">
                  {example.roles.map((role, ridx) => (
                    <div key={ridx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{role.role}</span>
                        {role.admin && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, pidx) => (
                          <span key={pidx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>✅ Résultat :</strong> Dr. OBAME a UN SEUL profil (email: obame@sante.ga), 
              mais peut se connecter et intervenir dans 3 établissements différents avec des 
              responsabilités adaptées à chaque structure.
            </p>
          </div>
        </div>

        {/* Flux de Connexion */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🔐 Flux de Connexion</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">1</span>
              <p>Utilisateur se connecte avec email/password unique</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">2</span>
              <p>Système charge son profil depuis <code className="bg-white/20 px-2 py-1 rounded">profiles</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">3</span>
              <p>Système récupère tous les établissements depuis <code className="bg-white/20 px-2 py-1 rounded">establishment_staff</code></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">4</span>
              <p>Utilisateur choisit l&apos;établissement dans lequel il veut travailler</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold">5</span>
              <p>Interface charge les rôles et permissions spécifiques à cet établissement</p>
            </div>
          </div>
        </div>

        {/* RLS Policies */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-7 w-7 text-yellow-600" />
            Row Level Security (RLS)
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Règle 1 : Lecture Profil</h3>
              <code className="text-xs text-gray-700 block">
                Un utilisateur peut lire son propre profil OU les profils des professionnels 
                travaillant dans SES établissements
              </code>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Règle 2 : Gestion Staff</h3>
              <code className="text-xs text-gray-700 block">
                Seuls les admins d&apos;un établissement peuvent ajouter/modifier/supprimer 
                des membres du staff de CET établissement
              </code>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Règle 3 : Isolation Données</h3>
              <code className="text-xs text-gray-700 block">
                Les données médicales (consultations, DMP, prescriptions) sont accessibles 
                uniquement par les professionnels autorisés dans l&apos;établissement concerné
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
