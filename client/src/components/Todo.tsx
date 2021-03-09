import { gql, useMutation } from "@apollo/client";
import { TodoType } from "../types";

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Float!) {
    deleteTodo(id: $id) {
      todo {
        id
      }
    }
  }
`;

const Todo = ({ title, body, id }: TodoType) => {
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update: (cache) => {
      cache.modify({
        fields: {
          todos(todos = [], { readField }) {
            return todos.filter(
              (todoRef: any) => id !== readField("id", todoRef)
            );
          },
        },
      });
    },
  });

  return (
    <li className="col-span-1 flex shadow-sm rounded-md">
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <p className="text-gray-900 font-medium hover:text-gray-600">
            {title}
          </p>
          <p className="text-gray-500">{body}</p>
        </div>
        <div className="flex-shrink-0 pr-2">
          <button
            onClick={() =>
              deleteTodo({
                variables: { id },
              })
            }
            className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Open options</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

export default Todo;
