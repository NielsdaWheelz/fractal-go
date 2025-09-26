import { useQuery } from "@tanstack/react-query"
import { getGames, getGame } from "./api.ts"

export const useGetGameQuery = (id?: number) => {
    return useQuery({
        queryKey: ['game', id],
        queryFn: () => getGame(id),
        enabled: !!id,
    })
}

export const useGetGamesQuery = () => {
    return useQuery({
        queryKey: ['games'],
        queryFn: () => getGames(),
    })
}

