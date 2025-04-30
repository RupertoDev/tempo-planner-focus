
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/types";
import { Clock, PlusCircle } from "lucide-react";
import TaskForm from "./TaskForm";

interface HeaderBarProps {
  activeTaskCount: number;
  onAddTask: (task: Task) => void;
}

const HeaderBar = ({ activeTaskCount, onAddTask }: HeaderBarProps) => {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">TempoPlan</h1>
          {activeTaskCount > 0 && (
            <div className="ml-4 inline-flex items-center rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-medium text-secondary">
              {activeTaskCount} {activeTaskCount === 1 ? "tarefa" : "tarefas"} ativas
            </div>
          )}
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <TaskForm onAddTask={onAddTask} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default HeaderBar;
