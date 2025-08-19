import { useEffect, useState } from "react";
import { MyList } from "./MyList";
import { getAllList, addList, editList, deleteList } from "./FetchList";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

function Calendar() {
  const [myList, setList] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [listId, setListId] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const taskDates = myList.map((item) =>
    format(new Date(item.date), "yyyy-MM-dd"),
  );

  useEffect(() => {
    getAllList(setList);
  }, []);

  const updatingInInput = (_id, name) => {
    setEditing(true);
    setName(name);
    setListId(_id);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart); 
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        const formattedDay = format(day, "yyyy-MM-dd");
        const isTaskDay = taskDates.includes(formattedDay);

        days.push(
          <div
            className={`cell ${!isSameMonth(day, monthStart) ? "disabled" : ""} ${isSameDay(day, selectedDate) ? "selected" : ""} ${isTaskDay ? "has-task" : ""}`}
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span>{format(day, dateFormat)}</span>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  return (
    <div className="planner-container">
      <div className="calendar-block">
        <div className="header">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            ←
          </button>
          <h2>{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            →
          </button>
        </div>

        <div className="days-names">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div className="day-name" key={day}>
              {day}
            </div>
          ))}
        </div>
        {renderDays()}
      </div>
      <div className="task-block">
        <h3>Задачи на {format(selectedDate, "dd MMMM yyyy")}:</h3>
        <input
          type="text"
          placeholder="Введите задачу"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={
            editing
              ? () =>
                  editList(
                    listId,
                    name,
                    setName,
                    setList,
                    setEditing,
                    selectedDate,
                  )
              : () => addList(name, setName, setList, selectedDate)
          }
        >
          {editing ? "Edit" : "Add"}
        </button>

        {Array.isArray(myList) &&
          myList
            .filter((item) => {
              const taskDate = new Date(item.date);
              return (
                taskDate.toString() !== "Invalid Date" &&
                format(taskDate, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd")
              );
            })
            .map((list) => (
              <MyList
                key={list._id}
                text={list.name}
                date={list.date}
                updatingInInput={() => updatingInInput(list._id, list.name)}
                deleteList={() => deleteList(list._id, setList)}
              />
            ))}
      </div>
    </div>
  );
}

export default Calendar;