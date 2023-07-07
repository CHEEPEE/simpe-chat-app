export const randAvatar = () => {
    const randNumer = Math.floor(Math.random() * 20) + 1
    return `/assets/avatars/${randNumer}${randNumer}.png`
}

export const COLLECTIONS = {
    USERS: 'users',
    CONVOS: 'convos',
    CONVO_DETAILS: 'convoDetails'
}

