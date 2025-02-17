import SimpleDOM from "./SimpleDom.js";

const app = new SimpleDOM();
const container = document.getElementById("app");

const input = app.createElement("input", {
  type: "text",
  id: "todo-input",
  placeholder: "Add a new task",
});

const button = app.createElement("button", { onClick: () => app.addTodo() }, [
  "Add",
]);

const filterOptions = ["All", "Active", "Completed"];
const filterSelect = app.createElement(
  "select",
  {
    id: "filter-select",
    onChange: () => app.updateFilter(),
  },
  filterOptions.map((option) =>
    app.createElement("option", { value: option }, [option])
  )
);

const deleteCompletedButton = app.createElement(
  "button",
  { onClick: () => app.deleteCompletedTodos() },
  ["Delete Completed"]
);

const todoList = app.createElement("ul", { id: "todo-list" }, []);
const counter = app.createElement("div", { id: "counter" }, [
  "Remaining tasks: 0",
]);

app.render(
  app.createElement("div", {}, [
    input,
    button,
    filterSelect,
    deleteCompletedButton,
    todoList,
    counter,
  ]),
  container
);

app.state = {
  todos: [],
  filter: "All",
};

function getFilterFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const filterFromURL = urlParams.get("filter");
  return filterFromURL || "All";
}

app.addTodo = function () {
  const inputElement = document.getElementById("todo-input");
  const value = inputElement.value;

  if (value.trim() !== "") {
    const todo = {
      text: value,
      completed: false,
    };
    this.state.todos.push(todo);
    inputElement.value = "";
    this._updateDOM();
  }
};

app.updateFilter = function () {
  const filterSelectElement = document.getElementById("filter-select");
  this.state.filter = filterSelectElement.value;

  history.pushState(
    {},
    "",
    `${window.location.pathname}?filter=${this.state.filter}`
  );

  this._updateDOM();
};

app._updateDOM = function () {
  const todoListContainer = document.getElementById("todo-list");
  todoListContainer.innerHTML = "";

  const filteredTodos = this.state.todos.filter((todo) => {
    if (this.state.filter === "All") return true;
    if (this.state.filter === "Active") return !todo.completed;
    if (this.state.filter === "Completed") return todo.completed;
  });

  filteredTodos.forEach((todo, index) => {
    const checkbox = app.createElement("input", {
      type: "checkbox",
      checked: todo.completed,
      onChange: () => this.toggleTodoCompletion(index),
    });

    const textContent = app.createElement(
      "span",
      {
        ondblclick: () => this.editTodoText(index),
        style: todo.completed ? "text-decoration: line-through;" : "",
      },
      [todo.text]
    );

    const li = app.createElement("li", {}, [
      checkbox,
      textContent,
      app.createElement("button", { onClick: () => this.removeTodo(index) }, [
        "Delete",
      ]),
    ]);

    todoListContainer.appendChild(this._createRealDOM(li));
  });

  const remainingTasks = this.state.todos.filter(
    (todo) => !todo.completed
  ).length;
  document.getElementById(
    "counter"
  ).textContent = `Remaining tasks: ${remainingTasks}`;
};

app.removeTodo = function (index) {
  this.state.todos.splice(index, 1);
  this._updateDOM();
};

app.toggleTodoCompletion = function (index) {
  this.state.todos[index].completed = !this.state.todos[index].completed;
  this._updateDOM();
};

app.deleteCompletedTodos = function () {
  this.state.todos = this.state.todos.filter((todo) => !todo.completed);
  this._updateDOM();
};

app.editTodoText = function (index) {
  const newText = prompt("Edit task:", this.state.todos[index].text);
  if (newText !== null && newText.trim() !== "") {
    this.state.todos[index].text = newText;
    this._updateDOM();
  }
};

window.onload = function () {
  const initialFilter = getFilterFromURL();
  app.state.filter = initialFilter;
  document.getElementById("filter-select").value = initialFilter;
  app._updateDOM();
};
