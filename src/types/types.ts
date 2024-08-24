export interface ITask {
  id: string;
  content: string;
  description?: string;
}

export interface IColumn {
  id: string;
  title: string;
  tasks: ITask[];
}

export interface IBoard {
  columns: IColumn[];
}
