import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "~/firebase-config";
import { query, where } from "firebase/firestore";
import { use, useEffect, useState } from 'react';
import { User } from "~/store/userStore";


type UserConvo = {
    user: User,
    lastConvo: ""
}
const useInbox = () => {
    // .where('name', '>=', queryText)
    // .where('name', '<=', queryText+ '\uf8ff')
    const [searchResult, setSearchResult] = useState<Array<User>>([])
    const [suggestedUsers, setSuggestedUsers] = useState<Array<User>>([])
    const searchByEmail = async (email: string) => {
        let emailQuery = query(collection(db, "users"), where("email", "==", email));
        let result = await getDocs(emailQuery)
        const users: Array<User> = []
        result.forEach(doc => users.push(doc.data() as User))
        setSearchResult(users)
    }

    const suggestUser = async () => {
        let emailQuery = query(collection(db, "users"));
        let result = await getDocs(emailQuery)
        const users: Array<User> = []
        result.forEach(doc => users.push(doc.data() as User))
        setSuggestedUsers(users)
    }
    useEffect(() => {
        suggestUser()
    }, [])
    return {
        searchByEmail, searchResult,
        suggestedUsers,
    }
}

export default useInbox