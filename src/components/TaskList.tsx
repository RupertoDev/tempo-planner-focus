
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskListProps {
  tasks: Task[];
  onStartTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onStartTask }: TaskListProps) => {
  const formatEstimatedTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card key={task.id} className="task-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {formatEstimatedTime(task.estimatedTime)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Criado {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
              </div>
              
              <Button
                size="sm"
                onClick={() => onStartTask(task.id)}
                className="timer-button"
                disabled={task.status === 'completed'}
              >
                <Play className="h-4 w-4" />
                <span className="ml-2">Iniciar</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskList;
