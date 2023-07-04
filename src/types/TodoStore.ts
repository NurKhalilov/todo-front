import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

export interface ITodo {
  id: string;
  title: string;
  status: string;
  createdAt: number;
  deletedAt: number | null;
}

export interface ICard {
  title: string;
  status: string;
  value: string;
}

class TodoStore {
  todos: ITodo[] = [];
  cards: ICard[] = [
    { title: 'Backlog', status: 'backlog', value: '' },
  { title: 'To Do', status: 'to-do', value: '' },
  { title: 'In progress', status: 'doing', value: '' },
  { title: 'Test', status: 'testing', value: '' },
  { title: 'Done', status: 'done', value: '' },];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo = (status: string, value: string) => {
    if (value) {
      this.todos.push({
        id: nanoid(),
        title: value,
        status: status,
        createdAt: Date.now(),
        deletedAt: null,
      });

      this.cards = this.cards.map((card) => {
        if (card.status === status) {
          return { ...card, value: "" };
        }
        return card;
      });
    }
  };
}

const todoStore = new TodoStore();

export default todoStore;

