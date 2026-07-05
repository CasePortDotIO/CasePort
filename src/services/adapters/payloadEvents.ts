import type { Payload } from 'payload'
import type { EventStore } from '../ports'

/**
 * Shared Payload backed event store. Appends to the immutable global event log
 * (Section 4). Used by the intake and wallet pipelines alike.
 */
export function payloadEventStoreFor(payload: Payload): EventStore {
  return {
    async append(event) {
      const created = await payload.create({
        collection: 'events',
        data: {
          eventType: event.eventType,
          aggregateType: event.aggregateType,
          aggregateId: event.aggregateId,
          intakeSession: event.intakeSessionId,
          actor: event.actor,
          occurredAt: event.occurredAt,
          payload: event.payload ?? {},
        },
      })
      return { id: String(created.id), ...event }
    },
  }
}
