import eventBus from '../../src/neural/core/EventBus.js';

describe('EventBus', () => {
  beforeEach(() => {
    eventBus.resetMetrics();
    eventBus.removeAllListeners();
  });

  test('should publish and receive event', async () => {
    let received = false;
    
    eventBus.subscribe('TEST_EVENT', async (event) => {
      received = true;
    }, 'TestNeuron');
    
    await eventBus.publish('TEST_EVENT', { message: 'hello' });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(received).toBe(true);
  });

  test('should update metrics correctly', async () => {
    await eventBus.publish('EVENT_1', {});
    await eventBus.publish('EVENT_1', {});
    await eventBus.publish('EVENT_2', {});
    
    const metrics = eventBus.getMetrics();
    
    expect(metrics.totalEvents).toBe(3);
    expect(metrics.eventsByType.EVENT_1).toBe(2);
    expect(metrics.eventsByType.EVENT_2).toBe(1);
  });

  test('should handle multiple subscribers', async () => {
    let count = 0;
    
    eventBus.subscribe('MULTI_EVENT', async () => {
      count++;
    }, 'Neuron1');
    
    eventBus.subscribe('MULTI_EVENT', async () => {
      count++;
    }, 'Neuron2');
    
    await eventBus.publish('MULTI_EVENT', { data: 'test' });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(count).toBe(2);
  });

  test('should return event history with filters', async () => {
    await eventBus.publish('TYPE_A', { a: 1 });
    await eventBus.publish('TYPE_B', { b: 2 });
    await eventBus.publish('TYPE_A', { a: 3 });
    
    const historyTypeA = eventBus.getHistory({ type: 'TYPE_A' });
    expect(historyTypeA).toHaveLength(2);
    
    const historyLimit = eventBus.getHistory({ limit: 2 });
    expect(historyLimit).toHaveLength(2);
  });
});
