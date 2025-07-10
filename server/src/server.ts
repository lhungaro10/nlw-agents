import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createQuestionRoute } from "./http/routes/create-question.ts";
import { createRoomRoute } from "./http/routes/create-room.ts";
import { getRoomsRoute } from "./http/routes/get-roms.ts";
import { getRoomQuestionsRoute } from "./http/routes/get-room-questions.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.register(fastifyCors, {
  origin: "*",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return "ok";
});

app.register(getRoomsRoute);
app.register(createRoomRoute);
app.register(getRoomQuestionsRoute);
app.register(createQuestionRoute);
app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}`);
});
