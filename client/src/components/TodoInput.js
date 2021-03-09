import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import { TODOS } from "./TodoList";

const ADD_TODO = gql`
  mutation CreateTodo($body: String!, $title: String!) {
    createTodo(body: $body, title: $title) {
      id
    }
  }
`;

const TodoInput = () => {
  const [addTodo] = useMutation(ADD_TODO, {
    update: (cache) => {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
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
    <div className="flex justify-center">
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
              className="my-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Todo
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TodoInput;
