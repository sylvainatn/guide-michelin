import { DashboardSidebar } from "../../components/organisms/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-1 bg-neutral-100">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
          {children}
        </div>
      </section>
    </main>
  );
}
