import {useState} from 'react';
import { TodoItem } from "./TodoItem";
import { ITodo, ICard } from "../types/data";
import {nanoid} from 'nanoid';
import { Card, Row, Col, Button, Input } from 'antd';


const TodoList: React.FC = () => {
    const [cards, setCards] = useState<ICard[]>(
        [
            { title: 'Backlog', status: 'backlog', value: '' },
            { title: 'To Do', status: 'to-do', value: '' },
            { title: 'Doing', status: 'doing', value: '' },
            { title: 'Testing', status: 'testing', value: '' },
            { title: 'Done', status: 'done', value: '' },
        ]
    )
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [draggedItem, setDraggedItem] = useState<ITodo | null>(null);
    
    const handleChange = (index: number, value: string) => {
        setCards((prevCards) =>
        prevCards.map((card, i) => {
            if (i === index) {
            return { ...card, value };
            }
            return card;
        })
        );
    };

  const addTodo = (status: string, value: string) => {
    if (value) {
      setTodos([
        ...todos,
        {
          id: nanoid(),
          title: value,
          status: status,
          createdAt: Date.now(),
          deletedAt: null,
        },
      ]);
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.status === status) {
            return { ...card, value: '' };
          }
          return card;
        })
      );
    }
  };


  const handlePointerDown = (
    event: React.PointerEvent,
    item: ITodo,
    status: string
  ) => {
    event.stopPropagation();
    setDraggedItem({ ...item, status });
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    event.preventDefault();
  };

  const handlePointerUp = (event: React.PointerEvent, status: string) => {
    event.stopPropagation();
    if (draggedItem) {
      const updatedItems = todos.map((item) => {
        if (item.id === draggedItem.id) {
          return { ...item, status };
        }
        return item;
      });
      setTodos(updatedItems);
      setDraggedItem(null);
    }
  };

    return <div onPointerMove={handlePointerMove}>
        <Row gutter={[16, 16]} className="container mx-auto p-2">
            {cards.map((card, index) => (
          <Col span={4} key={card.status}>
            <Card
              title={card.title}
              className="card bg-slate-200"
              onPointerUp={(event) => handlePointerUp(event, card.status)}
            >
              {todos
                .filter((item) => item.status === card.status)
                .map((todo) => (
                  <TodoItem key={todo.id} {...todo} handlePointerDown={handlePointerDown} />
                ))}
              
              <Input type="text"
                onChange={(e) => handleChange(index, e.target.value)}
                className='mt-2'
                placeholder='Write a task'
                value={card.value} />
              <Button type="primary" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 rounded" onClick={() => addTodo(card.status, card.value)}>Add task</Button>
              
            </Card>
          </Col>
        ))}
        </Row>
    </div>
}

export {TodoList}