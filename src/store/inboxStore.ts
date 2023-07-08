import { SetState, create } from "zustand";
import { ConvoDetails } from "~/hooks/useInbox";

export type User = {
    _id: string,
    username: string,
    email: string,
    photoUrl: string,

}

type State = {
    allConvo: Array<ConvoDetails>,
    currentConvo: ConvoDetails | null,
    suggestedUsers: Array<User>,
    connectedUsers: Array<User>
}

const defState = {
    allConvo: [],
    currentConvo: null,
    suggestedUsers: [],
    connectedUsers: []
}

type Action = {
    setAllConvo: (allConvo: Array<ConvoDetails>) => void,
    setCurretntConvo: (currentConvo: ConvoDetails) => void,
    setSuggestedUsers: (suggestedUsers: Array<User>) => void,
    setConnectedUsers: (connectedUsers: Array<User>) => void

}

const action = (set: SetState<State>) => ({
    setAllConvo: (allConvo: Array<ConvoDetails>) => {
        set((state) => ({ allConvo }))
    },
    setCurretntConvo: (currentConvo: ConvoDetails) => {
        set((state) => ({ currentConvo }))
    },
    setSuggestedUsers: (suggestedUsers: Array<User>) => {
        set((state) => ({ suggestedUsers }))
    },
    setConnectedUsers: (connectedUsers: Array<User>) => {
        set((state) => ({ connectedUsers }))

    }

})

export const InboxStore = create<State & Action>()(
    (set) => ({
        ...defState,
        ...action(set)
    })
)