import { gql, useQuery, useMutation, readField } from "@apollo/client";
import { Formik, Form, Field } from "formik";

const TODOS = gql`
  query TODOS {
    todos {
      id
      title
      body
    }
  }
`;

const ADD_TODO = gql`
  mutation CreateTodo($body: String!, $title: String!) {
    createTodo(body: $body, title: $title) {
      id
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Float!) {
    deleteTodo(id: $id) {
      todo {
        id
      }
    }
  }
`;

const TodoInput = () => {
  const [addTodo, { data }] = useMutation(ADD_TODO, {
    update: (cache) => {
      cache.modify({
        fields: {
          todos(existingTodos = [], { readField }) {
            console.log(addTodo);
            const newTodo = cache.writeQuery({
              data: addTodo,
              query: TODOS,
            });
            return [...existingTodos, newTodo];
          },
        },
      });
    },
  });

  return (
    <div className="w-3/12">
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values, { setSubmitting }) => {
          await addTodo({
            variables: { title: values.title, body: values.body },
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <Field
                type="text"
                name="title"
                id="title"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Name of your todo..."
              />
            </div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700"
            >
              Body
            </label>
            <div className="mt-1">
              <Field
                type="text"
                name="body"
                id="body"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Description of your todo..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Header = () => {
  return (
    <div className="md:flex py-10 md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Todo List
        </h2>
      </div>
    </div>
  );
};

const Todo = ({ title, body, id }) => {
  const [deleteTodo, { data }] = useMutation(DELETE_TODO, {
    update: (cache) => {
      cache.modify({
        fields: {
          todos(todos = [], { readField }) {
            return todos.filter((todoRef) => id !== readField("id", todoRef));
          },
        },
      });
    },
  });

  return (
    <li className="col-span-1 flex shadow-sm rounded-md">
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-2 text-sm truncate">
          <a href="#" className="text-gray-900 font-medium hover:text-gray-600">
            {title}
          </a>
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

const TodoList = () => {
  const { loading, error, data } = useQuery(TODOS);
  if (loading) return <div>Loadng...</div>;
  if (error) return `${error.message}`;
  return (
    <div>
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {data?.todos?.map((todo) => (
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

export default function Home() {
  return (
    <div>
      <main>
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Header />
          <TodoInput />
          <TodoList />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
