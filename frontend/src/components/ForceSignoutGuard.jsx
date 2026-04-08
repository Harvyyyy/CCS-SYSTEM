import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import bgImage from '../assets/bg.jpg';

const ForceSignoutGuard = ({ onLogout }) => {
  // Force light mode so the layout looks correct 
  useEffect(() => {
    document.body.classList.remove('dark-theme');
  }, []);

  return (
    <div style={{
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999999
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      }}></div>

      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#fef2f2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: '#ef4444'
        }}>
          <LogOut size={32} />
        </div>
        
        <h2 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '24px', fontWeight: 'bold' }}>Session Invalidated</h2>
        
        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '15px', border: '1px solid #fee2e2', fontWeight: '500', lineHeight: '1.5' }}>
          Your Account's Password has been reset. Please signout and login again.
        </div>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--primary-color, #db5515)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ForceSignoutGuard;
