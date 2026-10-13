# Alcovia Offline Sync

An offline-first sync demonstration for Focus Sessions and Syllabus Progress.

## Live simulator

**https://alcovia-offline-sync-sankalp.vercel.app/**

The live page lets you control two independent devices and sync their queued events in any order.

## What the live demo shows

- Device A and Device B
- Offline event queues
- Lamport clocks
- Focus-session rewards
- Exactly-once reward processing
- Idempotent event replay
- Task status updates
- Delete events
- Deterministic conflict resolution
- Notification deduplication
- Server event log

## Original architecture

The repository still contains the original React Native / Expo Web material, Express + TypeScript backend, n8n workflow export, and documentation.

The `web/` version is an additional standalone simulator so a reviewer can understand the sync rules without starting multiple local services.

## Conflict rule

Higher Lamport timestamp wins. If Lamport timestamps tie, device ID is the deterministic tie-breaker.

Processed event IDs are remembered so replaying the same focus event does not add rewards twice.

## Run locally

```bash
cd web
python -m http.server 8000
```

Open `http://localhost:8000`.

## Author

Sankalp Gupta  
GitHub: https://github.com/Sankalp-gupta1
