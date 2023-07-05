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
  draggedItem: ITodo | null = null;
  cards: ICard[] = [
    { title: 'Backlog', status: 'backlog', value: '' },
  { title: 'To Do', status: 'to-do', value: '' },
  { title: 'In progress', status: 'doing', value: '' },
  { title: 'Test', status: 'testing', value: '' },
  { title: 'Done', status: 'done', value: '' },];

  constructor() {
    makeAutoObservable(this);
  }

  handleChange = (index: number, value: string) => {
    todoStore.cards = todoStore.cards.map((card, i) => {
      if (i === index) {
        return { ...card, value };
      }
      return card;
    });
  };

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
  
  removeTodo = (id: string): void => {
    this.todos = this.todos.filter(todo => todo.id !== id)
  };
}

const todoStore = new TodoStore();

export default todoStore;

