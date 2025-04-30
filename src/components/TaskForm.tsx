
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  scheduledTime?: Date;
  onClose?: () => void;
}

const TaskForm = ({ onAddTask, scheduledTime = new Date(), onClose }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("1");
  const [minutes, setMinutes] = useState("0");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const estimatedTime = parseInt(hours) * 60 + parseInt(minutes);
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      estimatedTime,
      actualTime: 0,
      scheduledTime,
      status: 'pending',
      createdAt: new Date(),
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTitle("");
    setDescription("");
    setHours("1");
    setMinutes("0");
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Adicionar Nova Tarefa</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da tarefa"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição (opcional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicionar detalhes"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="estimatedTime" className="text-sm font-medium">
              Tempo Estimado
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger>
                    <SelectValue placeholder="Horas" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i} {i === 1 ? "hora" : "horas"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={minutes} onValueChange={setMinutes}>
                  <SelectTrigger>
                    <SelectValue placeholder="Minutos" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min) => (
                      <SelectItem key={min} value={min.toString()}>
                        {min} {min === 1 ? "minuto" : "minutos"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={!title.trim()}>
            Adicionar Tarefa
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;
