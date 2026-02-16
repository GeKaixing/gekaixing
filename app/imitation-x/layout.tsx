// app/layout.tsx
import Footer from "@/components/gekaixing/Footer";
import MobileAdd from "@/components/gekaixing/MobileAdd";
import MobileFooter from "@/components/gekaixing/MobileFooter";
import MobileHeader from "@/components/gekaixing/MobileHeader";
import PostModal from "@/components/gekaixing/PostModal";
import Sidebar from "@/components/gekaixing/Sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return (
        <div className="min-h-screen">
            {/* <MobileAdd /> */}
            <MobileHeader user={user} />
            <div className="flex justify-center w-full mx-auto min-h-screen">
                <header className="hidden sm:flex w-[88px] lg:w-[275px] shrink-0 sticky top-0 h-screen transition-all duration-200">
                    <Sidebar user={user} />
                </header>
                <main className="flex-1 w-full max-w-[600px] border-x border-border sm:border-x">
                    {children}
                    {/* <PostModal /> */}
                </main>
                <footer className="hidden xl:flex w-[350px] shrink-0 pl-8 py-4 sticky top-0 h-screen overflow-y-auto">
                    <Footer />
                </footer>
            </div>
            <MobileFooter id={user?.id} />
        </div>
    );
}
