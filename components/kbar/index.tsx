'use client';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch
} from 'kbar';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useRegisterActions } from "kbar";
import RenderResults from './render-result';
import useThemeSwitching from './use-theme-switching';
import { useLanguage } from '@/contexts/LanguageContext';

export default function KBar({ children, navItems }: { children: React.ReactNode; navItems: any }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const navigateTo = (url: string) => router.push(url);

  // ✅ Memoized actions that update when the language changes
  const actions = useMemo(() => {
    console.log("🔄 Updating actions due to language change:", language);
    return navItems.flatMap((navItem) => {
      const baseAction =
        navItem.url !== '#'
          ? {
              id: `${navItem.title.toLowerCase()}Action`,
              name: t(`nav.${navItem.title}`),
              shortcut: navItem.shortcut,
              keywords: navItem.title.toLowerCase(),
              section: t("common.navigation"),
              subtitle: `${t('common.goTo')} ${t(`nav.${navItem.title}`)}`,
              perform: () => navigateTo(navItem.url),
            }
          : null;

      const childActions =
        navItem.items?.map((childItem) => ({
          id: `${childItem.title.toLowerCase()}Action`,
          name: t(`nav.${childItem.title}`),
          shortcut: childItem.shortcut,
          keywords: childItem.title.toLowerCase(),
          section: t(`nav.${navItem.title}`),
          subtitle: `${t('common.goTo')} ${t(`nav.${childItem.title}`)}`,
          perform: () => navigateTo(childItem.url),
        })) ?? [];

      return baseAction ? [baseAction, ...childActions] : childActions;
    });
  }, [language, t, navItems]); // ✅ Ensure re-computation when language changes

  return (
    <KBarProvider actions={[]}> {/* ✅ Pass empty array to avoid stale actions */}
      <KBarComponent language={language} t={t} actions={actions}>{children}</KBarComponent> {/* ✅ Pass actions to manually register */}
    </KBarProvider>
  );
}

// ✅ Component that manually registers actions to KBar
const KBarComponent = ({ children, actions,language,t }: { children: React.ReactNode; actions: any,language: string,t: any }) => {
  
  useRegisterActions(actions, [actions]);
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[99999] bg-black/80  !p-0 backdrop-blur-sm" style={{direction: `${language === 'ar' ? 'rtl' : 'ltr'}`}}>
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-background text-foreground shadow-lg">
            <div className="bg-background">
              <div className="border-x-0 border-b-2">
                <KBarSearch defaultPlaceholder={t('common.search')}  className="w-full border-none bg-background px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
