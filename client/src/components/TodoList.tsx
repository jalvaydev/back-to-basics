import { gql, useQuery } from "@apollo/client";
import { TodoType } from "src/types";
import Todo from "./Todo";

export const TODOS = gql`
  query TODOS {
    todos {
      id
      title
      body
    }
  }
`;

const TodoList = () => {
  const { loading, error, data } = useQuery(TODOS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {data?.todos?.map((todo: TodoType) => (
          <Todo
            key={todo.id}
            id={todo.id}
            title={todo.title}
            body={todo.body}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
