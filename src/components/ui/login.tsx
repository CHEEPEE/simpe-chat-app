import { useRouter } from "next/router"
import Link from "next/link"

import { useEffect, useState } from "react"
import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import useAuth from "~/hooks/useAuth"
import { User } from "~/store/userStore"
import useLoginHelper, { validateEmail, validatePassword } from "~/utils/helpers"

const Login = () => {
    const { isValidInput, setCredentials, credentials } = useLoginHelper()
    const { googleAuth, login } = useAuth()
    const { push } = useRouter()
    const hanleGoogleAuthCallback = (user: User) => {
        if (user.username.trim().length != 0) {
            push('/chat')
        } else {
            push('/profile')
        }
    }
    return (
        <div className="flex flex-col w-full justify-center items-center gap-[40px]">
            <div className="transition flex w-full sm:max-w-[320px] bg-white sm:shadow-lg p-[20px] pt-[40px] rounded-xl flex-col">
                <div className="flex flex-col gap-5">
                    <div className="flex">
                        <h3 className="font-bold text-gray-600 text-xl"> Login</h3>
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
                        <Input className="border-orange-100"
                            onChange={(e) => {
                                setCredentials(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))
                            }}
                            placeholder="Password" />
                    </div>

                    <div className="flex">
                        {/* Submit */}
                        <Button disabled={!isValidInput}
                            onClick={() => {
                                login(credentials.email, credentials.password, hanleGoogleAuthCallback)
                            }}
                            className="w-full bg-orange-600">Login</Button>
                    </div>

                    <div className="flex justify-center flex-col  text-center">
                        {/* or */}
                        <div className="text-gray-500">
                            or
                        </div>
                    </div>
                    <div className="flex">
                        {/* Google Login */}
                        <Button variant={'outline'}
                            onClick={() => {
                                googleAuth({ callBack: hanleGoogleAuthCallback })
                            }}
                            className="w-full border-orange-100 hover:bg-orange-100">Google</Button>
                    </div>
                </div>
            </div>
            <div className="flex items-center text-[13px] gap-[5px] text-gray-600 justify-center">
                Need an account?<Link href={"/signup"} className="font-bold hover:text-orange-400">Signup</Link>
            </div>
        </div>
    )
}

export default Login