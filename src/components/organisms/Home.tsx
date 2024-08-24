"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { PlusIcon, SunIcon, MoonIcon } from "lucide-react";
import Card from "@/components/molecules/Card";
import { IBoard, IColumn } from "@/types/types";
import { initialBoard } from "@/lib/constanst";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const Home = () => {
  const [board, setBoard] = useState<IBoard>(initialBoard);
  const [readyBoard, setReadyBoard] = useState(false);
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedBoard = localStorage?.getItem("HelmsmanTaskBoard");
    if (savedBoard) {
      setBoard(JSON.parse(savedBoard));
    }
    setReadyBoard(true);
  }, []);

  useEffect(() => {
    if (readyBoard && board) {
      localStorage.setItem("HelmsmanTaskBoard", JSON.stringify(board));
    }
  }, [board, readyBoard]);

  useEffect(() => {
    if (theme) {
      setChecked(theme === "dark");
    }
  }, [theme]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newBoard = JSON.parse(JSON.stringify(board)) as IBoard;
    const sourceColumn = newBoard.columns.find((col) => col.id === source.droppableId);
    const destColumn = newBoard.columns.find((col) => col.id === destination.droppableId);

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

    setBoard(newBoard);
  };

  const addColumn = () => {
    const newColumn: IColumn = {
      id: uuidv4(),
      title: "Nuevo estado",
      tasks: [],
    };
    setBoard({ ...board, columns: [...board.columns, newColumn] });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">HelmsmanTask</h1>
        <div className="flex items-center space-x-2">
          <SunIcon className="h-4 w-4" />
          <Switch checked={checked} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
          <MoonIcon className="h-4 w-4" />
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 [&>div:last-of-type]:w-max">
          {board.columns.map((column) => (
            <Card key={column.id} column={column} setBoard={setBoard} board={board} />
          ))}
          <div className="w-80 flex-shrink-0">
            <Button className="h-16 w-16" variant="outline" onClick={addColumn}>
              <PlusIcon className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
