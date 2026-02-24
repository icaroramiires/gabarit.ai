import { Sidebar } from "@/shared/ui/sidebar";
import { TopBar } from "@/shared/ui/topbar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-[#f0f8ff] dark:bg-[#0b0c10] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <TopBar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
