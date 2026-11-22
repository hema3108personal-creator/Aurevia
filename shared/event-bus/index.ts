import { RABBITMQ_CONFIG, AureviaEvent } from '../event-contracts';
import * as fs from 'fs';
import * as path from 'path';

// Resilient Event Bus with RabbitMQ support & Persistent Fallback Broker
export class EventBus {
  private static instance: EventBus;
  private amqpConnection: any = null;
  private channel: any = null;
  private isConnected = false;
  private localSubscribers: Map<string, Array<(event: AureviaEvent) => Promise<void> | void>> = new Map();
  private auditLogPath: string;

  private constructor() {
    this.auditLogPath = path.resolve(__dirname, '../../audit_events.log');
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public async initialize(amqpUrl: string = process.env.RABBITMQ_URL || 'amqp://localhost:5672'): Promise<void> {
    try {
      // Dynamically require amqplib if present
      let amqp: any;
      try {
        amqp = require('amqplib');
      } catch (e) {
        amqp = require(path.resolve(__dirname, '../../backend/node_modules/amqplib'));
      }
      console.log(`[EventBus] Connecting to RabbitMQ at ${amqpUrl}...`);
      this.amqpConnection = await amqp.connect(amqpUrl);
      this.channel = await this.amqpConnection.createChannel();

      // Configure main topic exchange
      await this.channel.assertExchange(RABBITMQ_CONFIG.EXCHANGE_NAME, RABBITMQ_CONFIG.EXCHANGE_TYPE, { durable: true });
      // Configure dead letter exchange
      await this.channel.assertExchange(RABBITMQ_CONFIG.DEAD_LETTER_EXCHANGE, 'fanout', { durable: true });

      // Configure queues
      for (const queueName of Object.values(RABBITMQ_CONFIG.QUEUES)) {
        await this.channel.assertQueue(queueName, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': RABBITMQ_CONFIG.DEAD_LETTER_EXCHANGE,
          },
        });
      }

      // Bind queues
      await this.channel.bindQueue(
        RABBITMQ_CONFIG.QUEUES.NOTIFICATIONS,
        RABBITMQ_CONFIG.EXCHANGE_NAME,
        'booking.*'
      );
      await this.channel.bindQueue(
        RABBITMQ_CONFIG.QUEUES.NOTIFICATIONS,
        RABBITMQ_CONFIG.EXCHANGE_NAME,
        'user.*'
      );
      await this.channel.bindQueue(
        RABBITMQ_CONFIG.QUEUES.NOTIFICATIONS,
        RABBITMQ_CONFIG.EXCHANGE_NAME,
        'itinerary.*'
      );

      this.isConnected = true;
      console.log(`[EventBus] RabbitMQ initialized successfully with exchanges and durable queues.`);
    } catch (err: any) {
      console.warn(`[EventBus] RabbitMQ connection not available (${err.message}). Using resilient local in-process & persistent event bus.`);
      this.isConnected = false;
    }
  }

  public async publish(routingKey: string, payload: any): Promise<void> {
    const event: AureviaEvent = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      eventType: routingKey as any,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      payload,
    };

    const eventJson = JSON.stringify(event, null, 2);
    const logLine = `[EVENT_AUDIT] [${event.timestamp}] [${routingKey}] ID: ${event.eventId} -> ${JSON.stringify(payload)}\n`;
    
    try {
      fs.appendFileSync(this.auditLogPath, logLine, 'utf8');
    } catch (e) {
      // Log path fallback
    }

    console.log(`\n================= AUREVIA EVENT PUBLISHED =================`);
    console.log(`Routing Key: ${routingKey}`);
    console.log(`Event ID:    ${event.eventId}`);
    console.log(`Timestamp:   ${event.timestamp}`);
    console.log(`Payload:     ${JSON.stringify(payload)}`);
    console.log(`===========================================================\n`);

    if (this.isConnected && this.channel) {
      try {
        const buffer = Buffer.from(JSON.stringify(event));
        this.channel.publish(
          RABBITMQ_CONFIG.EXCHANGE_NAME,
          routingKey,
          buffer,
          { persistent: true, contentType: 'application/json' }
        );
      } catch (error: any) {
        console.error(`[EventBus] Error publishing to RabbitMQ channel:`, error.message);
      }
    }

    // Always dispatch to registered subscribers (local/fallback)
    this.dispatchLocal(routingKey, event);
  }

  public async subscribe(
    routingKeyPattern: string,
    handler: (event: AureviaEvent) => Promise<void> | void
  ): Promise<void> {
    // Add to local subscribers map
    const existing = this.localSubscribers.get(routingKeyPattern) || [];
    existing.push(handler);
    this.localSubscribers.set(routingKeyPattern, existing);

    // If RabbitMQ is connected, attach consumer to the relevant queue
    if (this.isConnected && this.channel) {
      try {
        const queueName = `aurevia.sub.${routingKeyPattern.replace(/[^a-zA-Z0-9]/g, '_')}`;
        await this.channel.assertQueue(queueName, { durable: true });
        await this.channel.bindQueue(queueName, RABBITMQ_CONFIG.EXCHANGE_NAME, routingKeyPattern);

        this.channel.consume(queueName, async (msg: any) => {
          if (msg !== null) {
            try {
              const content = JSON.parse(msg.content.toString());
              await handler(content);
              this.channel.ack(msg);
            } catch (err) {
              console.error(`[EventBus] Consumer error:`, err);
              this.channel.nack(msg, false, false); // Route to DLX
            }
          }
        });
      } catch (err: any) {
        console.warn(`[EventBus] Failed to attach AMQP consumer:`, err.message);
      }
    }
  }

  private matchPattern(pattern: string, key: string): boolean {
    if (pattern === '#' || pattern === key) return true;
    const patternParts = pattern.split('.');
    const keyParts = key.split('.');
    if (patternParts.length !== keyParts.length) return false;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '*') continue;
      if (patternParts[i] !== keyParts[i]) return false;
    }
    return true;
  }

  private dispatchLocal(routingKey: string, event: AureviaEvent): void {
    for (const [pattern, handlers] of this.localSubscribers.entries()) {
      if (this.matchPattern(pattern, routingKey)) {
        for (const handler of handlers) {
          Promise.resolve(handler(event)).catch((err) => {
            console.error(`[EventBus] Error in event subscriber for ${routingKey}:`, err);
          });
        }
      }
    }
  }
}

export const eventBus = EventBus.getInstance();
