import { use, useEffect, useState } from 'react';
import firebase_app from '../firebase-config'
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import { User, UserStore } from '~/store/userStore';

const auth = getAuth(firebase_app);
const provider = new GoogleAuthProvider();

const useAuth = () => {
    const { initUser, user } = UserStore()
    const signUp = async (email: string, password: string) => {
        let result = null,
            error = null;
        try {
            result = await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
            error = e;
        }
        return { result, error };
    }

    const googleAuth = ({ callBack }: { callBack: (user: User) => void }) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = {
                    _id: result.user.providerId,
                    username: result.user.displayName ?? "",
                    email: result.user.email ?? "",
                }
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                initUser(user)
                callBack(user)
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }
    const updateUsername = async ({ username }: { username: string }) => {
        if (auth.currentUser) {
            const profileUpdated = await updateProfile(auth.currentUser, { displayName: username }).then((reason) => {
                return true
            })
            return profileUpdated

        }
        else {
            return false
        }
    }

    return {
        user,
        googleAuth,
        updateUsername
    }

}

export default useAuth