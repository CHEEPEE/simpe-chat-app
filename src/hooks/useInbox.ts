import { db } from "~/firebase-config";
import { query, where, collection, doc, setDoc, getDocs, updateDoc, onSnapshot, arrayUnion, serverTimestamp, FieldValue } from "firebase/firestore";
import { use, useEffect, useState, useCallback } from 'react';
import { User } from "~/store/userStore";
import { useRouter } from "next/router"
import useAuth from "./useAuth";
import useUser from "./useUser";
import { COLLECTIONS } from "~/utils/strings";
import { InboxStore } from "~/store/inboxStore";



type UserConvo = {
    user: User,
    lastConvo: ""
}
export type Message = { dateCreated: Date, text: string, userId: string }
export type UserId = string
export type ConvoDetails = {
    users: Array<UserId>,
    usersData?: Array<User>,
    lastChat: string,
    lastUser: string,
    lastUpdate?: FieldValue,
    id?: string | null
    messages?: Array<Message>
}

export type Conversation = {
    userId: string,
    message: string,
    type: "text" | "Image"
}
export type Conversations = Array<Conversation>
const useInbox = () => {
    // .where('name', '>=', queryText)
    // .where('name', '<=', queryText+ '\uf8ff')
    const { user } = useAuth()
    const { getUser } = useUser()
    const { query: routQuery } = useRouter()
    const { setAllConvo, allConvo, currentConvo, setCurretntConvo, suggestedUsers, setSuggestedUsers, setConnectedUsers, connectedUsers } = InboxStore()
    const [searchResult, setSearchResult] = useState<Array<User>>([])
    // const [suggestedUsers, setSuggestedUsers] = useState<Array<User>>([])
    // const [relatedUsers, setRelatedUsers] = useState<Array<User>>([])
    // const [connectedUser, setConnectedUser] = useState<Array<User>>([])
    const searchByEmail = async (email: string) => {
        let emailQuery = query(collection(db, "users"), where("email", "==", email));
        let result = await getDocs(emailQuery)
        const users: Array<User> = []
        result.forEach(doc => users.push(doc.data() as User))
        setSearchResult(users)
    }

    // const addRelatedUser = ({ user }: { user: User }) => {
    //     const userIndex = relatedUsers.findIndex(_user => user._id == _user._id)
    //     if (userIndex != -1) {
    //         // setRelatedUsers
    //     } else {
    //         //add user
    //         setRelatedUsers(prev => [...prev, user])
    //     }
    // }



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

    const getAllConvo = async (call: string) => {
        const snap = await onSnapshot(query(collection(db, COLLECTIONS.CONVO_DETAILS), where("users", "array-contains", user?._id)), { includeMetadataChanges: true }, (snapshot) => {
            // setCurrentConvo({ ...convoDetails.docs[0]?.data() as any, id: convoDetails.docs[0]?.id })
            const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
            if (source == "Server") {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "modified") {
                        console.log(call, "modified: ", change.doc.data());
                        const message: ConvoDetails = change.doc.data() as any
                        const _user = connectedUsers[connectedUsers.findIndex(user => user._id == message.lastUser)]
                        if (_user && message.lastUser != routQuery._id && message.lastUser != user?._id) {
                            const greeting = new Notification(_user?.username as string, {
                                body: message.lastChat,
                                icon: _user?.photoUrl,
                            });
                            setTimeout(() => {
                                greeting.close();
                            }, 10 * 1000);
                        }
                    }
                });
                setAllConvo(snapshot.docs.map(doc => doc.data() as ConvoDetails))
            }

        })

        return snap
    }

    const getConnectedUser = async (id: string) => {
        await onSnapshot(query(collection(db, COLLECTIONS.USERS), where("connectedUsers", "array-contains", id)), (docs) => {
            setConnectedUsers(docs.docs.map(doc => doc.data() as User))
        })
        // console.log(connectedUsers.docs.map(doc => doc.data() as User));
    }

    const getConvo = async ({ currentUserId, recipientId }: { currentUserId: string, recipientId: string }) => {
        const user = await getUser({ id: recipientId })
        if (user) {
            return await getConvoDetails({ currentUserId, recipientId })
        }
    }

    const getCurrentConvo = useCallback(({ userId, recipeintId }: { userId: string, recipeintId: string }) => {
        const index = allConvo.findIndex((convo: ConvoDetails) => convo.users.findIndex(uid => uid == userId + recipeintId) != -1)
        return allConvo[index]
    }, [allConvo])

    const getConvoDetails: any = async ({ currentUserId, recipientId }: { currentUserId: string, recipientId: string }) => {
        const convoDetails = await getDocs(query(collection(db, COLLECTIONS.CONVO_DETAILS), where("users", "array-contains", currentUserId + recipientId)))
        let _getAllConvo = null
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
            await setDoc(doc(collection(db, COLLECTIONS.CONVO_DETAILS)), convoDetails)
            await updateDoc(userRef, {
                connectedUsers: arrayUnion(currentUserId)
            })
            await updateDoc(doc(db, COLLECTIONS.USERS, currentUserId), {
                connectedUsers: arrayUnion(recipientId)
            })
            const unSub = await getConvoDetails({ currentUserId, recipientId })
            unSub()
        } else {
            const id: any = convoDetails.docs[0]?.id
            setCurretntConvo({ ...convoDetails.docs[0]?.data() as any, id })
            _getAllConvo = getAllConvo('getConvoDetails')
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
        return _getAllConvo as any
    }

    const suggestUser = async () => {
        let emailQuery = query(collection(db, "users"));
        let result = await getDocs(emailQuery)
        const users: Array<User> = []
        result.forEach(doc => users.push(doc.data() as User))
        setSuggestedUsers(users)
    }


    // useEffect(() => {
    //     if (user?._id) {
    //         getConnectedUser(user._id)
    //     }
    // }, [user])

    // useEffect(() => {
    //     setCurrentConvo(null)
    //     if (routerQuery.id && user?._id) {
    //         // console.log(user);
    //         getConnectedUser(user._id)
    //         getConvo({ currentUserId: user._id, recipientId: routerQuery.id as string })
    //     }
    // }, [routerQuery])

    return {
        searchByEmail, searchResult,
        suggestedUsers,
        connectedUsers,
        currentConvo,
        sendMessage,
        allConvo,
        getCurrentConvo,
        setCurretntConvo,
        getConnectedUser,
        getConvo,
        suggestUser
    }
}

export default useInbox