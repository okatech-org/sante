import eventBus from './EventBus.js';
import Logger from './Logger.js';

class BaseNeuron {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.logger = new Logger(name);
    this.isActive = false;
    this.subscriptions = [];
    this.metrics = {
      eventsProcessed: 0,
      eventsEmitted: 0,
      errors: 0,
      startTime: null
    };
  }

  async activate() {
    if (this.isActive) {
      this.logger.warn(`⚠️  Neuron ${this.name} already active`);
      return;
    }

    this.logger.info(`🧠 Activating neuron: ${this.name}`);
    
    await this.onActivate();

    this._setupSubscriptions();

    this.isActive = true;
    this.metrics.startTime = Date.now();
    
    this.logger.info(`✅ Neuron ${this.name} activated`);
  }

  async deactivate() {
    if (!this.isActive) return;

    this.logger.info(`🛑 Deactivating neuron: ${this.name}`);

    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];

    await this.onDeactivate();

    this.isActive = false;
    
    this.logger.info(`✅ Neuron ${this.name} deactivated`);
  }

  _setupSubscriptions() {
    const subscriptions = this.getSubscriptions();
    
    subscriptions.forEach(({ eventType, handler }) => {
      const unsubscribe = eventBus.subscribe(
        eventType,
        async (event) => {
          this.metrics.eventsProcessed++;
          
          try {
            await handler.call(this, event);
          } catch (error) {
            this.metrics.errors++;
            this.logger.error(`Error handling ${eventType}:`, error);
          }
        },
        this.name
      );
      
      this.subscriptions.push(unsubscribe);
    });
  }

  async emit(eventType, data) {
    this.metrics.eventsEmitted++;
    
    return eventBus.publish(eventType, data, {
      source: this.name,
      neuron: this.name
    });
  }

  getSubscriptions() {
    return [];
  }

  async onActivate() {
  }

  async onDeactivate() {
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptime: this.metrics.startTime 
        ? Date.now() - this.metrics.startTime 
        : 0,
      isActive: this.isActive
    };
  }

  async healthCheck() {
    return {
      name: this.name,
      status: this.isActive ? 'active' : 'inactive',
      metrics: this.getMetrics()
    };
  }
}

export default BaseNeuron;
