export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-50 md:items-center md:px-4 md:py-6">
      <div className="w-full px-4 py-8 md:h-[calc(100dvh-3rem)] md:max-h-[900px] md:w-[min(420px,100%)] md:overflow-y-auto md:rounded-3xl md:bg-white md:p-6 md:shadow-2xl md:ring-1 md:ring-black/10">
        {children}
      </div>
    </main>
  );
}
