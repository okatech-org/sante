import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';
import Logger from './Logger.js';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
    this.logger = new Logger('EventBus');
    this.eventHistory = [];
    this.maxHistorySize = 10000;
    this.metrics = {
      totalEvents: 0,
      eventsByType: new Map(),
      failedEvents: 0,
      averageProcessingTime: 0
    };
  }

  async publish(eventType, data, metadata = {}) {
    const eventId = uuidv4();
    const timestamp = Date.now();
    
    const event = {
      id: eventId,
      type: eventType,
      data,
      metadata: {
        ...metadata,
        timestamp,
        source: metadata.source || 'unknown'
      }
    };

    this.logger.info(`📤 Event published: ${eventType}`, {
      eventId,
      dataKeys: Object.keys(data)
    });

    this._saveToHistory(event);
    this._updateMetrics(eventType);

    try {
      const startTime = Date.now();
      this.emit(eventType, event);
      const processingTime = Date.now() - startTime;
      
      this._updateProcessingTime(processingTime);
      
      return { success: true, eventId };
    } catch (error) {
      this.logger.error(`❌ Error publishing event ${eventType}:`, error);
      this.metrics.failedEvents++;
      throw error;
    }
  }

  subscribe(eventType, handler, neuronName = 'Unknown') {
    this.logger.info(`🔗 Neuron "${neuronName}" subscribed to: ${eventType}`);
    
    const safeHandler = async (event) => {
      try {
        await handler(event);
      } catch (error) {
        this.logger.error(
          `❌ Error in ${neuronName} handling ${eventType}:`,
          error
        );
      }
    };

    this.on(eventType, safeHandler);
    
    return () => this.off(eventType, safeHandler);
  }

  _saveToHistory(event) {
    this.eventHistory.push(event);
    
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  _updateMetrics(eventType) {
    this.metrics.totalEvents++;
    
    const count = this.metrics.eventsByType.get(eventType) || 0;
    this.metrics.eventsByType.set(eventType, count + 1);
  }

  _updateProcessingTime(time) {
    const { totalEvents, averageProcessingTime } = this.metrics;
    this.metrics.averageProcessingTime = 
      (averageProcessingTime * (totalEvents - 1) + time) / totalEvents;
  }

  getHistory(filters = {}) {
    let history = [...this.eventHistory];

    if (filters.type) {
      history = history.filter(e => e.type === filters.type);
    }

    if (filters.since) {
      history = history.filter(e => e.metadata.timestamp >= filters.since);
    }

    if (filters.limit) {
      history = history.slice(-filters.limit);
    }

    return history;
  }

  getMetrics() {
    return {
      ...this.metrics,
      eventsByType: Object.fromEntries(this.metrics.eventsByType),
      uptime: process.uptime()
    };
  }

  resetMetrics() {
    this.metrics = {
      totalEvents: 0,
      eventsByType: new Map(),
      failedEvents: 0,
      averageProcessingTime: 0
    };
    this.eventHistory = [];
  }
}

const eventBus = new EventBus();
export default eventBus;
