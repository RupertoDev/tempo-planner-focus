
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "@/types";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskHistoryProps {
  tasks: Task[];
}

const TaskHistory = ({ tasks }: TaskHistoryProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Filter completed tasks and sort by completion date (newest first)
  const completedTasks = tasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => {
      // This is a simplification, assuming createdAt + actualTime represents completion time
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
  // Display only the most recent tasks unless expanded
  const displayedTasks = expanded ? completedTasks : completedTasks.slice(0, 5);
  
  if (completedTasks.length === 0) {
    return null;
  }

  // Format time for display
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Histórico de Tarefas</h2>
        {completedTasks.length > 5 && (
          <Button variant="ghost" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Mostrar Menos" : "Mostrar Mais"}
          </Button>
        )}
      </div>
      
      <ScrollArea className={cn("rounded-md border", expanded ? "max-h-[400px]" : "max-h-[300px]")}>
        <div className="p-4 space-y-3">
          {displayedTasks.map(task => (
            <div key={task.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-md">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{task.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Concluída em {format(new Date(task.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatTime(task.actualTime)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Estimado: {formatTime(task.estimatedTime)}
                </div>
              </div>
            </div>
          ))}
          
          {displayedTasks.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">
              Nenhuma tarefa concluída
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskHistory;
