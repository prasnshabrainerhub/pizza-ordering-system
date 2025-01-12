import { CartProvider } from './components/CartContext';
import {Header} from './components/Header';
import { Cart } from './pages/cart';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <Cart />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}