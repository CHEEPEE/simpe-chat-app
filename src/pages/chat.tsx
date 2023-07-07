import { Button } from "~/@/components/ui/button"
import { Input } from "~/@/components/ui/input"
import PageContainer from "~/components/container/PageContainer"
import useAuth from "~/hooks/useAuth"
import { Send, UserCog2 } from 'lucide-react';
import Image from 'next/image'
import Link from "next/link"
import { randAvatar } from "~/utils/strings";
import useInbox, { Message } from "~/hooks/useInbox";
import { validateEmail } from "~/utils/helpers";
import { UserConvo } from "~/components/ui/inbox";
import { useRouter } from "next/router"
import { useState } from 'react'
import clsx from 'clsx'
const ChatBubble = ({ chat }: { chat: Message }) => {
    return (
        <div className="flex w-full justify-end">
            <div className="flex w-content rounded-[20px] px-[15px] text-white py-[10px] bg-gradient-to-r from-orange-300 to-orange-400 shadow-md">{chat.text}</div>
        </div>
    )
}
const ChatPage = () => {
    const { searchByEmail, searchResult, suggestedUsers, currentConvo, connectedUser, sendMessage } = useInbox()
    const { user } = useAuth()
    const { query } = useRouter()
    const [message, setMessage] = useState(null)
    return (
        <PageContainer>
            <div className="flex w-full h-full">
                <div className="flex static bg-white min-w-[320px] border border-r-1 border-gray-100 gap-[20px] flex-col">
                    <div className="flex  flex-col px-[10px] py-[20px] backdrop-blur-3xl gap-[10px]">
                        <Link href={'/profile'}>
                            <div className="transition group rounded-md hover:cursor-pointer flex p-[10px] hover:bg-orange-100 gap-[10px] items-center">
                                <div className="flex border border-0 overflow-hidden rounded-[50%]">
                                    <Image width={72} height={72} src={user?.photoUrl ?? ""} alt="avatar" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between"><div className="text text-gray-800 font-bold text-[24px]">{user?.username}</div> <div className="transition-all group-hover:text-gray-500 text-white" ><UserCog2 /></div></div>
                                    <div className="text text-gray-500 text-[14px]">{user?.email}</div>
                                </div>
                            </div>
                        </Link>
                        {query.id &&
                            <Input
                                onChange={(e) => validateEmail(e.target.value) && searchByEmail(e.target.value)}
                                placeholder="Search Email" />}
                        <div className="flex gap-[5px] w-full flex-col">
                            {query.id && searchResult.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                            {query.id && connectedUser.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                        </div>
                    </div>
                    {suggestedUsers.slice(1).filter(user => connectedUser.findIndex(u => u._id == user._id) == -1).length != 0 && < div className="flex flex-col w-[300px] gap-[20px] absolute bottom-[0px] p-[20px]">
                        <div className="flex text-[13px] text-gray-400">
                            People you may know 🤸‍♀️
                        </div>
                        <div className="flex flex-col w-full gap-[10px]">
                            {suggestedUsers.slice(1).filter(user => connectedUser.findIndex(u => u._id == user._id) == -1).map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                        </div>
                    </div>}
                </div>
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
                                {searchResult.map(user => <UserConvo activeChatId={query.id as any} user={user} lastChat="we find ways" />)}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-[10px] w-full h-full p-[20px] pb-[70px]">
                        {currentConvo?.messages?.reverse().map((message: Message) => <ChatBubble chat={message} />)}
                    </div>
                    <div className="flex  max-w-[calc(100%-320px)] gap-[10px] w-full px-[20px] py-[10px] absolute bottom-[0px]">
                        {query?.id && currentConvo && (
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
                                            }

                                            // Replace the following line with your own code to handle form submission
                                        }
                                    }}
                                    placeholder="Send a message ✨" /> <Button className="bg-orange-100" variant={'secondary'}> <Send className="text-orange-400" /></Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer >
    )
}
export default ChatPage