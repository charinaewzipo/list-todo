import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Checkbox,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import uuid from "react-uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { selectTempTodoList, selectTodoList, setTempTodoList, setTodoList } from "./app/todoSlice";
interface ITodo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  date: Dayjs | null;
}
type TFilter = "all" | "complete" | "incomplete" | "overdue";

function App() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [filter, setFilter] = useState<TFilter>("all");
  const [didMount, setDidMount] = useState(false);

  const todoList = useSelector(selectTodoList);
  const tempTodoList = useSelector(selectTempTodoList);
  useEffect(() => {
    //somehow localstorage not set listtodo
    setDidMount(true);
  }, []);

  useEffect(() => {
    if (didMount) {
      const storedListTodo = localStorage.getItem("listTodo");
      if (storedListTodo) {
        try {
          dispatch(setTodoList(JSON.parse(storedListTodo)));
          dispatch(setTempTodoList(JSON.parse(storedListTodo)));
        } catch (error) {
          console.error("Error parsing listTodo from local storage:", error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didMount]);

  useEffect(() => {
    if (Array.isArray(tempTodoList) && tempTodoList.length > 0) {
      localStorage.setItem("listTodo", JSON.stringify(tempTodoList));
    }
    console.log("tempTodoList:", tempTodoList);
  }, [tempTodoList]);

  useEffect(() => {
    if (isErrorMessage && title !== "") {
      setIsErrorMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    if (!Array.isArray(todoList)) return;

    switch (filter) {
      case "all":
        dispatch(setTodoList(tempTodoList));
        break;
      case "complete":
        dispatch(setTodoList(tempTodoList.filter((todo: ITodo) => todo.isCompleted === true)));
        break;
      case "incomplete":
        dispatch(setTodoList(tempTodoList.filter((todo: ITodo) => todo.isCompleted === false)));
        break;
      case "overdue":
        dispatch(
          setTodoList(
            tempTodoList.filter((todo: ITodo) => {
              if (todo.date && !todo.isCompleted) {
                return dayjs(todo.date).isBefore(dayjs(new Date()));
              }
              return false;
            })
          )
        );
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  const handleAddToDoList = () => {
    const objectTodo = {
      id: uuid(),
      title: title,
      description: description,
      isCompleted: false,
      date: dayjs(date).format("DD/MM/YYYY"),
    };
    if (title !== "") {
      dispatch(setTodoList([...todoList, objectTodo]));
      dispatch(setTempTodoList([...tempTodoList, objectTodo]));

      setTitle("");
      setDescription("");
      setDate(dayjs(new Date()));
    } else {
      setIsErrorMessage(true);
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as TFilter);
  };
  const handleDeleteTodo = (id: string) => {
    dispatch(setTodoList([...todoList.filter((todo: ITodo) => todo.id !== id)]));
    dispatch(setTempTodoList([...tempTodoList.filter((todo: ITodo) => todo.id !== id)]));
  };
  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const updateTodoList = todoList.map((todo: ITodo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: event.target.checked };
      } else {
        return todo;
      }
    });
    dispatch(setTodoList(updateTodoList));
    dispatch(setTempTodoList(updateTodoList));
  };
  return (
    <div
      className="w-[100vw] h-[100vh] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(111,129,230,1) 50%, rgba(69,73,252,0.7344187675070029) 100%)",
      }}
    >
      <Container>
        <div className="mx-auto w-[34rem]  bg-white p-4 rounded-lg z-20 border">
          <div className="flex flex-col gap-4">
            <p className="text-lg font-bold">To-Do List</p>
            <div className="flex items-center gap-2">
              <TextField
                id="outlined-controlled"
                error={isErrorMessage}
                helperText={isErrorMessage ? "Field is required" : ""}
                label="Title*"
                value={title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(event.target.value);
                }}
              />
              <TextField
                id="outlined-uncontrolled"
                label="Description"
                defaultValue=""
                value={description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(event.target.value);
                }}
              />
              <Button variant="contained" onClick={handleAddToDoList}>
                Add
              </Button>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker label="Date" value={date} onChange={(newValue) => setDate(newValue)} />
            </DemoContainer>
          </LocalizationProvider>

          <div className="flex flex-col gap-4 mt-4 ">
            <Box sx={{ minWidth: 120 }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="filter"
                onChange={handleChange}
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"complete"}>Completed</MenuItem>
                <MenuItem value={"incomplete"}>Incompleted</MenuItem>
                <MenuItem value={"overdue"}>Overdue</MenuItem>
              </Select>
            </Box>
            {Array.isArray(todoList) &&
              todoList.length > 0 &&
              todoList.map((todo) => {
                return (
                  <div
                    className="flex items-center justify-between bg-gray-50 p-2 border"
                    key={todo?.id}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={todo?.isCompleted}
                        onChange={(e) => handleChangeCheckbox(e, todo?.id)}
                      />
                      <div
                        className={`flex flex-col gap-0.5 ${
                          todo?.isCompleted ? "line-through text-gray-500" : ""
                        }`}
                      >
                        <p>{todo?.title}</p>
                        <p className="text-xs">{todo?.description}</p>
                      </div>
                      <p>{todo?.date}</p>
                    </div>
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="cursor-pointer pr-2"
                      onClick={() => handleDeleteTodo(todo?.id)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
