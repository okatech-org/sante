/**
 * Performance Monitoring for Multi-Tenant Architecture
 * Tracks and reports key metrics for optimization
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, any>;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  summary: {
    avgResponseTime: number;
    p95ResponseTime: number;
    errorRate: number;
    activeEstablishments: number;
    totalRequests: number;
  };
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;
  private readonly REPORT_INTERVAL = 60000; // 1 minute
  private reportTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startReporting();
  }

  /**
   * Track a performance metric
   */
  track(name: string, value: number, context?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      context
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log slow operations
    if (name === 'api_response_time' && value > 1000) {
      console.warn(`Slow API call detected: ${value}ms`, context);
    }

    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      try {
        const recentMetrics = this.metrics.slice(-10);
        localStorage.setItem('performance_metrics', JSON.stringify(recentMetrics));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  /**
   * Track API calls with automatic timing
   */
  async trackApiCall<T>(
    name: string,
    apiCall: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    let success = true;

    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      this.track(name, duration, { ...context, success });
    }
  }

  /**
   * Track context switching performance
   */
  trackContextSwitch(fromEstablishment: string, toEstablishment: string, duration: number) {
    this.track('context_switch', duration, {
      from: fromEstablishment,
      to: toEstablishment,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track data isolation checks
   */
  trackIsolationCheck(establishmentId: string, dataType: string, recordCount: number, duration: number) {
    this.track('isolation_check', duration, {
      establishment: establishmentId,
      dataType,
      recordCount,
      avgTimePerRecord: recordCount > 0 ? duration / recordCount : 0
    });
  }

  /**
   * Track consent verification
   */
  trackConsentVerification(patientId: string, professionalId: string, granted: boolean, duration: number) {
    this.track('consent_verification', duration, {
      patientId,
      professionalId,
      granted,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    const recentMetrics = this.metrics.filter(m => m.timestamp > oneHourAgo);

    // Calculate response times
    const responseTimes = recentMetrics
      .filter(m => m.name === 'api_response_time')
      .map(m => m.value)
      .sort((a, b) => a - b);

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;

    const p95ResponseTime = responseTimes.length > 0
      ? responseTimes[Math.floor(responseTimes.length * 0.95)]
      : 0;

    // Calculate error rate
    const apiCalls = recentMetrics.filter(m => m.name === 'api_response_time');
    const failedCalls = apiCalls.filter(m => m.context?.success === false);
    const errorRate = apiCalls.length > 0
      ? (failedCalls.length / apiCalls.length) * 100
      : 0;

    // Count active establishments
    const establishments = new Set(
      recentMetrics
        .filter(m => m.context?.establishment)
        .map(m => m.context!.establishment)
    );

    return {
      metrics: recentMetrics,
      summary: {
        avgResponseTime,
        p95ResponseTime,
        errorRate,
        activeEstablishments: establishments.size,
        totalRequests: apiCalls.length
      },
      timestamp: now
    };
  }

  /**
   * Send report to monitoring service
   */
  private async sendReport(report: PerformanceReport) {
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && process.env.VITE_MONITORING_ENDPOINT) {
      try {
        await fetch(process.env.VITE_MONITORING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        });
      } catch (error) {
        console.error('Failed to send performance report:', error);
      }
    } else {
      // In development, log to console
      console.log('Performance Report:', report.summary);
    }
  }

  /**
   * Start automatic reporting
   */
  private startReporting() {
    this.reportTimer = setInterval(() => {
      const report = this.generateReport();
      this.sendReport(report);
    }, this.REPORT_INTERVAL);
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  /**
   * Get current metrics for debugging
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export types
export type { PerformanceMetric, PerformanceReport };

// Utility functions for common tracking
export const trackApiCall = performanceMonitor.trackApiCall.bind(performanceMonitor);
export const trackContextSwitch = performanceMonitor.trackContextSwitch.bind(performanceMonitor);
export const trackIsolationCheck = performanceMonitor.trackIsolationCheck.bind(performanceMonitor);
export const trackConsentVerification = performanceMonitor.trackConsentVerification.bind(performanceMonitor);

// React hook for performance tracking
import { useEffect, useRef } from 'react';

export function usePerformanceTracking(componentName: string) {
  const renderTime = useRef<number>(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const totalTime = unmountTime - mountTime.current;
      
      performanceMonitor.track('component_lifecycle', totalTime, {
        component: componentName,
        phase: 'total'
      });
    };
  }, [componentName]);

  useEffect(() => {
    renderTime.current = performance.now();
    
    performanceMonitor.track('component_render', performance.now() - renderTime.current, {
      component: componentName,
      phase: 'render'
    });
  });

  return {
    trackEvent: (eventName: string, duration: number, context?: Record<string, any>) => {
      performanceMonitor.track(`${componentName}_${eventName}`, duration, context);
    }
  };
}

// Web Vitals integration
export function reportWebVitals(metric: any) {
  performanceMonitor.track(`web_vital_${metric.name}`, metric.value, {
    name: metric.name,
    id: metric.id,
    label: metric.label
  });
}

// Export default monitor
export default performanceMonitor;
