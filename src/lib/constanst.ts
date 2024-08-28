import { IProject } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

export const initialProject: IProject = {
  id: uuidv4(),
  name: "Nuevo proyecto",
  columns: [
    {
      id: uuidv4(),
      title: "Por hacer",
      tasks: [],
    },
    {
      id: uuidv4(),
      title: "En curso",
      tasks: [],
    },
    {
      id: uuidv4(),
      title: "Finalizada",
      tasks: [],
    },
  ],
};
