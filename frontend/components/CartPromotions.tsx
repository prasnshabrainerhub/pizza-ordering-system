import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Coupon, DiscountType } from '../types/types';

interface CartPromotionsProps {
  coupons: Array<Coupon>;
  onApplyCoupon: (coupon: Coupon) => void;
  loading: boolean;
}

const CartPromotions: React.FC<CartPromotionsProps> = ({ coupons, onApplyCoupon, loading = false }) => {
  const { t } = useTranslation();
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">{t('No active promotions available')}</p>
      </div>
    );
  }

  const mainCoupon = coupons[0];
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1 bg-black text-white rounded">%</span>
          <span className="font-medium">
            {mainCoupon.description || (mainCoupon.discount_type === DiscountType.PERCENTAGE
              ? `${mainCoupon.discount_value}% off`
              : `₹${mainCoupon.discount_value} off`)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{t('Code:')} {mainCoupon.code}</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onApplyCoupon(mainCoupon)}
            className="text-green-600 font-medium"
          >
            {t('Apply')}
          </button>
          <button
            onClick={() => setShowAllCoupons(true)}
            className="text-green-600 font-medium"
          >
            {t('View More Offers')}
          </button>
        </div>
      </div>

      <Dialog open={showAllCoupons} onOpenChange={setShowAllCoupons}>
        <DialogContent className="max-w-2xl text-black">
          <DialogHeader>
            <DialogTitle>{t('Available Promotions')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.coupon_id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="bg-green-500 text-white text-center rounded px-2 py-1 text-sm inline-block mb-2">
                  {coupon.code}
                </div>
                <p className="font-semibold">
                  {coupon.description || (coupon.discount_type === DiscountType.PERCENTAGE
                    ? `${coupon.discount_value}% off`
                    : `₹${coupon.discount_value} off`)}
                </p>
                <button
                  onClick={() => {
                    onApplyCoupon(coupon);
                    setShowAllCoupons(false);
                  }}
                  className="mt-2 text-green-600 font-medium"
                >
                  {t('Apply')}
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartPromotions;