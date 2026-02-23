"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ArrowLeftBack({ className, children, name='返回' }: {
    name?: string,
    className?: string,
    children?: React.ReactNode
}) {
    const router = useRouter()
    return (
        <div className="flex items-center gap-4 px-4 py-3">
            <div

                className="p-2 hover:bg-muted/70 rounded-full transition-colors"
            >
                <ArrowLeft
                    className={className}
                    onClick={() => {
                        router.replace('/imitation-x')
                    }} />
                {/* <ArrowLeft className="w-5 h-5" /> */}
            </div>
            <div>
                <h1 className="text-xl font-bold">{name}</h1>
                {children}
            </div>
        </div>

    )
}
