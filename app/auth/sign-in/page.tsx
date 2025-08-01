import SignIn from "@/components/sign-in";

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col gap-8 min-h-screen">
      <h1 className="text-5xl sm:text-7xl font-black text-center relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
        Archive Space
      </h1>
      <SignIn />
    </main>
  );
}
