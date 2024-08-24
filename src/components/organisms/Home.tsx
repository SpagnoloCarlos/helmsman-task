"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Card from "@/components/molecules/Card";
import { IBoard, IColumn } from "@/types/types";
import { initialBoard } from "@/lib/constanst";

const Home = () => {
  const [board, setBoard] = useState<IBoard>(initialBoard);
  const [readyBoard, setReadyBoard] = useState(false);

  useEffect(() => {
    const savedBoard = localStorage?.getItem("HelmsmanTaskBoard");
    if (savedBoard) {
      setBoard(JSON.parse(savedBoard));
    }
    setReadyBoard(true);
  }, []);

  useEffect(() => {
    if (readyBoard && board) {
      console.log("entra");
      localStorage.setItem("HelmsmanTaskBoard", JSON.stringify(board));
    }
  }, [board, readyBoard]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Timonel</h1>
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
