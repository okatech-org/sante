import express from 'express';
import supabase from '../config/supabase.js';
import eventBus from '../core/EventBus.js';
import Logger from '../core/Logger.js';

const router = express.Router();
const logger = new Logger('DashboardRoutes');

// GET /api/dashboard/kpis
router.get('/kpis', async (req, res) => {
  try {
    const { periode = 'mois' } = req.query;
    
    const { data, error } = await supabase
      .from('dashboard_kpis')
      .select('*')
      .eq('periode', periode)
      .order('date', { ascending: false })
      .limit(10);

    if (error) throw error;

    logger.info(`Fetched ${data.length} KPIs for periode: ${periode}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching KPIs:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des KPIs' 
    });
  }
});

// GET /api/dashboard/alerts
router.get('/alerts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_alerts')
      .select('*')
      .eq('statut', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    logger.info(`Fetched ${data.length} active alerts`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching alerts:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des alertes' 
    });
  }
});

// GET /api/dashboard/decrets
router.get('/decrets', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = supabase
      .from('dashboard_decrets')
      .select('*')
      .order('date', { ascending: false })
      .limit(20);

    if (status) {
      query = query.eq('statut', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    logger.info(`Fetched ${data.length} decrets${status ? ` with status: ${status}` : ''}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching decrets:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des décrets' 
    });
  }
});

// POST /api/dashboard/decrets
router.post('/decrets', async (req, res) => {
  try {
    const { titre, numero, date, statut, categorie, pdf_url } = req.body;

    // Validation basique
    if (!titre || !numero || !date || !statut || !categorie) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis: titre, numero, date, statut, categorie',
      });
    }

    const { data, error } = await supabase
      .from('dashboard_decrets')
      .insert([{
        titre,
        numero,
        date,
        statut,
        categorie,
        pdf_url,
        created_by: req.user?.email || 'system',
      }])
      .select()
      .single();

    if (error) throw error;

    // Publier event
    eventBus.publish('DECRET_CREATED', {
      decretId: data.id,
      titre: data.titre,
      numero: data.numero,
      createdBy: data.created_by,
      timestamp: new Date(),
    });

    logger.info(`Created decret: ${data.numero}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Error creating decret:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la création du décret' 
    });
  }
});

// PATCH /api/dashboard/decrets/:id
router.patch('/decrets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('dashboard_decrets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Publier event
    eventBus.publish('DECRET_UPDATED', {
      decretId: data.id,
      titre: data.titre,
      changes: updates,
      timestamp: new Date(),
    });

    logger.info(`Updated decret: ${data.numero}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error updating decret:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la mise à jour du décret' 
    });
  }
});

// DELETE /api/dashboard/decrets/:id
router.delete('/decrets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('dashboard_decrets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Publier event
    eventBus.publish('DECRET_DELETED', {
      decretId: id,
      timestamp: new Date(),
    });

    logger.info(`Deleted decret: ${id}`);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting decret:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la suppression du décret' 
    });
  }
});

// GET /api/dashboard/objectifs
router.get('/objectifs', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase
      .from('dashboard_objectifs')
      .select('*')
      .order('deadline', { ascending: true });

    if (category) {
      query = query.ilike('nom', `%${category}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    logger.info(`Fetched ${data.length} objectifs`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching objectifs:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des objectifs' 
    });
  }
});

// POST /api/dashboard/objectifs
router.post('/objectifs', async (req, res) => {
  try {
    const { nom, description, cible, progres, unite, deadline, province_id } = req.body;

    if (!nom || cible === undefined || !unite || !deadline) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis: nom, cible, unite, deadline',
      });
    }

    const { data, error } = await supabase
      .from('dashboard_objectifs')
      .insert([{
        nom,
        description,
        cible,
        progres: progres || 0,
        unite,
        deadline,
        province_id,
      }])
      .select()
      .single();

    if (error) throw error;

    eventBus.publish('OBJECTIF_CREATED', {
      objectifId: data.id,
      nom: data.nom,
      timestamp: new Date(),
    });

    logger.info(`Created objectif: ${data.nom}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    logger.error('Error creating objectif:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la création de l\'objectif' 
    });
  }
});

// PATCH /api/dashboard/objectifs/:id
router.patch('/objectifs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('dashboard_objectifs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    eventBus.publish('OBJECTIF_UPDATED', {
      objectifId: data.id,
      nom: data.nom,
      progres: data.progres,
      changes: updates,
      timestamp: new Date(),
    });

    logger.info(`Updated objectif: ${data.nom}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error updating objectif:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la mise à jour de l\'objectif' 
    });
  }
});

// GET /api/dashboard/provinces
router.get('/provinces', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('dashboard_provinces')
      .select('*')
      .order('nom', { ascending: true });

    if (error) throw error;

    logger.info(`Fetched ${data.length} provinces`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching provinces:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des provinces' 
    });
  }
});

// GET /api/dashboard/provinces/:id
router.get('/provinces/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('dashboard_provinces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    logger.info(`Fetched province: ${data.nom}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error fetching province:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération de la province' 
    });
  }
});

// PATCH /api/dashboard/provinces/:id
router.patch('/provinces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('dashboard_provinces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    eventBus.publish('PROVINCE_UPDATED', {
      provinceId: data.id,
      nom: data.nom,
      changes: updates,
      timestamp: new Date(),
    });

    logger.info(`Updated province: ${data.nom}`);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error updating province:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la mise à jour de la province' 
    });
  }
});

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const { periode = 'mois' } = req.query;

    // Agréger plusieurs KPIs
    const { data: kpis, error: kpisError } = await supabase
      .from('dashboard_kpis')
      .select('*')
      .eq('periode', periode)
      .order('date', { ascending: false })
      .limit(5);

    if (kpisError) throw kpisError;

    // Compter les alertes actives
    const { count: alertsCount, error: alertsError } = await supabase
      .from('dashboard_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'active');

    if (alertsError) throw alertsError;

    // Calculer stats provinciales
    const { data: provinces, error: provincesError } = await supabase
      .from('dashboard_provinces')
      .select('population, couverture, structures, medecins');

    if (provincesError) throw provincesError;

    const stats = {
      kpis,
      alertsCount,
      provinces: {
        total: provinces.length,
        totalPopulation: provinces.reduce((sum, p) => sum + (p.population || 0), 0),
        avgCoverage: provinces.reduce((sum, p) => sum + (p.couverture || 0), 0) / (provinces.length || 1),
        totalStructures: provinces.reduce((sum, p) => sum + (p.structures || 0), 0),
        totalMedecins: provinces.reduce((sum, p) => sum + (p.medecins || 0), 0),
      },
    };

    logger.info(`Fetched dashboard stats for periode: ${periode}`);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Erreur lors de la récupération des statistiques' 
    });
  }
});

export default router;

