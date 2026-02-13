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
        <div>
            <MobileAdd />
            <MobileHeader user={user} />
            <div className="flex justify-center h-screen sm:max-w-[80%] mx-auto">
                <header className="max-sm:hidden p-4">
                    <Sidebar user={user} />
                </header>
                <main className="flex-1 max-sm:px-4 sm:p-4">
                    {children}
                    <PostModal />
                </main>
                <MobileFooter id={user?.id} />
                <footer className="max-sm:hidden p-4">
                    <Footer />
                </footer>
            </div>
        </div>
    );
}
