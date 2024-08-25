import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, PencilIcon, Trash, GripVertical, MoreVertical, Plus } from "lucide-react";
import { IProject, ITask } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";

interface ITaskProps {
  task: ITask;
  columnId: string;
  setProjects: React.Dispatch<React.SetStateAction<Array<IProject>>>;
  projects: Array<IProject>;
  currentProjectId: string;
  index: number;
}

const Task: React.FC<ITaskProps> = ({
  task,
  columnId,
  setProjects,
  projects,
  currentProjectId,
  index,
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const { toast } = useToast();

  const startEditingTask = () => {
    setEditingTask(task.id);
    setEditedTaskContent(task.content);
  };

  const saveTaskEdit = () => {
    if (editedTaskContent.trim() === "") return;
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? {
            ...project,
            columns: project.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    tasks: col.tasks.map((t) =>
                      t.id === task.id ? { ...t, content: editedTaskContent } : t,
                    ),
                  }
                : col,
            ),
          }
        : project,
    );
    setProjects(newProjects);
    setEditingTask(null);
    setEditedTaskContent("");
  };

  const deleteTask = () => {
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? {
            ...project,
            columns: project.columns.map((col) =>
              col.id === columnId
                ? { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) }
                : col,
            ),
          }
        : project,
    );
    toast({
      description: `${task.content}: se eliminó correctamente.`,
    });
    setProjects(newProjects);
  };

  const openDescriptionModal = () => {
    setIsDescriptionModalOpen(true);
  };

  const saveDescription = () => {
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? {
            ...project,
            columns: project.columns.map((col) =>
              col.id === columnId
                ? {
                    ...col,
                    tasks: col.tasks.map((t) =>
                      t.id === task.id ? { ...t, description: taskDescription } : t,
                    ),
                  }
                : col,
            ),
          }
        : project,
    );
    setProjects(newProjects);
    setIsDescriptionModalOpen(false);
  };

  return (
    <>
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-2 rounded border border-border bg-background p-2 shadow-sm ${
              snapshot.isDragging ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              {editingTask === task.id ? (
                <div className="flex w-full items-center">
                  <Input
                    value={editedTaskContent}
                    onChange={(e) => setEditedTaskContent(e.target.value)}
                    className="mr-2 flex-grow"
                    autoFocus
                  />
                  <Button variant="outline" size="sm" onClick={saveTaskEdit}>
                    <SaveIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <>
                    <div className="flex flex-grow items-center space-x-2">
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
                      </div>
                      <label htmlFor={task.id} className="flex-grow text-foreground">
                        {task.content}
                      </label>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={startEditingTask}>
                          <PencilIcon className="mr-2 h-3 w-3" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={deleteTask}>
                          <Trash className="mr-2 h-3 w-3" />
                          Eliminar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={openDescriptionModal}>
                          <Plus className="mr-2 h-3 w-3" />
                          {task.description ? "Editar" : "Agregar"} descripción
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                </>
              )}
            </div>
            {task.description && (
              <ScrollArea className="h-16">
                <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
              </ScrollArea>
            )}
          </div>
        )}
      </Draggable>
      <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Descripción - {task.content}</DialogTitle>
            <DialogDescription>Agrega una descripción para esta tarea.</DialogDescription>
          </DialogHeader>
          <Textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Ingrese la descripción de la tarea"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDescriptionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveDescription}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Task;
