export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col px-4 py-12">
      <div className="mx-auto w-full max-w-xl">{children}</div>
    </main>
  );
}
