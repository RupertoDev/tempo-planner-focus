
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CheckCircle, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TimerProps {
  taskId: string;
  title: string;
  estimatedTime: number; // in minutes
  onTimeUpdate: (taskId: string, elapsedTime: number) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({
  taskId,
  title,
  estimatedTime,
  onTimeUpdate,
  onComplete,
  onDelete,
  isActive
}) => {
  const totalSeconds = estimatedTime * 60;
  const [isRunning, setIsRunning] = useState(isActive);
  const [remainingTime, setRemainingTime] = useState(totalSeconds);
  const [lastTick, setLastTick] = useState<number | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage (inverted from previous)
  const calculateProgress = (): number => {
    return Math.max(100 - ((remainingTime / totalSeconds) * 100), 0);
  };

  // Toggle timer
  const toggleTimer = (): void => {
    if (isRunning) {
      setIsRunning(false);
      setLastTick(null);
    } else {
      setIsRunning(true);
      setLastTick(Date.now());
    }
  };

  // Complete task
  const completeTask = (): void => {
    setIsRunning(false);
    onComplete(taskId);
  };

  // Effect for timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        const now = Date.now();
        if (lastTick) {
          const diff = Math.floor((now - lastTick) / 1000);
          const newRemainingTime = Math.max(0, remainingTime - diff);
          setRemainingTime(newRemainingTime);
          
          // Calculate elapsed time
          const elapsedTime = totalSeconds - newRemainingTime;
          onTimeUpdate(taskId, elapsedTime);
          
          // Check if timer reached zero
          if (newRemainingTime === 0) {
            setIsRunning(false);
            toast.info("Tempo estimado atingido!", {
              description: `A tarefa "${title}" atingiu o tempo estimado`
            });
          }
        }
        setLastTick(now);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, lastTick, taskId, remainingTime, onTimeUpdate, totalSeconds, title]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold">{formatTime(remainingTime)}</span>
          <span className="text-sm text-muted-foreground">
            Meta: {formatTime(totalSeconds)}
          </span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </CardContent>
      <CardFooter className="pt-1 flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta tarefa em andamento? Todo o progresso será perdido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(taskId)} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleTimer}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={completeTask}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Concluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Timer;
