"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  SunIcon,
  MoonIcon,
  Pencil,
  Trash,
  PlusCircle,
  MoreVertical,
  FolderOpen,
} from "lucide-react";
import Card from "@/components/molecules/Card";
import { IColumn, IProject } from "@/types/types";
import { initialProject } from "@/lib/constanst";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import Footer from "./Footer";

const Home = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState("");
  const [readyBoard, setReadyBoard] = useState(false);
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  useEffect(() => {
    const savedProjects = localStorage.getItem("HelmsmanTaskProjects");
    const savedCurrentProjectId = localStorage.getItem("HelmsmanTaskCurrentProjectId");
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      setProjects(projects);
    } else {
      setProjects([initialProject]);
    }
    if (savedCurrentProjectId !== null) {
      setCurrentProjectId(savedCurrentProjectId);
    } else {
      setCurrentProjectId(initialProject?.id);
    }
    setLoading(false);
    setReadyBoard(true);
  }, []);

  useEffect(() => {
    if (readyBoard) {
      localStorage.setItem("HelmsmanTaskProjects", JSON.stringify(projects));
      localStorage.setItem("HelmsmanTaskCurrentProjectId", currentProjectId);
    }
  }, [projects, currentProjectId, readyBoard]);

  useEffect(() => {
    if (theme) {
      setChecked(theme === "dark");
    }
  }, [theme]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newProjects = JSON.parse(JSON.stringify(projects)) as IProject[];
    const projectIndex = newProjects.findIndex((p) => p.id === currentProjectId);
    const sourceColumn = newProjects[projectIndex].columns.find(
      (col) => col.id === source.droppableId,
    );
    const destColumn = newProjects[projectIndex].columns.find(
      (col) => col.id === destination.droppableId,
    );

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = Array.from(sourceColumn.tasks);
    const destTasks =
      source.droppableId === destination.droppableId ? sourceTasks : Array.from(destColumn.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    destTasks.splice(destination.index, 0, movedTask);

    if (source.droppableId === destination.droppableId) {
      sourceColumn.tasks = destTasks;
    } else {
      sourceColumn.tasks = sourceTasks;
      destColumn.tasks = destTasks;
    }

    setProjects(newProjects);
  };

  const addColumn = () => {
    const newColumn: IColumn = {
      id: uuidv4(),
      title: "Nueva",
      tasks: [],
    };
    const newProjects = projects.map((project) =>
      project.id === currentProjectId
        ? { ...project, columns: [...project.columns, newColumn] }
        : project,
    );
    setProjects(newProjects);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const startEditingProject = () => {
    setEditedProjectName(currentProject.name);
    setIsEditProjectModalOpen(true);
  };

  const deleteProject = () => {
    // if (projects.length === 1) return;
    const newProjects = projects.filter((project) => project.id !== currentProjectId);
    toast({
      description: `${currentProject.name}: se eliminó correctamente.`,
    });
    setProjects(newProjects);
    if (newProjects.length > 0) {
      setCurrentProjectId(newProjects[0].id);
    } else {
      setCurrentProjectId("");
    }
    setIsDeleteProjectDialogOpen(false);
  };

  const confirmDeleteProject = () => {
    setIsDeleteProjectDialogOpen(true);
  };

  const createNewProject = () => {
    if (newProjectName.trim() === "") return;
    const newProject: IProject = {
      id: uuidv4(),
      name: newProjectName,
      columns: [
        { id: uuidv4(), title: "Por hacer", tasks: [] },
        { id: uuidv4(), title: "En curso", tasks: [] },
        { id: uuidv4(), title: "Finalizada", tasks: [] },
      ],
    };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
    setIsNewProjectModalOpen(false);
    setNewProjectName("");
  };

  const saveProjectEdit = () => {
    if (editedProjectName.trim() === "") return;
    const newProjects = projects.map((project) =>
      project.id === currentProjectId ? { ...project, name: editedProjectName } : project,
    );
    setProjects(newProjects);
    setIsEditProjectModalOpen(false);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] flex-col bg-background p-8 text-foreground">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">HelmsmanTask</h1>
        <div className="hidden items-center space-x-2 md:flex">
          <SunIcon className="h-4 w-4" />
          <Switch checked={checked} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
          <MoonIcon className="h-4 w-4" />
        </div>
      </div>
      <div className="mb-12 hidden items-center justify-between border-b border-border pb-6 md:flex">
        <div className="flex items-center gap-8">
          <h2 className="text-xl font-semibold">
            {!loading ? (currentProject ? currentProject.name : "Crear nuevo proyecto") : ""}
          </h2>
          {currentProject && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={startEditingProject}>
                  <Pencil className="mr-2 h-3 w-3" />
                  Renombrar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={confirmDeleteProject}>
                  <Trash className="mr-2 h-3 w-3" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center gap-4">
          {currentProjectId && (
            <div className="flex items-center gap-4">
              <span>Seleccione un proyecto:</span>
              <Select value={currentProjectId} onValueChange={setCurrentProjectId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={() => setIsNewProjectModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>
      {currentProject && (
        <div className="flex w-full items-center justify-center">
          <ScrollArea className="w-[1376px] whitespace-nowrap pb-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex flex-col gap-4 overflow-x-auto pb-4 md:flex-row [&>div:last-of-type]:w-max">
                {currentProject.columns.map((column) => (
                  <Card
                    key={column.id}
                    column={column}
                    setProjects={setProjects}
                    projects={projects}
                    currentProjectId={currentProjectId}
                  />
                ))}
                <div className="w-80 flex-shrink-0">
                  <Button className="h-16 w-16" variant="outline" onClick={addColumn}>
                    <PlusIcon className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </DragDropContext>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
      {!loading && !currentProject && (
        <div className="my-auto flex flex-col items-center justify-center gap-4">
          <FolderOpen className="h-32 w-32" />
          <p className="text-xl">Aún no tienes proyectos. Crea uno nuevo.</p>
        </div>
      )}
      <Dialog open={isNewProjectModalOpen} onOpenChange={setIsNewProjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Crear nuevo proyecto</DialogTitle>
            <DialogDescription>Ingrese un nombre para su nuevo proyecto.</DialogDescription>
          </DialogHeader>
          <Input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nombre del proyecto"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsNewProjectModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={createNewProject}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Renombrar proyecto</DialogTitle>
            <DialogDescription>Cambie el nombre de su proyecto.</DialogDescription>
          </DialogHeader>
          <Input
            value={editedProjectName}
            onChange={(e) => setEditedProjectName(e.target.value)}
            placeholder="Nombre del proyecto"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditProjectModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveProjectEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteProjectDialogOpen} onOpenChange={setIsDeleteProjectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que quiere eliminar este proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y todas
              sus tareas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProject}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </main>
  );
};

export default Home;
