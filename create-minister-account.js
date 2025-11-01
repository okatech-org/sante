#!/usr/bin/env node

/**
 * Script de création du compte du Pr. Adrien MOUGOUGOU
 * Ministre de la Santé du Gabon
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Les variables VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createMinisterAccount() {
  console.log('🏛️  Création du compte du Ministre de la Santé...\n');
  
  try {
    // Lire le fichier SQL
    const sqlContent = readFileSync(join(__dirname, 'create-minister-account.sql'), 'utf8');
    
    // Exécuter le SQL
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: sqlContent
    });
    
    if (error) {
      // Si la fonction RPC n'existe pas, essayons une autre approche
      console.log('⚠️  La fonction RPC n\'existe pas, création manuelle...');
      
      // Créer l'utilisateur
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'ministre@sante.gouv.ga',
        password: 'MinistryGab2025!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Pr. Adrien MOUGOUGOU',
          title: 'Ministre de la Santé',
          is_minister: true,
          permissions: [
            'view_all',
            'manage_all',
            'create_decrees',
            'approve_budgets',
            'manage_policies',
            'view_national_statistics',
            'manage_establishments',
            'manage_professionals'
          ]
        },
        app_metadata: {
          provider: 'email',
          providers: ['email'],
          role: 'admin'
        }
      });

      if (authError) {
        if (authError.message?.includes('already been registered')) {
          console.log('ℹ️  L\'utilisateur existe déjà, récupération...');
          
          // Récupérer l'utilisateur existant
          const { data: existingUsers } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'ministre@sante.gouv.ga')
            .single();
          
          if (existingUsers) {
            console.log('✅ Compte ministre déjà existant');
            console.log('\n📋 Informations de connexion:');
            console.log('   Email: ministre@sante.gouv.ga');
            console.log('   Mot de passe: MinistryGab2025!');
            return;
          }
        } else {
          throw authError;
        }
      }

      const userId = authUser?.user?.id;
      
      if (userId) {
        // Créer ou récupérer l'établissement
        const { data: existingEstablishment } = await supabase
          .from('establishments')
          .select('id')
          .eq('name', 'Ministère de la Santé')
          .eq('type', 'ministry')
          .single();

        let establishmentId = existingEstablishment?.id;

        if (!establishmentId) {
          const { data: newEstablishment, error: estError } = await supabase
            .from('establishments')
            .insert({
              name: 'Ministère de la Santé',
              type: 'ministry',
              sub_type: 'government',
              address: 'À côté de l\'immeuble Alu-Suisse',
              city: 'Libreville',
              phone: '+241 01-72-26-61',
              email: 'contact@sante.gouv.ga',
              website: 'https://sante.gouv.ga',
              is_active: true,
              settings: {
                description: 'Ministère de la Santé publique et de la Population du Gabon',
                boite_postale: 'BP 50',
                horaires: {
                  lundi_vendredi: '08h00 - 17h00',
                  weekend: 'Fermé',
                  jours_feries: 'Fermé'
                },
                mission: 'Élaborer, mettre en œuvre et coordonner la politique de santé sur toute l\'étendue du territoire national',
                vision_pnds_2024_2028: 'Accélérer les progrès vers la Couverture Sanitaire Universelle (CSU) pour garantir l\'accès à des soins de santé de qualité pour tous les Gabonais',
                objectif_general: 'Améliorer l\'état de santé et le bien-être de la population gabonaise en assurant l\'accès universel à des services de santé de qualité, équitables et efficaces'
              }
            })
            .select('id')
            .single();

          if (estError) throw estError;
          establishmentId = newEstablishment.id;
        }

        // Créer le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            email: 'ministre@sante.gouv.ga',
            phone: '+241 01-72-26-61',
            first_name: 'Adrien',
            last_name: 'MOUGOUGOU',
            profile_type: 'professional',
            is_active: true,
            metadata: {
              title: 'Professeur',
              position: 'Ministre de la Santé',
              cabinet: 'Cabinet du Ministre',
              specialization: 'Santé Publique',
              responsibilities: [
                'Définition de la politique nationale de santé',
                'Supervision des programmes de santé',
                'Gestion du budget du ministère',
                'Relations internationales en santé',
                'Coordination des établissements de santé'
              ]
            }
          });

        if (profileError && !profileError.message?.includes('duplicate key')) {
          throw profileError;
        }

        // Créer l'entrée professionals
        const { data: professional, error: profError } = await supabase
          .from('professionals')
          .insert({
            user_id: userId,
            full_name: 'Pr. Adrien MOUGOUGOU',
            email: 'ministre@sante.gouv.ga',
            phone: '+241 01-72-26-61',
            speciality: 'Santé Publique et Administration',
            professional_type: 'minister'
          })
          .select('id')
          .single();

        if (profError && !profError.message?.includes('duplicate key')) {
          console.log('⚠️  Note: ', profError.message);
        }

        // Créer le lien avec l'établissement
        if (professional?.id && establishmentId) {
          const { error: staffError } = await supabase
            .from('establishment_staff')
            .insert({
              professional_id: professional.id,
              establishment_id: establishmentId,
              role: 'minister',
              position: 'Ministre de la Santé',
              is_department_head: true,
              is_establishment_admin: true,
              permissions: {
                can_create_decrees: true,
                can_approve_budgets: true,
                can_manage_policies: true,
                can_view_all_statistics: true,
                can_manage_all_establishments: true,
                can_manage_all_professionals: true,
                can_approve_national_programs: true,
                can_sign_documents: true,
                can_manage_crisis: true,
                access_level: 'national'
              },
              status: 'active',
              start_date: '2024-01-01'
            });

          if (staffError && !staffError.message?.includes('duplicate key')) {
            console.log('⚠️  Note: ', staffError.message);
          }
        }

        console.log('\n✅ Compte du Ministre créé avec succès!');
        console.log('\n📋 Informations de connexion:');
        console.log('   Email: ministre@sante.gouv.ga');
        console.log('   Mot de passe: MinistryGab2025!');
        console.log('   Établissement: Ministère de la Santé');
        console.log('   Rôle: Ministre de la Santé');
        console.log('\n🔑 Permissions spéciales:');
        console.log('   - Création de décrets ministériels');
        console.log('   - Approbation des budgets');
        console.log('   - Gestion des politiques de santé');
        console.log('   - Accès aux statistiques nationales');
        console.log('   - Gestion de tous les établissements');
        console.log('   - Gestion de tous les professionnels');
      }
    } else {
      console.log('\n✅ Script SQL exécuté avec succès!');
      console.log('\n📋 Informations de connexion:');
      console.log('   Email: ministre@sante.gouv.ga');
      console.log('   Mot de passe: MinistryGab2025!');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la création:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
createMinisterAccount().then(() => {
  console.log('\n✨ Processus terminé');
  process.exit(0);
});
