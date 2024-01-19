import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1
        style={{
          WebkitTextStroke: "1px",
          WebkitTextFillColor: "white",
          fontSize: "60px",
        }}
      >
        Welcome to Hud&aposs audio management system!
      </h1>
      <Image
        src="/cat_pic.jpg"
        width={500}
        height={500}
        alt="A funny picture."
      />
      <h2>
        <p
          style={{
            WebkitTextStroke: "1px",
            WebkitTextFillColor: "white",
            fontSize: "48px",
          }}
        >
          Click <Link href="/login">here</Link> to begin.
        </p>
      </h2>
    </main>
  );
}
