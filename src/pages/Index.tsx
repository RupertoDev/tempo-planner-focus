
import { useState, useEffect } from "react";
import { Task } from "@/types";
import HeaderBar from "@/components/HeaderBar";
import CalendarLayout from "@/components/Calendar/CalendarLayout";
import ActiveTimers from "@/components/ActiveTimers";
import TaskHistory from "@/components/TaskHistory";
import { toast } from "sonner";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Add a new task
  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
    toast.success("Tarefa adicionada com sucesso!");
  };
  
  // Start a task
  const handleStartTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: 'in-progress' as const }
          : task
      )
    );
    toast("Temporizador iniciado", {
      description: "Acompanhe o progresso na seção de temporizadores ativos",
    });
  };
  
  // Update task timer
  const handleTimeUpdate = (taskId: string, elapsedTime: number) => {
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, actualTime: elapsedMinutes }
          : task
      )
    );
  };
  
  // Complete a task
  const handleCompleteTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed' as const }
          : task
      )
    );
    
    // Notify task completion
    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask) {
      toast.success(`"${completedTask.title}" concluída!`, {
        description: "Tarefa movida para o histórico",
      });
    }
  };
  
  // Count tasks in progress
  const activeTaskCount = tasks.filter(task => task.status === 'in-progress').length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar activeTaskCount={activeTaskCount} onAddTask={handleAddTask} />
      
      <main className="flex-1 container py-6 space-y-6">
        <ActiveTimers 
          tasks={tasks} 
          onTimeUpdate={handleTimeUpdate} 
          onComplete={handleCompleteTask} 
        />
        
        <CalendarLayout
          tasks={tasks}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onStartTask={handleStartTask}
        />
        
        <TaskHistory tasks={tasks} />
      </main>
    </div>
  );
};

export default Index;
