import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Dayjs } from "dayjs";
interface ITodo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  date: Dayjs | null;
}
interface ITodoList {
  todoList: ITodo[];
  tempTodoList: ITodo[];
}
const initialState: ITodoList = {
  todoList: [],
  tempTodoList: [],
};
export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodoList: (state, action: PayloadAction<ITodo[]>) => {
      state.todoList = action.payload;
    },
    setTempTodoList: (state, action: PayloadAction<ITodo[]>) => {
      state.tempTodoList = action.payload;
    },
  },
});
export const { setTodoList, setTempTodoList } = todoSlice.actions;
export const selectTodoList = (state: any) => state.todo.todoList;
export const selectTempTodoList = (state: any) => state.todo.tempTodoList;
export default todoSlice.reducer;
