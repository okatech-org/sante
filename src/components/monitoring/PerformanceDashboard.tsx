import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Building2,
  Users
} from 'lucide-react';
import performanceMonitor from '@/utils/performanceMonitoring';
import type { PerformanceReport } from '@/utils/performanceMonitoring';

export function PerformanceDashboard() {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    refreshReport();
    
    if (autoRefresh) {
      const interval = setInterval(refreshReport, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const refreshReport = () => {
    setIsRefreshing(true);
    const newReport = performanceMonitor.generateReport();
    setReport(newReport);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getPerformanceStatus = () => {
    if (report.summary.avgResponseTime < 200) return { label: 'Excellent', color: 'text-green-600', icon: CheckCircle };
    if (report.summary.avgResponseTime < 500) return { label: 'Bon', color: 'text-blue-600', icon: TrendingUp };
    if (report.summary.avgResponseTime < 1000) return { label: 'Moyen', color: 'text-yellow-600', icon: AlertCircle };
    return { label: 'Lent', color: 'text-red-600', icon: TrendingDown };
  };

  const status = getPerformanceStatus();
  const StatusIcon = status.icon;

  // Group metrics by type
  const contextSwitches = report.metrics.filter(m => m.name === 'context_switch');
  const apiCalls = report.metrics.filter(m => m.name === 'api_response_time');
  const isolationChecks = report.metrics.filter(m => m.name === 'isolation_check');
  const consentVerifications = report.metrics.filter(m => m.name === 'consent_verification');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitoring des Performances</h2>
          <p className="text-muted-foreground">Architecture Multi-Établissement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshReport}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{Math.round(report.summary.avgResponseTime)}ms</div>
                <p className="text-xs text-muted-foreground">Temps de réponse moyen</p>
              </div>
              <StatusIcon className={`w-8 h-8 ${status.color}`} />
            </div>
            <Badge className={`mt-2 ${status.color}`}>{status.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">P95 Latence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{Math.round(report.summary.p95ResponseTime)}ms</div>
                <p className="text-xs text-muted-foreground">95% des requêtes</p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <Progress 
              value={Math.min((report.summary.p95ResponseTime / 2000) * 100, 100)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{report.summary.errorRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Sur {report.summary.totalRequests} requêtes</p>
              </div>
              {report.summary.errorRate > 5 ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Établissements Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{report.summary.activeEstablishments}</div>
                <p className="text-xs text-muted-foreground">Contextes utilisés</p>
              </div>
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Context Switches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changements de Contexte</CardTitle>
            <CardDescription>Performance des transitions entre établissements</CardDescription>
          </CardHeader>
          <CardContent>
            {contextSwitches.length > 0 ? (
              <div className="space-y-2">
                {contextSwitches.slice(-5).reverse().map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {metric.context?.from} → {metric.context?.to}
                      </span>
                    </div>
                    <Badge variant={metric.value < 500 ? "default" : "destructive"}>
                      {Math.round(metric.value)}ms
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun changement récent</p>
            )}
          </CardContent>
        </Card>

        {/* Isolation Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vérifications d'Isolation</CardTitle>
            <CardDescription>Performance du cloisonnement des données</CardDescription>
          </CardHeader>
          <CardContent>
            {isolationChecks.length > 0 ? (
              <div className="space-y-2">
                {isolationChecks.slice(-5).reverse().map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {metric.context?.dataType} ({metric.context?.recordCount} enr.)
                      </span>
                    </div>
                    <Badge variant={metric.value < 100 ? "default" : "secondary"}>
                      {Math.round(metric.value)}ms
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune vérification récente</p>
            )}
          </CardContent>
        </Card>

        {/* Consent Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vérifications de Consentement</CardTitle>
            <CardDescription>Performance des contrôles d'accès DMP</CardDescription>
          </CardHeader>
          <CardContent>
            {consentVerifications.length > 0 ? (
              <div className="space-y-2">
                {consentVerifications.slice(-5).reverse().map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Accès {metric.context?.granted ? 'accordé' : 'refusé'}
                      </span>
                    </div>
                    <Badge variant={metric.value < 50 ? "default" : "secondary"}>
                      {Math.round(metric.value)}ms
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune vérification récente</p>
            )}
          </CardContent>
        </Card>

        {/* API Calls Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribution des Appels API</CardTitle>
            <CardDescription>Répartition des temps de réponse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: '< 100ms', count: apiCalls.filter(m => m.value < 100).length },
                { label: '100-500ms', count: apiCalls.filter(m => m.value >= 100 && m.value < 500).length },
                { label: '500-1000ms', count: apiCalls.filter(m => m.value >= 500 && m.value < 1000).length },
                { label: '> 1000ms', count: apiCalls.filter(m => m.value >= 1000).length },
              ].map((range, idx) => {
                const percentage = apiCalls.length > 0 ? (range.count / apiCalls.length) * 100 : 0;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{range.label}</span>
                      <span className="font-medium">{range.count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Section */}
      {(report.summary.errorRate > 5 || report.summary.avgResponseTime > 1000) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Alertes de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {report.summary.errorRate > 5 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Taux d'erreur élevé détecté ({report.summary.errorRate.toFixed(1)}%)</span>
                </li>
              )}
              {report.summary.avgResponseTime > 1000 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Temps de réponse dégradé ({Math.round(report.summary.avgResponseTime)}ms)</span>
                </li>
              )}
              {report.summary.p95ResponseTime > 2000 && (
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Latence P95 critique ({Math.round(report.summary.p95ResponseTime)}ms)</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
