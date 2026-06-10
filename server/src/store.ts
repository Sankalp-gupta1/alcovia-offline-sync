import { SyncEvent } from "./types";

export const serverStore = {
  events: new Map<string, SyncEvent>(),
  processedFocusSessions: new Set<string>(),
  notifiedEvents: new Set<string>(),

  student: {
    studentId: "student-1",
    coins: 0,
    streak: 0,
    todayFocusMinutes: 0,
  },

  tasks: {
    "task-1": {
      taskId: "task-1",
      title: "Math Chapter 1 Practice",
      status: "not_started",
      deleted: false,
      lamport: 0,
      deviceId: "server",
    },
  },
};