import BaseNeuron from '../../src/neural/core/BaseNeuron.js';
import eventBus from '../../src/neural/core/EventBus.js';

class TestNeuron extends BaseNeuron {
  getSubscriptions() {
    return [
      { eventType: 'TEST_EVENT', handler: this.handleTestEvent }
    ];
  }

  async handleTestEvent(event) {
    this.lastEvent = event;
  }
}

describe('BaseNeuron', () => {
  let neuron;

  beforeEach(() => {
    eventBus.resetMetrics();
    eventBus.removeAllListeners();
    neuron = new TestNeuron('TestNeuron');
  });

  test('should activate neuron', async () => {
    await neuron.activate();
    expect(neuron.isActive).toBe(true);
  });

  test('should deactivate neuron', async () => {
    await neuron.activate();
    expect(neuron.isActive).toBe(true);
    
    await neuron.deactivate();
    expect(neuron.isActive).toBe(false);
  });

  test('should emit events', async () => {
    await neuron.activate();
    
    const result = await neuron.emit('TEST_EMIT', { data: 'test' });
    
    expect(result.success).toBe(true);
    expect(neuron.metrics.eventsEmitted).toBe(1);
  });

  test('should handle subscribed events', async () => {
    await neuron.activate();
    
    await eventBus.publish('TEST_EVENT', { message: 'hello' });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(neuron.metrics.eventsProcessed).toBe(1);
    expect(neuron.lastEvent).toBeDefined();
  });

  test('should track metrics', async () => {
    const healthCheck = await neuron.healthCheck();
    
    expect(healthCheck.name).toBe('TestNeuron');
    expect(healthCheck.status).toBe('inactive');
    
    await neuron.activate();
    const activeCheck = await neuron.healthCheck();
    expect(activeCheck.status).toBe('active');
  });
});
