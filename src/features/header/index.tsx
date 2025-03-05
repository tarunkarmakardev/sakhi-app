import { Logo } from "../logo";
import SelectLanguage from "../select-language";

export default function Header() {
  return (
    <div className="flex items-center gap-2 justify-between">
      <Logo />
      <SelectLanguage />
    </div>
  );
}
