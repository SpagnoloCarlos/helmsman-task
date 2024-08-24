import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SaveIcon, PencilIcon, XIcon, GripVertical } from "lucide-react";
import { IBoard, ITask } from "@/types/types";

interface ITaskProps {
  task: ITask;
  columnId: string;
  setBoard: React.Dispatch<React.SetStateAction<IBoard>>;
  board: IBoard;
  index: number;
}

const Task: React.FC<ITaskProps> = ({ task, columnId, setBoard, board, index }) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTaskContent, setEditedTaskContent] = useState<string>("");

  const startEditingTask = () => {
    setEditingTask(task.id);
    setEditedTaskContent(task.content);
  };

  const saveTaskEdit = () => {
    if (editedTaskContent.trim() === "") return;
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((t) =>
                t.id === task.id ? { ...t, content: editedTaskContent } : t,
              ),
            }
          : col,
      ),
    };
    setBoard(newBoard);
    setEditingTask(null);
    setEditedTaskContent("");
  };

  const deleteTask = () => {
    const newBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) } : col,
      ),
    };
    setBoard(newBoard);
  };

  return (
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
                <Button variant="outline" size="sm" onClick={saveTaskEdit}>
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
                  <Button variant="ghost" size="sm" onClick={startEditingTask}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={deleteTask}>
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
