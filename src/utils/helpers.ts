import { useEffect, useState } from "react";

export function validateEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string) {
    // At least 8 characters
    if (password.length < 8) {
        return "At least 8 characters";
    }

    // Contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return "Contains at least one lowercase letter";
    }

    // Contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return "Contains at least one uppercase letter";
    }

    // Contains at least one digit
    if (!/[0-9]/.test(password)) {
        return "Contains at least one digit";
    }

    // Contains at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
        return "Contains at least one special character";
    }

    // All requirements met
    return true;
}

const useLoginHelper = () => {
    const [isValidInput, setisValidInput] = useState(false)
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    const [errorMessage, setErrorMessage] = useState<boolean | string>(true)
    const handleInput = () => {

    }
    const validateCredentials = () => {
        const { email, password } = credentials
        const isPasswordValid = validatePassword(password)
        setisValidInput(validateEmail(email) && isPasswordValid === true)
        if (password.trim().length != 0) {
            setErrorMessage(isPasswordValid)
        }
    }
    useEffect(() => {
        validateCredentials()
    }, [credentials])

    return {
        setisValidInput,
        setCredentials,
        errorMessage,
        isValidInput
    }
}

export default useLoginHelper