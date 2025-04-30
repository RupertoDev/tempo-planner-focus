
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Check, ChevronDown, ChevronUp, Clock, Trash2 } from 'lucide-react';

interface TaskHistoryProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
}

const TaskHistory = ({ tasks, onDeleteTask }: TaskHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Filter completed tasks and sort by completion date (most recent first)
  const completedTasks = tasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => {
      // Using createdAt as a proxy for completedAt
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
  if (completedTasks.length === 0) {
    return null;
  }
  
  // Display at most 3 tasks when collapsed
  const displayedTasks = isExpanded ? completedTasks : completedTasks.slice(0, 3);
  const hasMore = completedTasks.length > 3;
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Histórico de Tarefas</span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedTasks.length} tarefas concluídas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-1">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(task.actualTime)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(task.createdAt), "d 'de' MMMM", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir do histórico</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir "{task.title}" do histórico de tarefas? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDeleteTask(task.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          
          {hasMore && (
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" /> Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" /> Mostrar mais ({completedTasks.length - 3} restantes)
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskHistory;
