import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";

// Types
interface ClaimRequest {
  id: string;
  establishment: {
    id: string;
    name: string;
    type: string;
    city: string;
    province: string;
  };
  claimant: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedAt: Date;
  documents: {
    official_letter?: string;
    identity_proof?: string;
    authority_proof?: string;
    rccm_document?: string;
    msp_authorization?: string;
  };
  reviewNotes?: string;
}

// Données mock
const MOCK_CLAIMS: ClaimRequest[] = [
  {
    id: 'claim-001',
    establishment: {
      id: 'chu-owendo',
      name: 'CHU d\'Owendo',
      type: 'hospital',
      city: 'Libreville',
      province: 'Estuaire'
    },
    claimant: {
      name: 'Dr. Pierre MBOUMBA',
      email: 'p.mboumba@chu-owendo.ga',
      phone: '+241 01 79 50 01',
      role: 'Directeur Général'
    },
    status: 'pending',
    submittedAt: new Date('2024-10-25T14:30:00'),
    documents: {
      official_letter: '/docs/chu-owendo-letter.pdf',
      identity_proof: '/docs/mboumba-id.pdf',
      authority_proof: '/docs/nomination-dg.pdf',
      msp_authorization: '/docs/authorization-msp.pdf'
    }
  },
  {
    id: 'claim-002',
    establishment: {
      id: 'cabinet-glass',
      name: 'Cabinet Médical Glass',
      type: 'cabinet',
      city: 'Libreville',
      province: 'Estuaire'
    },
    claimant: {
      name: 'Dr. Jean OBAME',
      email: 'dr.obame@sante.ga',
      phone: '+241 01 77 88 99',
      role: 'Propriétaire'
    },
    status: 'in_review',
    submittedAt: new Date('2024-10-26T09:15:00'),
    documents: {
      official_letter: '/docs/glass-letter.pdf',
      identity_proof: '/docs/obame-id.pdf',
      authority_proof: '/docs/property-deed.pdf'
    }
  },
  {
    id: 'claim-003',
    establishment: {
      id: 'cmst-sogara',
      name: 'CMST SOGARA',
      type: 'clinic',
      city: 'Port-Gentil',
      province: 'Ogooué-Maritime'
    },
    claimant: {
      name: 'Dr. Jean-Pierre MBENGONO',
      email: 'jp.mbengono@sogara.com',
      phone: '+241 01 55 26 21',
      role: 'Médecin Chef'
    },
    status: 'pending',
    submittedAt: new Date('2024-10-27T11:00:00'),
    documents: {
      official_letter: '/docs/sogara-letter.pdf',
      identity_proof: '/docs/mbengono-id.pdf',
      authority_proof: '/docs/contract-sogara.pdf'
    }
  }
];

