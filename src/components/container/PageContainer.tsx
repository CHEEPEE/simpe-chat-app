import { PropsWithChildren } from "react";

const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex w-full h-full items-center justify-center">
            {children}
        </div>
    )
}

export default PageContainer