import { TodoItem } from "./TodoItem";
import { Card, Row, Col, Button, Input } from 'antd';
import { observer } from "mobx-react";
import todoStore from "../types/TodoStore";
import { ITodo } from "../types/data";
import { useEffect } from "react";


const TestList: React.FC = observer(() => {


    useEffect(() => {
      todoStore.fetchData();
    }, []);




    return <div onPointerMove={todoStore.handlePointerMove}>
        <Row gutter={[16, 16]} className="container mx-auto p-2">
            {todoStore.cards.map((card, index) => (
          <Col span={4} key={card.status}>
            <Card
              title={card.title}
              className="card bg-sky-500"
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
              <Button type="primary" className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 rounded" onClick={()=>todoStore.addTodo(card.status, card.value)}>Add task</Button>
              
            </Card>
          </Col>
        ))}
        </Row>
    </div>
})

export {TestList}