import { SetState, create } from "zustand";

export type User = {
    _id: string,
    username: string,
    email: string,

}

type State = {
    user: User | null,
    topicPreference: Array<string>,
    topics: Array<string>
}

const defState = {
    topicPreference: [],
    topics: [],
    user: null
}

type Action = {
    initUser: (user: User) => void
    setTopicPreference: (topics: Array<string>) => void
}

const action = (set: SetState<State>) => ({
    initUser: (user: User) => {
        set((state) => ({ user }))
    },
    setTopicPreference: (topics: Array<string>) => {
        set(() => ({ topicPreference: topics }))
    }
})

export const UserStore = create<State & Action>()(
    (set) => ({
        ...defState,
        ...action(set)
    })
)