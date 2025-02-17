# SimpleDOM Framework

The `SimpleDOM` framework is a lightweight JavaScript library designed for creating simple web applications with virtual DOM handling, state management, and event-based interaction. This guide will walk you through how to use `SimpleDOM`, explaining key functions, state management capabilities, and usage examples.

---

## Features

- **Virtual DOM Creation**: Create virtual DOM elements using a simple object structure.
- **State Management**: Maintain and update state easily.
- **Real DOM Rendering**: Efficiently render the virtual DOM to the real DOM.
- **Event Handling**: Simplified event listeners with support for dynamic behavior.

---

## Getting Started

### Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript.
- A modern browser with ES6+ support.

### Installation

Simply import the `SimpleDOM` class in your JavaScript file:

```javascript
import SimpleDOM from "./SimpleDom.js";
```

---

## Usage Guide

### 1. Create a `SimpleDOM` Instance

Start by creating an instance of the `SimpleDOM` class:

```javascript
const app = new SimpleDOM();
```

### 2. Define and Render Elements

You can create and render elements using the `createElement` and `render` methods.

```javascript
const input = app.createElement("input", {
  type: "text",
  id: "todo-input",
  placeholder: "Add a new task",
});

const button = app.createElement("button", { onClick: () => app.addTodo() }, [
  "Add",
]);

const todoList = app.createElement("ul", { id: "todo-list" }, []);

app.render(
  app.createElement("div", {}, [input, button, todoList]),
  document.getElementById("app")
);
```

- **`createElement(tag, attrs = {}, children = [])`**: Creates a virtual DOM element with a specified tag, attributes, and children.

  - **`tag`**: HTML tag as a string (e.g., "div", "input").
  - **`attrs`**: An object containing attributes and event listeners (e.g., `{ id: "my-id", onClick: () => console.log("Clicked") }`).
  - **`children`**: An array of strings or virtual DOM elements to be rendered as children.

- **`render(element, container)`**: Renders the virtual DOM element to the specified container (real DOM element).

### 3. Managing State and Updating DOM

#### Adding a ToDo Item

Here's how you can add a new ToDo item using a simple function:

```javascript
app.addTodo = function () {
  const inputElement = document.getElementById("todo-input");
  const value = inputElement.value;

  if (value.trim() !== "") {
    const todo = {
      text: value,
      completed: false,
    };
    this.state.todos.push(todo); // Update state
    inputElement.value = ""; // Clear input
    this._updateDOM(document.getElementById("app")); // Re-render with updated state
  }
};
```

- **`state`**: The `SimpleDOM` instance maintains an internal state. Here, we keep a list of `todos`.
- **`_updateDOM(container)`**: Updates the real DOM based on the virtual DOM and current state.

#### Removing and Updating ToDo Items

You can remove or change elements dynamically:

```javascript
// Remove a ToDo item
app.removeTodo = function (index) {
  this.state.todos.splice(index, 1);
  this._updateDOM(document.getElementById("app"));
};

// Change the priority of a ToDo item
app.changePriority = function (index, newPriority) {
  this.state.todos[index].priority = newPriority;
  this._updateDOM(document.getElementById("app"));
};
```

---

## Example ToDo Application

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SimpleDOM ToDo App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="todo-app.js"></script>
  </body>
</html>
```

### `todo-app.js`

```javascript
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

const todoList = app.createElement("ul", { id: "todo-list" }, []);

app.render(app.createElement("div", {}, [input, button, todoList]), container);

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
    this._updateDOM(container);
  }
};
```

---

## Key Methods Summary

- **`createElement(tag, attrs = {}, children = [])`**: Create virtual DOM elements.
- **`render(element, container)`**: Render virtual elements to a container.
- **`_updateDOM(container)`**: Update the real DOM based on the virtual DOM and state.
- **State Management**: Use the `state` property to maintain and manipulate application state.

---

That's it! You are ready to build simple and efficient web applications using the `SimpleDOM` framework. Enjoy coding! 🎉
