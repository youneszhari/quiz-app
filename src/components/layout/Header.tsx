import { ModeToggle } from "@/components/dark-mode/mode-toggle";

const Header = () => {
  return (
    <header className="w-full p-4 flex justify-center ">
      <ModeToggle />
    </header>
  );
};

export default Header;