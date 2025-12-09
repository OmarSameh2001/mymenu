import HomeSearch from "@/app/_components/home/search/search";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-2">
      <h1>Welcome to MyMenu</h1>
      <h2>Your favorite menu management app.</h2>
      <HomeSearch />
    </div>
  );
}
