import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import useAuth from "~/hooks/useAuth"
import { User } from "~/store/userStore"
import useLoginHelper, { validateEmail, validatePassword } from "~/utils/helpers"

const Login = () => {
    const { isValidInput } = useLoginHelper()
    const { googleAuth } = useAuth()
    const { push } = useRouter()
    const hanleGoogleAuthCallback = (user: User) => {
        if (user.username.trim().length != 0) {
            push('/chat')
        } else {
            push('/profile')
        }
    }
    return (
        <div className="flex w-full max-w-[302px] bg-white shadow-lg p-[20px] pt-[40px] rounded-md flex-col">
            <div className="flex flex-col gap-5">
                <div className="flex">
                    <h3 className="font-bold text-xl"> Login</h3>
                </div>
                <div className="flex">
                    {/* Email */}
                    <Input placeholder="Email" />
                </div>

                <div className="flex">
                    {/* Password */}
                    <Input placeholder="Password" />
                </div>

                <div className="flex">
                    {/* Submit */}
                    <Button disabled={!isValidInput} className="w-full">Login</Button>
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
                        className="w-full">Google</Button>
                </div>
            </div>
        </div>
    )
}

export default Login