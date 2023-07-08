export const randAvatar = () => {
    const randNumer = Math.floor(Math.random() * 20) + 1
    return `/assets/avatars/${randNumer}${randNumer}.png`
}

export const COLLECTIONS = {
    USERS: 'users',
    CONVOS: 'convos',
    CONVO_DETAILS: 'convoDetails'
}


export const convoStarter = () => {
    const synonyms = [
        "Say Hi",
        "Greet",
        "Salute",
        "Wish hello",
        "Extend greetings",
        "Offer salutations",
        "Say hey",
        "Give a nod",
        "Acknowledge",
        "Welcome",
        "Hail",
        "Address",
        "Bid good day",
        "Exchange pleasantries",
        "Give a warm welcome",
        "Utter a greeting",
        "Express regards",
        "Send regards",
        "Convey salutations",
        "Offer a friendly hello"
    ];

    const emojiList = ["👋", "👋🏼", "👋🏽", "👋🏾", "👋🏿", "🌟", "🎉", "🙌", "💫", "✨"];

    const getRandomElement = (array: Array<string>) => array[Math.floor(Math.random() * array.length)];

    const arrayOfStrings = synonyms.slice().sort(() => 0.5 - Math.random()).slice(0, 20);
    const arrayWithEmoji = arrayOfStrings.map(item => `${getRandomElement(emojiList)} ${item}`);

    return arrayWithEmoji[Math.floor(Math.random() * arrayWithEmoji.length - 1)]
}