import {useState} from 'react';
import { ITodo } from '../types/data';
import { TodoList } from './TodoList';
import {nanoid} from 'nanoid';

const App: React.FC = () => {
    return <TodoList />
}

export {App}