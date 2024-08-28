import { MoonIcon, SunIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface IThemeSwitch {
  className?: string;
}

const ThemeSwitch = ({ className = "" }: IThemeSwitch) => {
  const [checked, setChecked] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) {
      setChecked(theme === "dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <SunIcon className="h-4 w-4" />
      <Switch checked={checked} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
      <MoonIcon className="h-4 w-4" />
    </div>
  );
};

export default ThemeSwitch;
