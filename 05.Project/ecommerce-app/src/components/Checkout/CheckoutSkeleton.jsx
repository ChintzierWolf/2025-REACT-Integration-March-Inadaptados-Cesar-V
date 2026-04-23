import React from 'react';
import Skeleton from '../common/Skeleton/Skeleton';
import './CheckoutSkeleton.css';

const CheckoutSkeleton = () => {
  return (
    <div className="checkout-wrapper skeleton-checkout">
      <div className="checkout-header">
        <Skeleton width="300px" height="40px" />
        <Skeleton width="150px" height="20px" />
      </div>

      <div className="checkout-grid">
        <div className="checkout-main">
          {/* Módulo Direcciones */}
          <div className="checkout-module active">
            <div className="module-header">
              <Skeleton width="200px" height="24px" />
            </div>
            <div className="module-content">
              <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                <Skeleton width="100%" height="80px" />
              </div>
            </div>
          </div>

          {/* Módulo Pago */}
          <div className="checkout-module active">
            <div className="module-header">
              <Skeleton width="180px" height="24px" />
            </div>
            <div className="module-content">
              <div style={{ display: 'flex', gap: '20px' }}>
                <Skeleton width="100%" height="80px" />
              </div>
            </div>
          </div>

          {/* Módulo Items */}
          <div className="checkout-module active">
            <div className="module-header">
              <Skeleton width="220px" height="24px" />
            </div>
            <div className="module-content">
              {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <Skeleton width="80px" height="80px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="20px" style={{ marginBottom: '10px' }} />
                    <Skeleton width="30%" height="15px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <Skeleton width="100%" height="250px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
