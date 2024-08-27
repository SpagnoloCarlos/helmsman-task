import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, PencilIcon, MoreVertical, Trash } from "lucide-react";
import { Card as CardUI, CardContent } from "../ui/card";
import { v4 as uuidv4 } from "uuid";
import { IColumn, IProject, ITask } from "@/types/types";
import Task from "@/components/atoms/Task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

interface ICardProps {
  column: IColumn;
  setProjects: React.Dispatch<React.SetStateAction<Array<IProject>>>;
  projects: Array<IProject>;
  currentProjectId: string;
}

const Card: React.FC<ICardProps> = ({ column, setProjects, projects, currentProjectId }) => {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState<string>(column.title);
  const [newTaskContent, setNewTaskContent] = useState<string>("");
  const { toast } = useToast();

  const addTask = () => {
    if (newTaskContent.trim() === "") return;
    const newTask: ITask = { id: uuidv4(), content: newTaskContent };
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? {
            ...project,
            columns: project.columns.map((col) =>
              col.id === column.id ? { ...col, tasks: [...col.tasks, newTask] } : col,
            ),
          }
        : project,
    );
    setProjects(newProjects);
    setNewTaskContent("");
  };

  const startEditingColumn = () => {
    setEditingColumn(column.id);
  };

  const saveColumnTitle = () => {
    if (newColumnTitle.trim() === "") return;
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? {
            ...project,
            columns: project.columns.map((col) =>
              col.id === column.id ? { ...col, title: newColumnTitle } : col,
            ),
          }
        : project,
    );
    setProjects(newProjects);
    setEditingColumn(null);
    setNewColumnTitle("");
  };

  const deleteColumn = () => {
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? { ...project, columns: project.columns.filter((col) => col.id !== column.id) }
        : project,
    );
    toast({
      description: `${column.title}: se eliminó correctamente.`,
    });
    setProjects(newProjects);
  };

  return (
    <div className="w-full shrink-0 md:w-80">
      <CardUI className="bg-card p-4 text-card-foreground">
        <CardContent className="p-0">
          <div className="mb-4 flex items-center justify-between">
            {editingColumn === column.id ? (
              <>
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  className="mr-2"
                  autoFocus
                />
                <Button variant="outline" size="sm" onClick={saveColumnTitle}>
                  <SaveIcon className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{column.title}</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={startEditingColumn}>
                      <PencilIcon className="mr-2 h-3 w-3" />
                      Renombrar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={deleteColumn}>
                      <Trash className="mr-2 h-3 w-3" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-4 ${snapshot.isDraggingOver ? "bg-accent/50" : ""}`}
              >
                {column.tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    projects={projects}
                    setProjects={setProjects}
                    currentProjectId={currentProjectId}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="mt-2">
            <Input
              placeholder="Agregar tarea"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <Button className="mt-2 w-full" onClick={addTask}>
              Agregar tarea
            </Button>
          </div>
        </CardContent>
      </CardUI>
    </div>
  );
};

export default Card;
