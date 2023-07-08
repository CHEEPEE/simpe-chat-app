import { useRouter } from 'next/router'
import clsx from 'clsx'
import { Input } from '~/@/components/ui/input'
import { validateEmail } from '~/utils/helpers'
import useInbox, { Message } from '~/hooks/useInbox'
import { UserConvo } from './inbox'
import { User, UserStore } from '~/store/userStore'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import useUser from '~/hooks/useUser'
import { Button } from '~/@/components/ui/button'
import { Send, UserCog2 } from 'lucide-react';

const ChatBubble = ({ chat }: { chat: Message }) => {
    const { user } = UserStore()
    return (
        <div className={clsx("flex text-[13px] w-full animate__animated animate__fastest ", user?._id == (chat as any)?.user ? "justify-end animate__fadeInUp" : "animate__fadeInUp")}>
            <div className={clsx("flex max-w-[320px] w-content rounded-[10px] px-[10px]  py-[5px] shadow-sm"
                , user?._id != (chat as any)?.user ? "bg-gradient-to-r from-red-200 text-gray-800 to-orange-200" : "text-white bg-gradient-to-r from-orange-400 to-orange-300"
            )}>{chat.text}</div>
        </div>
    )
}
const UseChatProfile = ({ user }: { user: User }) => {
    return (user && <div className="flex w-full items-center p-[20px] gap-[10px] justify-center flex-col">
        <Image className="rounded-[50%] animate__animated animate__fadeInDown" alt={user?.username} src={user?.photoUrl} width={100} height={100} />
        <div className="flex font-bold text-[36px] animate__animated animate__fastest animate__fadeInDown">
            {user?.username}
        </div>
    </div>)
}
const CurrentConvoBox = () => {
    const { query } = useRouter()
    const { user: currentUser } = UserStore()
    const [message, setMessage] = useState(null)

    const { searchByEmail, sendMessage, searchResult, connectedUsers, getCurrentConvo, currentConvo } = useInbox()
    useEffect(() => {
        let scrollElement = document.getElementById("chatBox")
        if (scrollElement != undefined) {
            scrollElement.scrollTop = scrollElement.scrollHeight
        }
    }, [currentConvo])
    return (
        <div className={clsx("flex static h-full w-full", !query?.id && 'w-full')}>
            {!query.id && (
                <div className="flex w-full h-full  items-center justify-center">
                    <div className="flex flex-col gap-[10px] w-full max-w-[480px] p-[20px]">
                        <div className="flex text-gray-400 text-[13px]">{"Searching for someone? Try search 👇🏻 his/her email"} </div>
                        <Input
                            className="text-gray-600 text-bold"
                            onChange={(e) => validateEmail(e.target.value) && searchByEmail(e.target.value)}
                            placeholder="Search Email" />
                        {searchResult.length != 0 && <div className="flex text-[12px] text-green-600">Yeeiihayy 🎉 We got results!🍻 Is he/she 👇🏻 you are looking for?</div>}
                        {searchResult.map((user: User) => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                    </div>
                </div>
            )}
            <div id={"chatBox"} className="flex flex-col gap-[10px] overflow-y-scroll w-full h-full p-[20px] bottom-[70px] pb-[70px]">
                <UseChatProfile user={connectedUsers?.filter((user: User) => user._id == query.id)[0] as User} />
                {getCurrentConvo({ userId: currentUser?._id as string, recipeintId: query.id as string })?.messages?.reverse().map((message: Message, index: number) => {
                    if (index - 1 == currentConvo?.messages?.length) {
                        return <div className="flex "><ChatBubble chat={message} /></div>
                    }
                    return <ChatBubble chat={message} />
                })}
            </div>
            <div className="flex backdrop-blur-2xl max-w-[calc(100%-320px)] gap-[10px] w-full px-[20px] py-[10px] absolute bottom-[0px]">
                {query?.id && (
                    <>
                        <Input
                            // value={message ?? ""}
                            onKeyDown={(e: any) => {
                                if (e.shiftKey && e.key === "Enter") {
                                    // Insert a line break
                                    // setText(e.target.value + "\n")
                                    setMessage(e.target.value)
                                }
                                else if (e.key === "Enter") {
                                    // Submit the form
                                    e.preventDefault(); // Prevents the default form submission
                                    // setMessage(e.target.value)
                                    if (e.target.value.trim().length != 0) {
                                        sendMessage({ text: e.target.value })
                                        setMessage(null)
                                        e.target.value = ""
                                    }

                                    // Replace the following line with your own code to handle form submission
                                }
                            }}
                            placeholder="Send a message ✨" /> <Button className="bg-orange-100" variant={'secondary'}> <Send className="text-orange-400" /></Button>
                    </>
                )}
            </div>
        </div>
    )
}

export default CurrentConvoBox