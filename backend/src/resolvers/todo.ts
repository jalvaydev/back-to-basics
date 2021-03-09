import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Todo } from "@generated/type-graphql";
import { Context } from "../types";

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
}

export default TodoResolver;
