import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Welcome to Hud's audio management system!</h1>
      <Image
        src="/cat_pic.jpg"
        width={500}
        height={500}
        alt="A funny picture."
      />
      <h2>
        Click <a href="/login">here</a> to begin.
      </h2>
    </main>
  );
}
