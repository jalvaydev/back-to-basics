import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Todo } from "@generated/type-graphql";
import { Context, ErrorResponse } from "../types";

@ObjectType()
class TodoResponse {
  @Field(() => Todo, { nullable: true })
  todo?: Todo;

  @Field(() => ErrorResponse, { nullable: true })
  errors?: ErrorResponse;
}

@Resolver()
class TodoResolver {
  @Query(() => [Todo], { nullable: true })
  async todos(@Ctx() { prisma }: Context): Promise<Todo[]> {
    return prisma.todo.findMany();
  }

  @Query(() => Todo, { nullable: true })
  async todo(
    @Arg("id") id: number,
    @Ctx() { prisma }: Context
  ): Promise<Todo | null> {
    return prisma.todo.findUnique({ where: { id } });
  }

  @Mutation(() => Todo)
  async createTodo(
    @Arg("title") title: string,
    @Arg("body") body: string,
    @Ctx() { prisma }: Context
  ): Promise<Todo> {
    return prisma.todo.create({
      data: {
        title,
        body,
      },
    });
  }

  @Mutation(() => TodoResponse)
  async deleteTodo(
    @Arg("id") id: number,
    @Ctx() { prisma }: Context
  ): Promise<TodoResponse> {
    let todo;
    try {
      todo = await prisma.todo.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      return {
        errors: {
          field: err.code,
          message: "The todo does not exist, and could not be deleted.",
        },
      };
    }

    return { todo };
  }
}

export default TodoResolver;
