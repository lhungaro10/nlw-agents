import { useQuery } from "@tanstack/react-query";
import type { GetRoomQuestionResponse } from "./types/get-room-questions-response";

export function useRoomsQuestions(roomId: string) {
  return useQuery({
    queryKey: ["get-questions", roomId],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/rooms/${roomId}/questions`
      );
      const result: GetRoomQuestionResponse = await response.json();
      return result;
    },
  });
}
