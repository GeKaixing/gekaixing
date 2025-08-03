
"use server"
import Footer from "@/components/towel/Footer";
import Sidebar from "@/components/towel/Sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
   
   
    return (
        <div
        >
            <div className="flex justify-center  h-screen max-w-[80%]  mx-auto">
                <header className="p-4">
                    <Sidebar user={user} />
                </header>
                <main className="flex-1  p-4">
                    {children}
                </main>

                <footer className="p-4">
                    <Footer />
                </footer>
            </div>
        </div>

    );
}
