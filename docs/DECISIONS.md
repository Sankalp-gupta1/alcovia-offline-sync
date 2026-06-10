# DECISIONS.md

## Sync Model

The system uses an event-based synchronization model.

Every offline action creates a SyncEvent containing:

* eventId
* studentId
* deviceId
* lamport timestamp
* event type
* entityId
* payload

Events are stored locally and synchronized later with the server.

The server keeps a permanent record of processed events.

This allows devices to operate fully offline and replay events safely.

---

## Conflict Resolution Strategy

### Task Status Updates

For task updates, the system uses:

1. Higher Lamport timestamp wins.
2. If Lamport timestamps are equal, deviceId acts as a deterministic tie breaker.

This guarantees that all devices eventually converge to the same state.

Example:

Device A:

task -> done

Device B:

task -> in_progress

If Device B has a higher Lamport timestamp, the final state becomes:

in_progress

---

### Delete vs Update

Delete operations are treated as stronger operations.

If a delete event arrives with a higher Lamport timestamp than an update event:

Final result:

deleted

This avoids resurrecting tasks unintentionally.

---

## Why Devices Converge

All devices send events to the same server.

The server applies events using deterministic conflict resolution rules.

Because every device receives the same final server state and the same conflict rules are applied every time, all devices eventually converge to an identical state.

---

## Idempotency: Focus Sessions

Each focus session has a unique sessionId.

The backend maintains:

processedFocusSessions

When a session arrives:

* If the sessionId has never been seen, rewards are applied.
* If the sessionId already exists, the event is ignored.

This guarantees:

* No duplicate coins
* No duplicate streak increments
* No duplicate focus minutes

Even if the same event is replayed many times.

---

## Idempotency: Notifications

Notifications use unique eventIds.

The backend maintains:

notifiedEvents

Before sending a notification:

* Check if eventId already exists.
* If yes, skip notification.
* If no, send notification and store the eventId.

This guarantees exactly-once notification delivery.

---

## Tradeoff

For simplicity, server state is stored in memory.

Advantages:

* Easy to understand
* Fast to implement
* Good for demonstration

Disadvantages:

* Data is lost after a server restart.

In production, a persistent database such as PostgreSQL would be used.
