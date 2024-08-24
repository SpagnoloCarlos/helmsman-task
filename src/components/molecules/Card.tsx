import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIcon, PencilIcon, XIcon } from "lucide-react";
import { Card as CardUI, CardContent } from "../ui/card";
import { v4 as uuidv4 } from "uuid";
import { IBoard, IColumn, ITask } from "@/types/types";
import Task from "@/components/atoms/Task";

interface ICardProps {
  column: IColumn;
  board: IBoard;
  setBoard: React.Dispatch<React.SetStateAction<IBoard>>;
}

const Card: React.FC<ICardProps> = ({ column, board, setBoard }) => {
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState<string>(column.title);
  const [newTaskContent, setNewTaskContent] = useState<string>("");

  const addTask = () => {
    if (newTaskContent.trim() === "") return;
    const newTask: ITask = { id: uuidv4(), content: newTaskContent };
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === column.id ? { ...col, tasks: [...col.tasks, newTask] } : col,
      ),
    };
    setBoard(newBoard);
    setNewTaskContent("");
  };

  const startEditingColumn = () => {
    setEditingColumn(column.id);
  };

  const saveColumnTitle = () => {
    if (newColumnTitle.trim() === "") return;
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === column.id ? { ...col, title: newColumnTitle } : col,
      ),
    };
    setBoard(newBoard);
    setEditingColumn(null);
  };

  const deleteColumn = () => {
    const newBoard = {
      ...board,
      columns: board.columns.filter((col) => col.id !== column.id),
    };
    setBoard(newBoard);
  };

  return (
    <div className="w-80 flex-shrink-0">
      <CardUI className="bg-white p-4">
        <CardContent className="p-0">
          {editingColumn === column.id ? (
            <div className="mb-2 flex items-center">
              <Input
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="mr-2"
                autoFocus
              />
              <Button variant="outline" size="sm" onClick={saveColumnTitle}>
                <SaveIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{column.title}</h2>
              <div>
                <Button variant="ghost" size="sm" onClick={startEditingColumn}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={deleteColumn}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[100px] ${snapshot.isDraggingOver ? "bg-gray-100" : ""}`}
              >
                {column.tasks.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    columnId={column.id}
                    setBoard={setBoard}
                    board={board}
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
