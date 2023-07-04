export interface ITodo {
    id: string, 
    title: string, 
    status: string,
    createdAt: number,
    deletedAt: number | null
}

export interface ICard {
  title: string;
  status: string;
  value: string;
}