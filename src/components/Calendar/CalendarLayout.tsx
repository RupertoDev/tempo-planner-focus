
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TaskList from "@/components/TaskList";
import { Task } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarLayoutProps {
  tasks: Task[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onStartTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const CalendarLayout = ({ tasks, selectedDate, onDateChange, onStartTask, onDeleteTask }: CalendarLayoutProps) => {
  const selectedDateTasks = tasks.filter(task => {
    const taskDate = new Date(task.scheduledTime);
    return taskDate.toDateString() === selectedDate.toDateString();
  });
  
  const dateStr = format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  
  // Capitalize first letter
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{formattedDate}</h2>
          <p className="text-muted-foreground">
            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "tarefa" : "tarefas"} planejadas
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onDateChange(new Date())}
          >
            <Clock className="h-4 w-4" /> Hoje
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Calendário
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tarefas Planejadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateTasks.length > 0 ? (
            <TaskList tasks={selectedDateTasks} onStartTask={onStartTask} onDeleteTask={onDeleteTask} />
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma tarefa planejada para este dia
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarLayout;
