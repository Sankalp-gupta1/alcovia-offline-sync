import { Router } from "express";
import { serverStore } from "../store";
import { SyncEvent } from "../types";

const router = Router();

function applyTaskEvent(event: SyncEvent) {
  const taskId = event.entityId;
  const existingTask =
    serverStore.tasks[taskId as keyof typeof serverStore.tasks];

  if (!existingTask) return;

  if (event.type === "task_deleted") {
    if (event.lamport >= existingTask.lamport) {
      existingTask.deleted = true;
      existingTask.lamport = event.lamport;
      existingTask.deviceId = event.deviceId;
    }
    return;
  }

  if (event.type === "task_status_changed") {
    if (existingTask.deleted) return;

    const incomingWins =
      event.lamport > existingTask.lamport ||
      (event.lamport === existingTask.lamport &&
        event.deviceId > existingTask.deviceId);

    if (incomingWins) {
      existingTask.status = event.payload.status;
      existingTask.lamport = event.lamport;
      existingTask.deviceId = event.deviceId;
    }
  }
}

const getProgress = () => {
  const tasks = Object.values(serverStore.tasks).filter(
    (task) => !task.deleted
  );

  const done = tasks.filter((task) => task.status === "done").length;

  return {
    chapterProgress: tasks.length
      ? Math.round((done / tasks.length) * 100)
      : 0,
    subjectProgress: tasks.length
      ? Math.round((done / tasks.length) * 100)
      : 0,
  };
};

router.post("/sync", (req, res) => {
  const incomingEvents: SyncEvent[] = req.body.events || [];

  for (const event of incomingEvents) {
    if (serverStore.events.has(event.eventId)) {
      continue;
    }

    serverStore.events.set(event.eventId, event);

    if (event.type === "focus_completed") {
      const sessionId = event.entityId;

      if (!serverStore.processedFocusSessions.has(sessionId)) {
        serverStore.processedFocusSessions.add(sessionId);

        const minutes = event.payload?.minutes || 25;
        const coins = event.payload?.coins || 50;

        serverStore.student.coins += coins;
        serverStore.student.todayFocusMinutes += minutes;
        serverStore.student.streak += 1;

        console.log("FOCUS SUCCESS COUNTED ONCE:", {
          sessionId,
          coins: serverStore.student.coins,
          streak: serverStore.student.streak,
        });

        if (!serverStore.notifiedEvents.has(event.eventId)) {
          serverStore.notifiedEvents.add(event.eventId);

          console.log("NOTIFICATION SENT ONCE:", {
            eventId: event.eventId,
            message: `Streak now ${serverStore.student.streak} days, +${coins} coins`,
          });
        }
      }
    }

    if (event.type === "task_status_changed" || event.type === "task_deleted") {
      applyTaskEvent(event);
    }
  }

  res.json({
    ok: true,
    serverState: serverStore.student,
    tasks: serverStore.tasks,
    progress: getProgress(),
    events: Array.from(serverStore.events.values()),
  });
});

router.post("/notification-sink", (req, res) => {
  console.log("MOCK NOTIFICATION SINK RECEIVED:", req.body);

  res.json({
    ok: true,
    received: req.body,
  });
});

router.get("/state", (_req, res) => {
  res.json({
    student: serverStore.student,
    tasks: serverStore.tasks,
    progress: getProgress(),
    totalEvents: serverStore.events.size,
    events: Array.from(serverStore.events.values()),
  });
});

export default router;