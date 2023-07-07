import { makeAutoObservable, observable } from "mobx";
import { nanoid } from "nanoid";
import { io } from "socket.io-client";

class Todo {
  id: string;
  title: string;
  status: string;
  createdAt: number;
  deletedAt: number | null;

  constructor(id: string, title: string, status: string, createdAt: number, deletedAt: number | null) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    makeAutoObservable(this);
  }
}

export interface ICard {
  title: string;
  status: string;
  value: string;
}

const socket = io('http://127.0.0.1:5000')

class TodoStore {
  todos: Todo[] = [];
  draggedItem: Todo | null = null;
  cards: ICard[] = [
    { title: 'Backlog', status: 'backlog', value: '' },
  { title: 'To Do', status: 'to-do', value: '' },
  { title: 'In progress', status: 'doing', value: '' },
  { title: 'Test', status: 'testing', value: '' },
  { title: 'Done', status: 'done', value: '' },];

  constructor() {
    makeAutoObservable(this, {
      todos: observable,
    });
    this.subscribeToTasks()
  }

  subscribeToTasks() {
    socket.on("tasks_list", (data: any) => {
      this.todos = data.data;
    });

    socket.emit("tasks:subscribe")
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
      let data = {
        id: nanoid(),
        title: value,
        status: status,
        createdAt: Date.now(),
        deletedAt: null,
      }
      this.todos.push(data);

      socket.emit("add_task", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });

      socket.emit('tasks:subscribe');

      this.cards = this.cards.map((card) => {
        if (card.status === status) {
          return { ...card, value: "" };
        }
        return card;
      });
    }
  };

  handlePointerDown = (
    event: React.PointerEvent,
    item: Todo,
    status: string
  ) => {
    event.stopPropagation();
    todoStore.draggedItem = { ...item, status };
  };

  handlePointerMove = (event: React.PointerEvent) => {
    event.preventDefault();
  };

  handlePointerUp = async (event: React.PointerEvent, status: string) => {
    event.stopPropagation();
    if (todoStore.draggedItem) {
      const updatedItems = todoStore.todos.map((item) => {
        if (item.id === todoStore.draggedItem!.id) {
          return { ...item, status };
        }
        return item;
      });
      todoStore.todos = updatedItems;
      if(todoStore.draggedItem!.id !== null) {

        socket.emit("update_task", {id: todoStore.draggedItem!.id, status: status}, {
          headers: {
            "Content-Type": "application/json"
          }
        });
    
          socket.emit('tasks:subscribe');
      }
      todoStore.draggedItem = null;

      
    }
  };



  
  removeTodo = (id: string): void => {
    this.todos = this.todos.filter(todo => todo.id !== id);
    socket.emit("delete_task", {id: id}, {headers: {
      "Content-Type": "application/json"
    }});

    socket.emit('tasks:subscribe');
  };
}

const todoStore = new TodoStore();

export default todoStore;

