
export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  scheduledTime: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export interface TimerState {
  taskId: string | null;
  isRunning: boolean;
  elapsedTime: number; // in seconds
  startTime: number | null;
}
