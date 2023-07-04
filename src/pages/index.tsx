import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import PageContainer from "~/components/container/PageContainer";
import { api } from "~/utils/api";



const HomePage = () => {
  return (
    <PageContainer>
      <div className="transition-all gap-[20px] flex text-[13px] flex-col">
        <div className="flex text-gray-600 text-[14px]">
          🎉 I'm Glad you made it! 🥳
        </div>
        <div className="flex text-gray-400 gap-[5px]">
          To get started you can <Link className="text-bold text-gray-600 hover:text-orange-400" href={'/login'}>Log in</Link>
        </div>
        <div className="flex text-gray-400 gap-[5px]">
          or <Link className="text-bold text-gray-600 hover:text-orange-400" href={'/signup'}>Sign up</Link> if don't have your account yet
        </div>
      </div>
    </PageContainer>
  )
}

export default HomePage