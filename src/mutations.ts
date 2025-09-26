import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGame, postMove, postPass } from "./api.ts"

export const useMoveMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, row, col }: { id: number; row: number; col: number }) => postMove(id, row, col),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['game', variables.id], data)
            queryClient.invalidateQueries({ queryKey: ['games'] })
        }
    })
}

export const usePassMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id }: { id: number }) => postPass(id),
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['game', variables.id], data)
            queryClient.invalidateQueries({ queryKey: ['games'] })
        }
    })
}

export const useCreateGameMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (size: number) => createGame(size),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] })
        }
    })
}
