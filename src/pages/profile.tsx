import { useRouter } from "next/router"
import { useState } from "react"
import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import PageContainer from "~/components/container/PageContainer"
import useAuth from "~/hooks/useAuth"

const ProfilePage = () => {
    const { updateUsername } = useAuth()
    const [username, setUsername] = useState("")
    const { push } = useRouter()
    const validateUsername = (_username: string) => {
        return _username.trim().length > 2
    }
    return (
        <PageContainer>
            <div className="flex animate__animated animate__fadeInUp w-[320px] h-[40px] p-[20px] flex-col gap-5">
                <div className="flex min-h-[20px]">
                    {validateUsername(username) &&
                        <div className="flex animate__animated animate__fadeInDown  gap-[5px] text-gray-700">Hello there <span className="font-bold text-gray-900"> {username}</span>👋🏻</div>}
                </div>
                <div className="flex w-full">
                    <Input
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        placeholder="What do you want to be called?" />
                </div>
                <div className="flex">
                    {
                        <Button
                            disabled={!validateUsername(username)}
                            className="w-full text-gray-300 gap-[6px]" onClick={async () => {
                                if (validateUsername(username)) {
                                    const update = await updateUsername({ username })
                                    if (update) {
                                        push("/chat")
                                    }
                                }
                            }}>Proceed </Button>}
                </div>
            </div>
        </PageContainer>
    )
}


export default ProfilePage