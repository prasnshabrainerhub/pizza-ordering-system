import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';
import { CartProvider } from '../components/CartContext';
import nextI18NextConfig from '../next-i18next.config.js';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);