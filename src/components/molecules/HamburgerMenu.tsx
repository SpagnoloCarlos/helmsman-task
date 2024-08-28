import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Menu, MoreVertical, Pencil, PlusCircle, Trash } from "lucide-react";
import { IProject } from "@/types/types";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import ThemeSwitch from "../atoms/ThemeSwitch";

interface IHamburgerMenu {
  className?: string;
  projects: Array<IProject>;
  currentProject: IProject;
  currentProjectId: string;
  setCurrentProjectId: Dispatch<SetStateAction<string>>;
  setIsNewProjectModalOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  startEditingProject: () => void;
  confirmDeleteProject: () => void;
}

const HamburgerMenu = ({
  className = "",
  currentProject,
  startEditingProject,
  confirmDeleteProject,
  currentProjectId,
  setCurrentProjectId,
  setIsNewProjectModalOpen,
  projects,
  loading,
}: IHamburgerMenu) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="mb-2 mt-4">
            <SheetTitle className="text-left text-xl text-primary">Gestión de proyectos</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            {!loading && currentProject && (
              <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
                <h2 className="">{currentProject.name}</h2>
                {currentProject && (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        startEditingProject();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Pencil className="mr-2 h-3 w-3" />
                      Renombrar
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        confirmDeleteProject();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Trash className="mr-2 h-3 w-3" />
                      Eliminar
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsNewProjectModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nuevo proyecto
                    </Button>
                  </div>
                )}
              </div>
            )}
            {!loading && !currentProject && (
              <div className="flex flex-col gap-4 rounded-2xl border border-border p-4">
                <span>Crear nuevo proyecto</span>
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsNewProjectModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo proyecto
                </Button>
              </div>
            )}
            {currentProjectId && (
              <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                <span>Seleccione un proyecto:</span>
                <Select value={currentProjectId} onValueChange={setCurrentProjectId}>
                  <SelectTrigger>
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
          </div>
          <SheetFooter className="mt-auto">
            <ThemeSwitch className="justify-end" />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburgerMenu;
