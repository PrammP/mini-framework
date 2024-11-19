class SimpleDOM {
  constructor() {
    this.state = { todos: [] };
    this.vdom = null;
  }

  // Create an element that will be used to create virtual DOM
  createElement(tag, attrs = {}, children = []) {
    return { tag, attrs, children };
  }

  // Render the virtual DOM into the real DOM
  render(element, container) {
    this.vdom = element;
    this._updateDOM(container);
  }

  // Update the real DOM based on the virtual DOM
  _updateDOM(container) {
    const realDOM = this._createRealDOM(this.vdom);
    container.innerHTML = "";
    container.appendChild(realDOM);
  }

  // Convert virtual DOM (object structure) to real DOM nodes
  _createRealDOM(vNode) {
    if (typeof vNode === "string") {
      return document.createTextNode(vNode);
    }

    const element = document.createElement(vNode.tag);

    // Handle attributes, including event listeners
    for (const [attr, value] of Object.entries(vNode.attrs)) {
      if (attr.startsWith("on")) {
        const eventName = attr.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else {
        element.setAttribute(attr, value);
      }
    }

    for (const child of vNode.children) {
      element.appendChild(this._createRealDOM(child));
    }

    return element;
  }

  addTodo() {
    const inputElement = document.getElementById("todo-input");
    const value = inputElement.value;

    if (value.trim() !== "") {
      const todo = {
        text: value,
        completed: false,
      };
      this.state.todos.push(todo);
      inputElement.value = "";
      this._updateDOM(document.getElementById("app"));
    }
  }

  // Update the state and re-render the DOM
  _renderTodoList(container) {
    const todoListContainer = document.getElementById("todo-list");
    todoListContainer.innerHTML = "";

    this.state.todos.forEach((todo, index) => {
      const checkbox = this.createElement("input", {
        type: "checkbox",
        checked: todo.completed,
        onChange: () => this.toggleTodoCompletion(index),
      });

      const textContent = todo.completed
        ? this.createElement("s", {}, [todo.text])
        : this.createElement("span", {}, [todo.text]);

      const li = this.createElement("li", {}, [
        checkbox,
        textContent,
        this.createElement(
          "button",
          { onClick: () => this.removeTodo(index) },
          ["Delete"]
        ),
      ]);
      todoListContainer.appendChild(this._createRealDOM(li)); // Use _createRealDOM to convert to actual DOM
    });
  }

  removeTodo(index) {
    this.state.todos.splice(index, 1);
    this._updateDOM(document.getElementById("app"));
  }

  // Toggle the completion state of a todo
  toggleTodoCompletion(index) {
    this.state.todos[index].completed = !this.state.todos[index].completed;
    this._updateDOM(document.getElementById("app"));
  }
}

export default SimpleDOM;
