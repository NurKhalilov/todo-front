import { TodoItem } from "./TodoItem";
import { Card, Row, Col, Button, Input } from 'antd';
import { observer } from "mobx-react";
import todoStore from "../types/TodoStore";
import { io, Socket } from 'socket.io-client';
import { useEffect } from "react";

const socket: Socket = io('http://localhost:5000');

const TodoList: React.FC = observer(() => {

    useEffect(() => {
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  // Clean up function
  return () => {
    socket.disconnect();
  };
}, []);

    return <div onPointerMove={todoStore.handlePointerMove}>
        <Row gutter={[16, 16]} className="container mx-auto p-2">
            {todoStore.cards.map((card, index) => (
          <Col span={4} key={card.status}>
            <Card
              title={card.title}
              className="card bg-blue-300 border-blue-700"
              onPointerUp={(event) => todoStore.handlePointerUp(event, card.status)}
            >
              {todoStore.todos
                .filter((item) => item.status === card.status)
                .map((todo) => (
                  <TodoItem key={todo.id} {...todo} handlePointerDown={todoStore.handlePointerDown} removeTodo={todoStore.removeTodo}  />
                ))}
              
              <Input type="text"
                onChange={(e) => todoStore.handleChange(index, e.target.value)}
                className='mt-2'
                placeholder='Write a task'
                value={card.value} />
              <Button type="ghost" className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold mt-2 rounded" onClick={()=>todoStore.addTodo(card.status, card.value)}>Add task</Button>
              
            </Card>
          </Col>
        ))}
        </Row>
    </div>
})

export {TodoList}