export default function ClaimsManagement() {
  const [claims, setClaims] = useState<ClaimRequest[]>(MOCK_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    inReview: claims.filter(c => c.status === 'in_review').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            En Attente
          </Badge>
        );
      case 'in_review':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Eye className="w-3 h-3 mr-1" />
            En Examen
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approuvé
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleApproveClaim = (claimId: string) => {
    setClaims(prev => prev.map(c => 
      c.id === claimId ? { ...c, status: 'approved' as const } : c
    ));
    toast({
      title: "Revendication approuvée",
      description: "L'établissement a été vérifié et activé"
    });
    setSelectedClaim(null);
  };

  const handleRejectClaim = (claimId: string) => {
    setClaims(prev => prev.map(c => 
      c.id === claimId ? { ...c, status: 'rejected' as const } : c
    ));
    toast({
      title: "Revendication rejetée",
      description: "Le demandeur sera notifié",
      variant: "destructive"
    });
    setSelectedClaim(null);
  };

  const filteredClaims = filterStatus === 'all' 
    ? claims 
    : claims.filter(c => c.status === filterStatus);

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gestion des Revendications</h1>
          <p className="text-gray-600 mt-2">
            Vérifiez et approuvez les demandes de revendication d'établissements
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-700">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-700">En Examen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.inReview}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-700">Approuvés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-700">Rejetés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">Tous ({claims.length})</TabsTrigger>
            <TabsTrigger value="pending">En Attente ({stats.pending})</TabsTrigger>
            <TabsTrigger value="in_review">En Examen ({stats.inReview})</TabsTrigger>
            <TabsTrigger value="approved">Approuvés ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={filterStatus} className="mt-6">
            {filteredClaims.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Aucune revendication
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Il n'y a aucune revendication dans cette catégorie
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredClaims.map((claim) => (
                  <Card key={claim.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {claim.establishment.name}
                              </h3>
                              {getStatusBadge(claim.status)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {claim.establishment.type === 'hospital' ? 'Hôpital' :
                               claim.establishment.type === 'clinic' ? 'Clinique' :
                               claim.establishment.type === 'cabinet' ? 'Cabinet' :
                               claim.establishment.type === 'pharmacy' ? 'Pharmacie' : 'Laboratoire'}
                              {' • '}
                              {claim.establishment.city}, {claim.establishment.province}
                            </p>
                            
                            {/* Demandeur */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Demandeur</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span>{claim.claimant.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-gray-500" />
                                  <span>{claim.claimant.role}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span>{claim.claimant.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span>{claim.claimant.phone}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Documents */}
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Documents Fournis</p>
                              <div className="flex flex-wrap gap-2">
                                {claim.documents.official_letter && (
                                  <Badge variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Lettre Officielle
                                  </Badge>
                                )}
                                {claim.documents.identity_proof && (
                                  <Badge variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Pièce d'Identité
                                  </Badge>
                                )}
                                {claim.documents.authority_proof && (
                                  <Badge variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Justificatif d'Autorité
                                  </Badge>
                                )}
                                {claim.documents.rccm_document && (
                                  <Badge variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    RCCM
                                  </Badge>
                                )}
                                {claim.documents.msp_authorization && (
                                  <Badge variant="outline">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Autorisation MSP
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Timeline */}
                            <div className="mt-3 text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Soumis le {claim.submittedAt.toLocaleDateString('fr-FR')} à {claim.submittedAt.toLocaleTimeString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Examiner
                          </Button>
                          
                          {claim.status === 'pending' || claim.status === 'in_review' ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveClaim(claim.id)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectClaim(claim.id)}
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Rejeter
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal d'examen détaillé */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Examen de la Revendication</CardTitle>
                    <CardDescription>
                      Vérifiez les informations et documents avant de valider
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClaim(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Établissement */}
                <div>
                  <h3 className="font-semibold mb-2">Établissement</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-bold text-lg">{selectedClaim.establishment.name}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {selectedClaim.establishment.type}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedClaim.establishment.city}, {selectedClaim.establishment.province}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Demandeur */}
                <div>
                  <h3 className="font-semibold mb-2">Demandeur</h3>
                  <div className="p-4 bg-green-50 rounded-lg space-y-2 text-sm">
                    <p><strong>Nom :</strong> {selectedClaim.claimant.name}</p>
                    <p><strong>Rôle :</strong> {selectedClaim.claimant.role}</p>
                    <p><strong>Email :</strong> {selectedClaim.claimant.email}</p>
                    <p><strong>Téléphone :</strong> {selectedClaim.claimant.phone}</p>
                  </div>
                </div>
                
                {/* Documents */}
                <div>
                  <h3 className="font-semibold mb-2">Documents à Vérifier</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedClaim.documents).map(([key, url]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">
                            {key === 'official_letter' ? 'Lettre Officielle' :
                             key === 'identity_proof' ? 'Pièce d\'Identité' :
                             key === 'authority_proof' ? 'Justificatif d\'Autorité' :
                             key === 'rccm_document' ? 'RCCM' : 'Autorisation MSP'}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedClaim(null)}
                  >
                    Fermer
                  </Button>
                  {selectedClaim.status !== 'approved' && selectedClaim.status !== 'rejected' && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectClaim(selectedClaim.id)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveClaim(selectedClaim.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alert Info */}
        {filteredClaims.filter(c => c.status === 'pending' || c.status === 'in_review').length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Revendications en attente</AlertTitle>
            <AlertDescription>
              Vous avez {stats.pending + stats.inReview} revendication(s) à examiner. 
              Objectif de traitement : moins de 48 heures.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </SuperAdminLayout>
  );
}
