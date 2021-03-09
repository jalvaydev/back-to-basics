import Header from "./components/Header";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <div>
      <main>
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Header />
          <TodoInput />
          <TodoList />
        </div>
      </main>
    </div>
  );
}
