# Alcovia Offline Sync Assignment

## Overview

This project demonstrates an offline-first sync system for Alcovia's Focus Sessions and Syllabus Progress features.

The goal is to support:

* Offline actions on multiple devices
* Reliable synchronization
* Conflict resolution
* Idempotent rewards
* Idempotent notifications
* Event replay safety

The demo simulates two devices:

* Device A
* Device B

Both devices operate independently while offline and later synchronize with a central server.

---

## Tech Stack

### Frontend

* React Native (Expo Web)
* TypeScript

### Backend

* Express
* TypeScript

### Automation

* n8n Workflow (export included)

---

## Feature A: Focus Sessions

A student can complete a focus session while offline.

When synchronized:

* Coins increase
* Streak increases
* Focus minutes increase

Rewards are applied exactly once.

Duplicate sync attempts are ignored.

### Idempotency

Each focus session contains:

* eventId
* sessionId

The server stores processed session IDs.

If the same event arrives again:

* Rewards are not applied twice
* Streak is not incremented twice
* Focus minutes are not added twice

---

## Feature B: Syllabus Progress

The demo contains a sample task:

Math Chapter 1 Practice

Supported actions:

* Mark Done
* Mark In Progress
* Delete

All actions can happen offline.

### Progress Calculation

Chapter Progress

completed tasks / total tasks

Subject Progress

completed tasks / total tasks

Progress updates automatically after synchronization.

---

## Conflict Resolution

Implemented strategy:

### Task Status Conflict

If two devices update the same task:

* Higher Lamport timestamp wins
* If Lamport timestamps are equal:

  * Device ID acts as tie breaker

### Delete Conflict

Delete wins if synchronized later.

Example:

Device A:

* Mark Done

Device B:

* Delete

If delete has higher Lamport timestamp:

Final State:

Deleted

---

## Feature C: Automation Layer

When a focus session is accepted by the server:

A notification event is generated.

Example:

Streak now 4 days, +50 coins

The included workflow demonstrates:

Webhook → Notification Sink

### Idempotency

Notifications are deduplicated using:

eventId

The same event replayed multiple times generates only one notification.

---

## Dev Panel

The application provides:

### Device A

* Complete Focus Offline
* Mark Task Done Offline
* Delete Task Offline
* Sync
* Replay Duplicate

### Device B

* Complete Focus Offline
* Mark Task In Progress Offline
* Sync
* Replay Duplicate

### Server State View

Displays:

* Coins
* Streak
* Focus Minutes
* Task Status
* Chapter Progress
* Subject Progress

---

## Running

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm start
```

Open:

```text
http://localhost:8081
```

---

## Demonstrated Scenarios

### Scenario 1

Offline focus session

Result:

* Reward applied once

### Scenario 2

Replay duplicate sync

Result:

* No duplicate rewards

### Scenario 3

Replay duplicate notification

Result:

* Notification sent once

### Scenario 4

Conflicting task updates

Result:

* Higher Lamport timestamp wins

### Scenario 5

Delete vs Update

Result:

* Delete wins if synchronized later

---

## Future Improvements

* Persistent storage
* Real WhatsApp integration
* Multi-user support
* Incremental sync
* Recovery after crashes
* Three or more devices
* Production-grade n8n integration
* Sync acknowledgements
