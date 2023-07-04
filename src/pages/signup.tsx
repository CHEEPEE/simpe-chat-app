import { useRouter } from "next/router"
import Link from "next/link"

import { useEffect, useState } from "react"
import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import useAuth from "~/hooks/useAuth"
import { User } from "~/store/userStore"
import useLoginHelper, { validateEmail, validatePassword } from "~/utils/helpers"
import PageContainer from "~/components/container/PageContainer"

const SignUpPage = () => {
    const { isValidInput, errorMessage, setCredentials, credentials } = useLoginHelper()
    const { googleAuth, signUp } = useAuth()
    const { push } = useRouter()
    const hanldeSignUpCallback = (user: User) => {
        if (user.username.trim().length != 0) {
            push('/chat')
        } else {
            push('/profile')
        }
    }
    return (
        <PageContainer>
            <div className="flex flex-col w-full justify-center items-center gap-[40px]">
                <div className="transition flex w-full sm:max-w-[320px] bg-white sm:shadow-lg p-[20px] pt-[40px] rounded-xl flex-col">
                    <div className="flex flex-col gap-5">
                        <div className="flex">
                            <h3 className="font-bold text-gray-600 text-xl"> Create Account</h3>
                        </div>
                        <div className="flex">
                            {/* Email */}
                            <Input className="border-orange-100" placeholder="Email"
                                onChange={(e) => {
                                    setCredentials(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))
                                }}
                            />
                        </div>
                        <div className="flex">
                            {/* Password */}
                            <Input
                                type="password"
                                onChange={(e) => {
                                    setCredentials(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }}
                                className="border-orange-100" placeholder="Password" />
                        </div>
                        <div className="flex text-xs h-[20px] text-red-300">
                            {errorMessage && <div className="animate__animated animate__fadeIn">{errorMessage}</div>}
                        </div>
                        <div className="flex">
                            {/* Submit */}
                            <Button disabled={!isValidInput}
                                onClick={() => {
                                    signUp(credentials.email, credentials.password, hanldeSignUpCallback)
                                }}
                                className="w-full transition-all bg-orange-600">Proceed</Button>
                        </div>

                    </div>
                </div>

            </div>
        </PageContainer>
    )
}

export default SignUpPage