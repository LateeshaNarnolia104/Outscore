import SignOutButton from "../Button/SignOutButton";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 border-b border-neutral-800">
      <div className="text-2xl font-extrabold tracking-tight">
        <span className="text-pink-500">Out</span>score
      </div>

      <SignOutButton />
    </nav>
  );
}