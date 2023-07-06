import { makeAutoObservable, observable, action } from "mobx";
import { nanoid } from "nanoid";
import axios from 'axios';


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
      fetchData: action.bound,
    });
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

      axios.post("http://127.0.0.1:5000/todos", data)
      .then(res => console.log(res.data))

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
        try {
          await axios.put(`http://127.0.0.1:5000/todos/${todoStore.draggedItem!.id}`, { status })
          .then(res => console.log(res.data));
          // Assuming your API endpoint for updating a todo item is '/todos/:id'
          // Replace it with the actual endpoint in your API
          console.log('Todo item status updated successfully.');
        } catch (error) {
          console.error('Error updating todo item status:', error);
          // Handle error case
        }
      }
      todoStore.draggedItem = null;

      
    }
  };

  fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/todos");
      this.todos = response.data.data;
      console.log(this.todos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  removeTodo = (id: string): void => {
    this.todos = this.todos.filter(todo => todo.id !== id)
  };
}

const todoStore = new TodoStore();

export default todoStore;

