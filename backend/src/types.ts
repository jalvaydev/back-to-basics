import { PrismaClient } from "@prisma/client";
import { ObjectType, Field } from "type-graphql";

export type Context = {
  prisma: PrismaClient;
};

@ObjectType()
export class ErrorResponse {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}
