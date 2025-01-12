import { useRouter } from 'next/router';
import {Header} from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Checkout = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto p-4">
        <Link href="/cart" className="inline-flex items-center gap-2 mb-6 text-green-600">
          <ArrowLeft size={24} />
          <span className="font-medium">Back</span>
        </Link>
      </div>

      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f7f7', minHeight: '100vh', padding: '20px' }}>
        <main>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'green', margin: 0 }}>Secure Payment Options</h2>
          </div>
          <div
          style={{
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleBackClick}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '5px' }}>←</span> Back
          </button>
          <h3 style={{ margin: 0 }}>
            To Pay <span style={{ color: 'red' }}>662</span>
          </h3>
          <div></div>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: '1 1 200px',
              backgroundColor: '#ffffff',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '50px', color: '#4CAF50' }}>💵</div>
            <h4 style={{ marginTop: '10px' }}>Cash On Delivery</h4>
          </div>
          <div
            style={{
              flex: '1 1 200px',
              backgroundColor: '#ffffff',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '50px', color: '#4CAF50' }}>📱</div>
            <h4 style={{ marginTop: '10px' }}>Online</h4>
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};

export default Checkout;
