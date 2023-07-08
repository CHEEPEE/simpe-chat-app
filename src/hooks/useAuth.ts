import { use, useEffect, useState } from 'react';
import firebase_app, { auth, db } from '../firebase-config'
import { initializeApp, getApp } from "firebase/app";
import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider
} from "firebase/auth";
import {
    User,
    UserStore
} from '~/store/userStore';
import { randAvatar } from '~/utils/strings';

const provider = new GoogleAuthProvider();

const useAuth = () => {
    const { initUser, user } = UserStore()
    const getuserFromResult = (result: any) => {
        const user = {
            _id: result.user.uid,
            username: result.user.displayName ?? "",
            email: result.user.email ?? "",
            photoUrl: result.user.photoURL ?? ""
        }
        return user
    }
    const signUp = async (email: string, password: string, callBack: (user: User) => void) => {
        let result = null,
            error = null;
        try {
            await createUserWithEmailAndPassword(auth, email, password).then((result) => {
                callBack(getuserFromResult(result))
                updateUserProfile(getuserFromResult(result))
            })
        } catch (e) {
            error = e;
        }
        return { result, error };
    }
    const login = async (email: string, password: string, callBack: (user: User) => void) => {
        let result = null,
            error = null;
        try {
            await signInWithEmailAndPassword(auth, email, password).then((result) => {
                callBack(getuserFromResult(result))
                updateUserProfile(getuserFromResult(result))
            })
        } catch (e) {
            error = e;
        }
        return { result, error };
    }

    const updateUserProfile = async (user: User) => {
        try {
            // const docRef = await addDoc(collection(db, "users"), user);
            await updateDoc(doc(db, "users", user._id), user);

        } catch (e) {
            await setDoc(doc(db, "users", user._id), user);
            console.error("Error adding document: ", e);
        }
    }

    const googleAuth = ({ callBack }: { callBack: (user: User) => void }) => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = getuserFromResult(result)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                initUser(user)
                callBack(user)
                updateUserProfile(user)


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
            const profileUpdated = await updateProfile(auth.currentUser, { displayName: username, photoURL: randAvatar() }).then((reason) => {
                if (auth.currentUser) {
                    const user = {
                        _id: auth.currentUser.uid,
                        username: auth.currentUser.displayName ?? "",
                        email: auth.currentUser.email ?? "",
                        photoUrl: auth.currentUser.photoURL ?? ""
                    }
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    console.log(auth.currentUser);

                    initUser(user)
                    updateUserProfile(user)
                }
                return true
            })
            return profileUpdated

        }
        else {
            return false
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                if (auth.currentUser) {
                    const user = {
                        _id: auth.currentUser.uid,
                        username: auth.currentUser.displayName ?? "",
                        email: auth.currentUser.email ?? "",
                        photoUrl: auth.currentUser.photoURL ?? "",
                    }
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    initUser(user)
                }
                // ...
            } else {
                // User is signed out
                // ...
            }
        });

    }, [])

    return {
        user,
        googleAuth,
        updateUsername,
        signUp,
        login
    }

}

export default useAuth