import { IBoard } from "@/types/types";

export const initialBoard: IBoard = {
  columns: [
    {
      id: "column-1",
      title: "Por hacer",
      tasks: [],
    },
    {
      id: "column-2",
      title: "En curso",
      tasks: [],
    },
    {
      id: "column-3",
      title: "Finalizada",
      tasks: [],
    },
  ],
};
