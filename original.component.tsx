/*----------------------------------------
  Original component by V0.dev + chatGPT 
  used as a reference
  https://v0.dev/chat/xc7Qca0gC3t
-----------------------------------------*/

"use client";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, XIcon, PencilIcon, SaveIcon, GripVertical } from "lucide-react";

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  columns: Column[];
}

const initialBoard: Board = {
  columns: [
    {
      id: "column-1",
      title: "Por hacer",
      tasks: [
        { id: "task-1", content: "Task 1" },
        { id: "task-2", content: "Task 2" },
      ],
    },
    {
      id: "column-2",
      title: "En curso",
      tasks: [{ id: "task-3", content: "Task 3" }],
    },
    {
      id: "column-3",
      title: "Finalizada",
      tasks: [{ id: "task-4", content: "Task 4" }],
    },
  ],
};

export default function HelmsmanTask() {
  const savedBoard = localStorage?.getItem("HelmsmanTaskBoard");
  const [board, setBoard] = useState<Board>(savedBoard ? JSON.parse(savedBoard) : initialBoard);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState<string>("");
  const [newTaskContents, setNewTaskContents] = useState<{ [key: string]: string }>({});
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("HelmsmanTaskBoard", JSON.stringify(board));
  }, [board]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newBoard = JSON.parse(JSON.stringify(board)) as Board;
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

  const addTask = (columnId: string) => {
    const newTaskContent = newTaskContents[columnId] || "";
    if (newTaskContent.trim() === "") return;
    const newTask: Task = { id: uuidv4(), content: newTaskContent };
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col,
      ),
    };
    setBoard(newBoard);
    setNewTaskContents({ ...newTaskContents, [columnId]: "" });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col,
      ),
    };
    setBoard(newBoard);
  };

  const startEditingTask = (taskContent: string) => {
    setEditedTaskContent(taskContent);
  };

  const saveTaskEdit = (columnId: string, taskId: string) => {
    if (editedTaskContent.trim() === "") return;
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? { ...task, content: editedTaskContent } : task,
              ),
            }
          : col,
      ),
    };
    setBoard(newBoard);
    setEditingTask(null);
    setEditedTaskContent("");
  };

  const startEditingColumn = (columnId: string, currentTitle: string) => {
    setEditingColumn(columnId);
    setNewColumnTitle(currentTitle);
  };

  const saveColumnTitle = (columnId: string) => {
    if (newColumnTitle.trim() === "") return;
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, title: newColumnTitle } : col,
      ),
    };
    setBoard(newBoard);
    setEditingColumn(null);
    setNewColumnTitle("");
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: uuidv4(),
      title: "New Column",
      tasks: [],
    };
    setBoard({ ...board, columns: [...board.columns, newColumn] });
  };

  const deleteColumn = (columnId: string) => {
    const newBoard = {
      ...board,
      columns: board.columns.filter((col) => col.id !== columnId),
    };
    setBoard(newBoard);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="mb-4 text-2xl font-bold">Helmsman Task</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 [&>div:last-of-type]:w-max">
          {board.columns.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <Card className="bg-white p-4">
                <CardContent className="p-0">
                  {editingColumn === column.id ? (
                    <div className="mb-2 flex items-center">
                      <Input
                        value={newColumnTitle}
                        onChange={(e) => setNewColumnTitle(e.target.value)}
                        className="mr-2"
                        autoFocus
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveColumnTitle(column.id)}
                      >
                        <SaveIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mb-2 flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{column.title}</h2>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingColumn(column.id, column.title)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteColumn(column.id)}>
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
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`mb-2 rounded bg-gray-100 p-2 shadow-sm ${
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
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => saveTaskEdit(column.id, task.id)}
                                      >
                                        <SaveIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex flex-grow items-center space-x-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-4 w-4 cursor-move text-gray-400" />
                                        </div>
                                        <Checkbox id={task.id} />
                                        <label htmlFor={task.id} className="flex-grow">
                                          {task.content}
                                        </label>
                                      </div>
                                      <div className="flex items-center">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setEditingTask(task.id);
                                            startEditingTask(task.content);
                                          }}
                                        >
                                          <PencilIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteTask(column.id, task.id)}
                                        >
                                          <XIcon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <div className="mt-2">
                    <Input
                      placeholder="Agregar tarea"
                      value={newTaskContents[column.id] || ""}
                      onChange={(e) =>
                        setNewTaskContents({ ...newTaskContents, [column.id]: e.target.value })
                      }
                      onKeyPress={(e) => e.key === "Enter" && addTask(column.id)}
                    />
                    <Button className="mt-2 w-full" onClick={() => addTask(column.id)}>
                      Agregar tarea
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
}
