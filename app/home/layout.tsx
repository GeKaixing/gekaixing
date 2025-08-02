
import Footer from "@/components/towel/Footer";
import Sidebar from "@/components/towel/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
        >
            <div className="flex justify-center  h-screen max-w-[80%]  mx-auto">
                <header className="p-4">
                    <Sidebar />
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
