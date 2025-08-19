import axios from "axios";
const getAllList = (setList) => {
  axios.get(`https://todolist-react-node-backend.onrender.com/getList`).then(({ data }) => {
    console.log(data);
    setList(data);
  });
};

const addList = (name, setName, setList, selectedDate) => {
  if (!name.trim()) {
    alert("Введите задачу");
    return;
  }

  if (!selectedDate) {
    alert("Выберите дату");
    return;
  }

  const newTask = {
    name,
    date: selectedDate.toISOString(),
  };
  console.log(newTask);

  axios
    .post(`https://todolist-react-node-backend.onrender.com/saveList`, newTask)
    .then(({ data }) => {
      console.log("Добавлено:", data);
      setName("");
      getAllList(setList);
    })
    .catch((err) => console.error("Ошибка при добавлении задачи:", err));
};

const editList = (listId, name, setName, setList, setEditing, selectedDate) => {
  axios
    .put(`https://todolist-react-node-backend.onrender.com/editList`, {
      _id: listId,
      name,
      date: selectedDate.toISOString(),
    })
    .then((data) => {
      console.log(data);
      setName("");
      setEditing(false);
      getAllList(setList);
    });
};
const deleteList = (_id, setList) => {
  axios
    .delete(`https://todolist-react-node-backend.onrender.com/deleteList`, { data: { _id } })
    .then((data) => {
      console.log(data);
      getAllList(setList);
    });
};
export { getAllList };
export { addList };
export { editList };
export { deleteList };