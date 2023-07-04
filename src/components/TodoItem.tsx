import { ITodo } from "../types/data";
import { Card, Row, Col, Avatar, Button } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";

const {Meta} = Card;

interface ITodoItem extends ITodo {
    handlePointerDown: (event: React.PointerEvent<HTMLDivElement>, item: ITodo, status: string) => void;
}

const TodoItem: React.FC<ITodoItem> = (props) => {
    const {id, title, handlePointerDown} = props;
    return <div>
            <Card
                key={id}
                draggable="true"
                onPointerDown={(event) => handlePointerDown(event, props, 'backlog')}
                className="cursor-pointer mt-2"
                type="inner"
                size="small"
                >
                <div className="flex justify-between items-center">
                    <h4>{title}</h4>
                    <Button type="text" icon={<DeleteOutlined style={{color: "red"}} />} />
                </div>
            </Card>
    </div>
}

export {TodoItem}