export type EventType =
  | "focus_completed"
  | "focus_failed"
  | "task_status_changed"
  | "task_deleted";

export type SyncEvent = {
  eventId: string;
  studentId: string;
  deviceId: string;
  lamport: number;
  type: EventType;
  entityId: string;
  payload: any;
};

export type TaskStatus = "not_started" | "in_progress" | "done";