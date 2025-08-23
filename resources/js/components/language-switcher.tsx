import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
];

export default function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    router.get(`/language/${lang}`, {}, { preserveScroll: true });
    setOpen(false);
  };

  return (
    <div className="relative inline-block mx-2">
      {/* Trigger text */}
      <span
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="w-3 h-3 text-gray-500" />
      </span>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border z-50">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 transition ${
                i18n.language === lang.code
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
