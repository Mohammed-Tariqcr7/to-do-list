import "./style.css";
import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
import Proton from "proton-engine";
import RAFManager from "raf-manager";

Alpine.plugin(persist);
window.Alpine = Alpine;

// Particle component logic
function particleComponent() {
  return {
    colors: [
      "#529B88",
      "#CDD180",
      "#FFFA32",
      "#FB6255",
      "#FB4A53",
      "#FF4E50",
      "#F9D423",
    ],
    proton: null,
    renderer: null,

    init() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      this.createProton(canvas);
      RAFManager.add(this.renderProton.bind(this));

      window.addEventListener("resize", this.handleResize.bind(this));
    },

    createProton(canvas) {
      const proton = new Proton();
      const emitter = new Proton.Emitter();

      emitter.rate = new Proton.Rate(
        new Proton.Span(5, 8),
        new Proton.Span(0.05, 0.2)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 30));
      emitter.addInitialize(new Proton.Life(2, 10));
      emitter.addInitialize(
        new Proton.Position(
          new Proton.RectZone(0, 0, canvas.width, canvas.height)
        )
      );

      emitter.addBehaviour(
        new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(
        new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(new Proton.Color(this.colors, "random"));

      emitter.emit();
      proton.addEmitter(emitter);

      this.renderer = new Proton.CanvasRenderer(canvas);
      proton.addRenderer(this.renderer);
      emitter.preEmit(0.5);

      this.proton = proton;
    },

    renderProton() {
      this.proton.update();
    },

    handleResize() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.renderer.resize(canvas.width, canvas.height);
    },

    destroy() {
      RAFManager.remove(this.renderProton.bind(this));
      if (this.proton) this.proton.destroy();
    },
  };
}
window.particleComponent = particleComponent;

// To-do List Logic
function toDoList() {
  return {
    newTodo: "",
    todos: Alpine.$persist([]).as("todos"),

    addToDo() {
      if (this.newTodo.trim() === "") return;
      this.todos.push({
        todo: this.newTodo,
        completed: false,
      });
      this.newTodo = "";
    },

    toggleToDoCompleted(index) {
      this.todos[index].completed = !this.todos[index].completed;
    },

    deleteToDo(index) {
      this.todos = this.todos.filter((todo, todoIndex) => index !== todoIndex);
    },

    numberOfToDosCompleted() {
      return this.todos.filter((todo) => todo.completed).length;
    },

    toDoCount() {
      return this.todos.length;
    },

    isLastToDo(index) {
      return this.todos.length - 1 === index;
    },
  };
}

window.toDoList = toDoList;

Alpine.start();
