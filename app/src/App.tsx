import { IntlProvider } from 'react-intl';
import Router from './router/router.tsx';

import { useAppSelector } from './redux/hooks.ts';
import { selectUserLocale } from './redux/user/userSelectors.ts';
import { constants } from './constants/constants';

import lang_ua from './translations/ua.json';
import lang_en from './translations/en.json';

const translations = {
  ua: lang_ua,
  en: lang_en,
};

export const App = () => {
  const locale = useAppSelector(selectUserLocale);
  return (
    <IntlProvider locale={constants.localeLang[locale]} messages={translations[locale]}>
      <Router />
    </IntlProvider>
  );
};
