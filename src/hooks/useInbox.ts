import { db } from "~/firebase-config";
import { query, where, collection, doc, setDoc, getDocs, updateDoc, onSnapshot, arrayUnion, serverTimestamp, FieldValue } from "firebase/firestore";
import { use, useEffect, useState } from 'react';
import { User } from "~/store/userStore";
import { useRouter } from "next/router"
import useAuth from "./useAuth";
import useUser from "./useUser";
import { COLLECTIONS } from "~/utils/strings";



type UserConvo = {
    user: User,
    lastConvo: ""
}
export type Message = { dateCreated: Date, text: string, userId: string }
type UserId = string
type ConvoDetails = {
    users: Array<UserId>,
    usersData?: Array<User>,
    lastChat: string,
    lastUser: string,
    lastUpdate?: FieldValue,
    id?: string | null
    messages?: Array<Message>
}

type Conversation = {
    userId: string,
    message: string,
    type: "text" | "Image"
}
type Conversations = Array<Conversation>
const useInbox = () => {
    // .where('name', '>=', queryText)
    // .where('name', '<=', queryText+ '\uf8ff')
    const { user } = useAuth()
    const { getUser } = useUser()
    const { query: routerQuery } = useRouter()
    const [searchResult, setSearchResult] = useState<Array<User>>([])
    const [suggestedUsers, setSuggestedUsers] = useState<Array<User>>([])
    const [allConvo, setAllConvo] = useState<Array<ConvoDetails>>([])
    const [currentRecipient, setCurrentRecipient] = useState<User | null>(null)
    const [currentConvo, setCurrentConvo] = useState<ConvoDetails | null>(null)
    const [relatedUsers, setRelatedUsers] = useState<Array<User>>([])
    const [connectedUser, setConnectedUser] = useState<Array<User>>([])
    const searchByEmail = async (email: string) => {
        let emailQuery = query(collection(db, "users"), where("email", "==", email));
        let result = await getDocs(emailQuery)
        const users: Array<User> = []
        result.forEach(doc => users.push(doc.data() as User))
        setSearchResult(users)
    }

    const addRelatedUser = ({ user }: { user: User }) => {
        const userIndex = relatedUsers.findIndex(_user => user._id == _user._id)
        if (userIndex != -1) {
            // setRelatedUsers
        } else {
            //add user
            setRelatedUsers(prev => [...prev, user])
        }
    }

    const convoSnapShot = (id: string) => {
        onSnapshot(doc(db, COLLECTIONS.CONVO_DETAILS, id as string), (doc) => {
            setCurrentConvo({ ...doc.data() as any, id: doc?.id })
        });
    }

    const sendMessage = async ({ text }: { text: string }) => {
        if (text.trim().length != 0) {
            const convoDetailsRef = doc(db, COLLECTIONS.CONVO_DETAILS, currentConvo?.id as string)
            const dateCreated = new Date()
            await updateDoc(convoDetailsRef, {
                lastUser: user?._id,
                lastChat: text,
                lastUpdate: serverTimestamp(),
                messages: arrayUnion({
                    text,
                    dateCreated,
                    user: user?._id
                })
            })
        }
    }

    const getConnectedUser = async (id: string) => {
        await onSnapshot(query(collection(db, COLLECTIONS.USERS), where("connectedUsers", "array-contains", id)), (docs) => {
            setConnectedUser(docs.docs.map(doc => doc.data() as User))
        })

        await onSnapshot(query(collection(db, COLLECTIONS.CONVO_DETAILS), where("users", "array-contains", user?._id)), (docs) => {
            setAllConvo(docs.docs.map(doc => doc.data() as ConvoDetails))
        })

        // console.log(connectedUsers.docs.map(doc => doc.data() as User));
    }

    const getConvo = async ({ currentUserId, recipientId }: { currentUserId: string, recipientId: string }) => {
        const user = await getUser({ id: recipientId })
        if (user) {
            const convoDetails = await getConvoDetails({ currentUserId, recipientId })
            if (convoDetails.length != 0) {

            } else if (convoDetails.length > 1) {

            }
        }
    }
    const getConvoDetails = async ({ currentUserId, recipientId }: { currentUserId: string, recipientId: string }) => {
        const convoDetails = await getDocs(query(collection(db, COLLECTIONS.CONVO_DETAILS), where("users", "array-contains", currentUserId + recipientId)))

        if (convoDetails.docs.length == 0) {
            // create convo details
            const convoDetails: ConvoDetails = {
                users: [currentUserId, recipientId, currentUserId + recipientId, recipientId + currentUserId],
                lastChat: "",
                lastUser: currentUserId,
                lastUpdate: serverTimestamp(),

            }
            // const id = await doc(db, COLLECTIONS.CONVO_DETAILS).id
            const userRef = doc(db, COLLECTIONS.USERS, recipientId)
            await updateDoc(userRef, {
                connectedUsers: arrayUnion(currentUserId)
            })
            await setDoc(doc(collection(db, COLLECTIONS.CONVO_DETAILS)), convoDetails)
            await getConvoDetails({ currentUserId, recipientId })

        } else {
            // const id: any = convoDetails.docs[0]?.id
            setCurrentConvo({ ...convoDetails.docs[0]?.data() as any, id: convoDetails.docs[0]?.id })
            convoSnapShot(convoDetails.docs[0]?.id as string)
        }

        const convoDetailsIds: string[] = []
        convoDetails.docs.forEach((doc) => {
            const data: ConvoDetails = doc.data() as ConvoDetails
            data.users.forEach(id => {
                if (convoDetailsIds.findIndex(_id => _id == id) == -1) {
                    convoDetailsIds.push(id)
                }
            })
        })
        return convoDetails.docs
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
        if (user?._id) {
            getConnectedUser(user._id)
        }
    }, [])

    useEffect(() => {
        if (user?._id) {
            getConnectedUser(user._id)
        }
    }, [user])

    useEffect(() => {
        setCurrentConvo(null)
        if (routerQuery.id && user?._id) {
            console.log(user);
            getConnectedUser(user._id)
            getConvo({ currentUserId: user._id, recipientId: routerQuery.id as string })
        }
    }, [routerQuery])

    return {
        searchByEmail, searchResult,
        suggestedUsers,
        connectedUser,
        currentConvo,
        sendMessage,
        allConvo
    }
}

export default useInbox