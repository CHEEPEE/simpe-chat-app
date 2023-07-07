
import { query, where, collection, doc, setDoc, getDocs, getDoc } from "firebase/firestore";
import { db } from "~/firebase-config";
import { COLLECTIONS } from "~/utils/strings";

const useUser = () => {

    const getUser = async ({ id }: { id: string }) => {
        return (await getDoc(doc(db, COLLECTIONS.USERS, id))).data()
    }

    return {
        getUser
    }
}

export default useUser