import { useLanguage } from '@/contexts/LanguageContext';
import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();
  const { language,t } = useLanguage();
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: t("common.toggleTheme"),
      shortcut: ['t', 't'],
      section: t("common.theme"),
      perform: toggleTheme
    },
    {
      id: 'setLightTheme',
      name: t("common.setLightTheme"),
      section: t("common.theme"),
      perform: () => setTheme('light')
    },
    {
      id: 'setDarkTheme',
      name: t("common.setDarkTheme"),
      section: t("common.theme"),
      perform: () => setTheme('dark')
    }
  ];

  useRegisterActions(themeAction, [theme,language]);
};

export default useThemeSwitching;
