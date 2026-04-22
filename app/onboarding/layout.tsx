export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-stretch justify-center bg-neutral-50 md:items-center md:px-4 md:py-6">
      <div className="flex w-full flex-col overflow-hidden bg-white md:h-[calc(100dvh-3rem)] md:max-h-225 md:w-[min(460px,100%)] md:overflow-y-auto md:rounded-3xl md:shadow-2xl md:ring-1 md:ring-black/10">
        {children}
      </div>
    </main>
  );
}
