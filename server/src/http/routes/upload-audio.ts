import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateEmbeddings, transcibeAudio } from "../../services/gemini.ts";

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error("Audio is Required");
      }

      // transcrever audio
      const audioBuffer = await audio.toBuffer();
      const audioAsBase64 = audioBuffer.toString("base64");
      const transcription = await transcibeAudio(audioAsBase64, audio.mimetype);
      // gerar o vetor semantico / embeddings
      const embeddings = await generateEmbeddings(transcription);

      //armazenar os vetores no postgres

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];
      if (!chunk) {
        throw new Error("Erro ao salvar chunk de áudio");
      }
      // retorna para o usuario
      return reply.status(201).send({ chunkId: chunk.id });
    }
  );
};
