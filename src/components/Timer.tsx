
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Timer as TimerIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TimerProps {
  taskId: string;
  title: string;
  estimatedTime: number;
  onTimeUpdate: (taskId: string, elapsedTime: number) => void;
  onComplete: (taskId: string) => void;
  isActive?: boolean;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    hours > 0 ? String(hours).padStart(2, '0') : '',
    String(minutes).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].filter(Boolean).join(':');
};

const Timer = ({ taskId, title, estimatedTime, onTimeUpdate, onComplete, isActive = false }: TimerProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const estimatedTimeInSeconds = estimatedTime * 60;
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  // Handles timer completion
  const completeTimer = useCallback(() => {
    setIsRunning(false);
    onComplete(taskId);
    toast.success(`Tempo concluído: ${title}`);
  }, [taskId, title, onComplete]);

  // Manage timer interval
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isRunning) {
      intervalId = window.setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate(taskId, newTime);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, taskId, onTimeUpdate]);
  
  // Check if timer reached the estimated time
  useEffect(() => {
    if (elapsedTime >= estimatedTimeInSeconds) {
      completeTimer();
    }
  }, [elapsedTime, estimatedTimeInSeconds, completeTimer]);

  return (
    <Card className={cn("task-card transition-all", isRunning && "ring-2 ring-primary")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">
              {isRunning ? "Em andamento" : "Tarefa"}
            </h3>
            <p className="font-semibold truncate max-w-[180px]">{title}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={cn("timer-display flex items-center gap-2", 
              isRunning && "text-primary animate-pulse-light")}>
              <TimerIcon className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Estimado: {formatTime(estimatedTimeInSeconds)}
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <Button 
            size="sm" 
            variant={isRunning ? "secondary" : "default"}
            onClick={toggleTimer} 
            className="timer-button"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="ml-2">{isRunning ? "Pausar" : "Iniciar"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timer;
