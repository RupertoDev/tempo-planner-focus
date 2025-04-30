
import { Task } from "@/types";
import Timer from "./Timer";

interface ActiveTimersProps {
  tasks: Task[];
  onTimeUpdate: (taskId: string, elapsedTime: number) => void;
  onComplete: (taskId: string) => void;
}

const ActiveTimers = ({ tasks, onTimeUpdate, onComplete }: ActiveTimersProps) => {
  // Filter tasks that are in progress
  const activeTasks = tasks.filter(task => task.status === 'in-progress');
  
  if (activeTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Temporizadores Ativos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeTasks.map(task => (
          <Timer
            key={task.id}
            taskId={task.id}
            title={task.title}
            estimatedTime={task.estimatedTime}
            onTimeUpdate={onTimeUpdate}
            onComplete={onComplete}
            isActive={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveTimers;
