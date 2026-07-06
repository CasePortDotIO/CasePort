import type { Payload } from 'payload'
import type { EventStore } from '../ports'
import { reqOf, type TxContext } from './txContext'

/**
 * Shared Payload backed event store. Appends to the immutable global event log
 * (Section 4). Used by the intake and wallet pipelines alike. An optional
 * transaction context enrolls the append in an open wallet transaction; without
 * one it appends non transactionally, exactly as before.
 */
export function payloadEventStoreFor(payload: Payload, txCtx?: TxContext): EventStore {
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
        ...reqOf(txCtx),
      })
      return { id: String(created.id), ...event }
    },
  }
}
