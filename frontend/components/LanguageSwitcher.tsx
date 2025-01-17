import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog';
import { Globe } from 'lucide-react';

// Define types for our language object
type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
];

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { pathname, asPath, query, locale } = router;

  // Add type for newLocale parameter
  const changeLanguage = async (newLocale: string) => {
    try {
      console.log('Changing language:', {
        from: locale,
        to: newLocale,
        pathname,
        asPath
      });
      
      setOpen(false);
      
      await router.replace(
        { pathname, query },
        asPath,
        { locale: newLocale, scroll: false }
      );
      
      router.push(router.asPath);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="flex items-center gap-2 px-3 py-2 text-black rounded-md hover:bg-gray-100"
          aria-label={`Current language: ${currentLanguage.name}`}
        >
          <Globe className="w-5 h-5" />
          <span className="hidden md:inline">{currentLanguage.name}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-black">
        <DialogHeader>
          <DialogTitle>{t('selectLanguage', 'Select Language')}</DialogTitle>
          <DialogDescription>
            {t('Choose your preferred language from the options below')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${locale === language.code 
                  ? 'bg-green-100 text-green-700 font-medium' 
                  : 'hover:bg-gray-100'
                }`}
              aria-current={locale === language.code ? 'true' : 'false'}
            >
              <span className="text-xl" role="img" aria-label={`${language.name} flag`}>
                {language.flag}
              </span>
              <span className="flex-1 text-left">{language.name}</span>
              {locale === language.code && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};