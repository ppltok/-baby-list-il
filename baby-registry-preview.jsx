import React, { useState } from 'react';

// Design Tokens as inline styles
const tokens = {
  colors: {
    chestnut: '#954535',
    chestnutHover: '#a85a4a',
    chestnutLight: '#c9a8a2',
    beige: '#D2B48C',
    beigeLight: '#e0c9a8',
    cream: '#FAF9F6',
    creamDark: '#F5F3ED',
    sage: '#4A7C59',
    sageLight: '#6ba57d',
    terracotta: '#C4785B',
    white: '#FFFFFF',
    textPrimary: '#2D2D2D',
    textSecondary: '#5C5C5C',
    textMuted: '#8C8C8C',
    borderLight: '#E8E4DC',
  },
  fonts: {
    hebrew: "'Heebo', 'Assistant', sans-serif",
  },
};

// ============ BUTTON COMPONENTS ============
const Button = ({ variant = 'primary', size = 'md', children, icon, fullWidth, disabled, onClick }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: size === 'sm' ? '0 16px' : size === 'lg' ? '0 32px' : '0 24px',
    height: size === 'sm' ? '36px' : size === 'lg' ? '52px' : '44px',
    fontSize: size === 'sm' ? '14px' : '16px',
    fontWeight: 600,
    fontFamily: tokens.fonts.hebrew,
    borderRadius: '9999px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: tokens.colors.chestnut,
      color: tokens.colors.white,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: tokens.colors.chestnut,
      border: `2px solid ${tokens.colors.chestnut}`,
    },
    beige: {
      backgroundColor: tokens.colors.beige,
      color: tokens.colors.textPrimary,
    },
    sage: {
      backgroundColor: tokens.colors.sage,
      color: tokens.colors.white,
    },
    white: {
      backgroundColor: tokens.colors.white,
      color: tokens.colors.chestnut,
      border: `1px solid ${tokens.colors.borderLight}`,
    },
  };

  return (
    <button style={{ ...baseStyle, ...variants[variant] }} disabled={disabled} onClick={onClick}>
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  );
};

const IconButton = ({ icon, variant = 'default', size = 'md' }) => {
  const sizeMap = { sm: 32, md: 40, lg: 48 };
  const style = {
    width: sizeMap[size],
    height: sizeMap[size],
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: variant === 'filled' ? tokens.colors.cream : variant === 'primary' ? tokens.colors.chestnut : 'transparent',
    color: variant === 'primary' ? tokens.colors.white : tokens.colors.textPrimary,
  };
  return <button style={style}>{icon}</button>;
};

// ============ BADGE COMPONENTS ============
const Badge = ({ status, children, size = 'md' }) => {
  const statusColors = {
    available: { bg: tokens.colors.sage, color: tokens.colors.white },
    purchased: { bg: tokens.colors.sage, color: tokens.colors.white },
    required: { bg: tokens.colors.terracotta, color: tokens.colors.white },
    optional: { bg: tokens.colors.beigeLight, color: tokens.colors.textPrimary },
    waiting: { bg: tokens.colors.beige, color: tokens.colors.textPrimary },
    new: { bg: tokens.colors.chestnut, color: tokens.colors.white },
  };

  const labels = {
    available: 'זמין',
    purchased: 'נקנה',
    required: 'חובה',
    optional: 'אופציונלי',
    waiting: 'ממתין',
    new: 'חדש',
  };

  const colors = statusColors[status] || { bg: tokens.colors.beige, color: tokens.colors.textPrimary };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: size === 'sm' ? '22px' : '28px',
      padding: '0 12px',
      fontSize: size === 'sm' ? '12px' : '14px',
      fontWeight: 600,
      fontFamily: tokens.fonts.hebrew,
      borderRadius: '8px',
      backgroundColor: colors.bg,
      color: colors.color,
    }}>
      {children || labels[status]}
    </span>
  );
};

const UserBadge = ({ name, emoji, isAnonymous }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    backgroundColor: isAnonymous ? tokens.colors.beigeLight : tokens.colors.cream,
    borderRadius: '9999px',
    fontSize: '14px',
    fontFamily: tokens.fonts.hebrew,
  }}>
    <span style={{
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: tokens.colors.beige,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
    }}>{emoji || '👤'}</span>
    <span style={{ fontWeight: 500 }}>{name}</span>
  </span>
);

// ============ INPUT COMPONENTS ============
const Input = ({ label, placeholder, error, icon, required }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && (
      <label style={{
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: tokens.fonts.hebrew,
        color: tokens.colors.textPrimary,
      }}>
        {label}{required && <span style={{ color: tokens.colors.terracotta }}> *</span>}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '48px',
          padding: '0 16px',
          paddingLeft: icon ? '44px' : '16px',
          fontSize: '16px',
          fontFamily: tokens.fonts.hebrew,
          color: tokens.colors.textPrimary,
          backgroundColor: tokens.colors.cream,
          border: `1px solid ${error ? tokens.colors.terracotta : tokens.colors.borderLight}`,
          borderRadius: '12px',
          outline: 'none',
          direction: 'rtl',
          boxSizing: 'border-box',
        }}
      />
      {icon && (
        <span style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: tokens.colors.textMuted,
        }}>{icon}</span>
      )}
    </div>
    {error && (
      <p style={{ marginTop: '4px', fontSize: '12px', color: tokens.colors.terracotta, fontFamily: tokens.fonts.hebrew }}>
        {error}
      </p>
    )}
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <label style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontFamily: tokens.fonts.hebrew,
  }}>
    <div style={{
      width: '22px',
      height: '22px',
      borderRadius: '6px',
      border: `2px solid ${checked ? tokens.colors.chestnut : tokens.colors.borderLight}`,
      backgroundColor: checked ? tokens.colors.chestnut : tokens.colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s ease',
    }}>
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <span style={{ fontSize: '16px', color: tokens.colors.textPrimary }}>{label}</span>
  </label>
);

// ============ CARD COMPONENTS ============
const Card = ({ children, shadow, onClick, padding = 16 }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: `${padding}px`,
      border: shadow ? 'none' : `1px solid ${tokens.colors.borderLight}`,
      boxShadow: shadow ? '0 2px 8px rgba(149, 69, 53, 0.08)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
    }}
  >
    {children}
  </div>
);

const ProductCard = ({ image, title, price, status }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(149, 69, 53, 0.08)',
  }}>
    <div style={{
      position: 'relative',
      aspectRatio: '1',
      backgroundColor: tokens.colors.cream,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <span style={{ fontSize: '48px' }}>{image}</span>
      <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
        <Badge status={status} size="sm" />
      </div>
      <button style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: tokens.colors.white,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.textMuted} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
    <div style={{ padding: '12px' }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: tokens.fonts.hebrew,
        color: tokens.colors.textPrimary,
        marginBottom: '4px',
        textAlign: 'right',
      }}>{title}</h3>
      <p style={{
        fontSize: '18px',
        fontWeight: 700,
        fontFamily: tokens.fonts.hebrew,
        color: tokens.colors.chestnut,
        textAlign: 'right',
        margin: 0,
      }}>₪{price.toLocaleString()}</p>
    </div>
  </div>
);

const StatCard = ({ icon, value, label, variant }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: variant === 'primary' ? tokens.colors.sage : tokens.colors.white,
    borderRadius: '16px',
    textAlign: 'center',
    minHeight: '100px',
  }}>
    <span style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</span>
    <span style={{
      fontSize: '24px',
      fontWeight: 700,
      fontFamily: tokens.fonts.hebrew,
      color: variant === 'primary' ? tokens.colors.white : tokens.colors.textPrimary,
    }}>{value}</span>
    <span style={{
      fontSize: '14px',
      fontFamily: tokens.fonts.hebrew,
      color: variant === 'primary' ? tokens.colors.white : tokens.colors.textSecondary,
    }}>{label}</span>
  </div>
);

// ============ PROGRESS COMPONENTS ============
const ProgressBar = ({ value, color = 'chestnut', showValue, label }) => {
  const colorMap = {
    chestnut: tokens.colors.chestnut,
    sage: tokens.colors.sage,
    beige: tokens.colors.beige,
  };
  
  return (
    <div style={{ width: '100%' }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: tokens.fonts.hebrew }}>
          {label && <span style={{ fontSize: '14px', color: tokens.colors.textPrimary }}>{label}</span>}
          {showValue && <span style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.textPrimary }}>{value}%</span>}
        </div>
      )}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: tokens.colors.beigeLight,
        borderRadius: '9999px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: colorMap[color],
          borderRadius: '9999px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};

const ProgressRing = ({ value, max = 100, size = 120, label }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tokens.colors.beigeLight}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tokens.colors.chestnut}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontFamily: tokens.fonts.hebrew,
      }}>
        <div style={{ fontSize: '32px', fontWeight: 700, color: tokens.colors.textPrimary }}>{value}</div>
        {label && <div style={{ fontSize: '12px', color: tokens.colors.textSecondary }}>{label}</div>}
      </div>
    </div>
  );
};

// ============ NAVIGATION COMPONENTS ============
const BottomNavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: active ? tokens.colors.chestnut : tokens.colors.textMuted,
      fontFamily: tokens.fonts.hebrew,
    }}
  >
    <span style={{ marginBottom: '4px' }}>{icon}</span>
    <span style={{ fontSize: '12px', fontWeight: 500 }}>{label}</span>
  </button>
);

const Tabs = ({ tabs, activeTab, onChange }) => (
  <div style={{
    display: 'flex',
    backgroundColor: tokens.colors.cream,
    borderRadius: '12px',
    padding: '4px',
  }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          flex: 1,
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: tokens.fonts.hebrew,
          backgroundColor: activeTab === tab.id ? tokens.colors.white : 'transparent',
          color: activeTab === tab.id ? tokens.colors.textPrimary : tokens.colors.textSecondary,
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const StepNav = ({ steps, currentStep, completedSteps }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
    {steps.map((step, index) => {
      const isActive = step.id === currentStep;
      const isCompleted = completedSteps.includes(step.id);
      return (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <div style={{
              width: '40px',
              height: '2px',
              backgroundColor: isCompleted || isActive ? tokens.colors.chestnut : tokens.colors.beigeLight,
            }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isCompleted ? tokens.colors.sage : isActive ? tokens.colors.chestnut : tokens.colors.beigeLight,
              color: isCompleted || isActive ? tokens.colors.white : tokens.colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: tokens.fonts.hebrew,
            }}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <span style={{
              fontSize: '12px',
              fontFamily: tokens.fonts.hebrew,
              color: isActive ? tokens.colors.chestnut : tokens.colors.textSecondary,
              fontWeight: isActive ? 500 : 400,
            }}>{step.label}</span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

// ============ AVATAR COMPONENTS ============
const Avatar = ({ src, initials, size = 'md', color = 'beige' }) => {
  const sizeMap = { sm: 32, md: 48, lg: 64, xl: 80 };
  const colorMap = {
    beige: tokens.colors.beige,
    chestnut: tokens.colors.chestnut,
    sage: tokens.colors.sage,
  };
  
  return (
    <div style={{
      width: sizeMap[size],
      height: sizeMap[size],
      borderRadius: '50%',
      backgroundColor: colorMap[color],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      color: color === 'beige' ? tokens.colors.textPrimary : tokens.colors.white,
      fontSize: sizeMap[size] * 0.4,
      fontWeight: 600,
      fontFamily: tokens.fonts.hebrew,
    }}>
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials || '👤'}
    </div>
  );
};

// ============ ICONS ============
const Icons = {
  Home: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  List: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Clock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  User: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Settings: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bell: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

// ============ MAIN PREVIEW COMPONENT ============
export default function BabyRegistryPreview() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [checked, setChecked] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.colors.cream,
      fontFamily: tokens.fonts.hebrew,
      direction: 'rtl',
      padding: '20px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: tokens.colors.chestnut, marginBottom: '8px' }}>
          🍼 Baby Registry Components
        </h1>
        <p style={{ color: tokens.colors.textSecondary }}>תצוגה מקדימה של רכיבי האפליקציה</p>
      </div>

      {/* Color Palette */}
      <Section title="🎨 Color Palette">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { name: 'Chestnut', color: tokens.colors.chestnut, hex: '#954535' },
            { name: 'Beige', color: tokens.colors.beige, hex: '#D2B48C' },
            { name: 'Cream', color: tokens.colors.cream, hex: '#FAF9F6', border: true },
            { name: 'Sage', color: tokens.colors.sage, hex: '#4A7C59' },
            { name: 'Terracotta', color: tokens.colors.terracotta, hex: '#C4785B' },
          ].map(c => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: c.color,
                marginBottom: '8px',
                border: c.border ? `1px solid ${tokens.colors.borderLight}` : 'none',
              }} />
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: '10px', color: tokens.colors.textMuted }}>{c.hex}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section title="🔘 Buttons">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant="primary">הוסף לעגלה</Button>
          <Button variant="secondary">שתף רשימה</Button>
          <Button variant="beige">פרטים נוספים</Button>
          <Button variant="sage">נקנה ✓</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Button variant="primary" size="sm">כפתור קטן</Button>
          <Button variant="primary" size="lg">כפתור גדול</Button>
          <Button variant="primary" disabled>לא פעיל</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <IconButton icon={<Icons.Plus />} variant="primary" />
          <IconButton icon={<Icons.Settings />} variant="filled" />
          <IconButton icon={<Icons.Bell />} />
        </div>
      </Section>

      {/* Badges */}
      <Section title="🏷️ Badges">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <Badge status="available" />
          <Badge status="purchased" />
          <Badge status="required" />
          <Badge status="optional" />
          <Badge status="waiting" />
          <Badge status="new" />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <UserBadge name="דודה רחל" emoji="💕" />
          <UserBadge name="אנונימי" emoji="🎁" isAnonymous />
        </div>
      </Section>

      {/* Form Elements */}
      <Section title="📝 Form Elements">
        <div style={{ maxWidth: '300px' }}>
          <Input label="שם מלא" placeholder="הזן את שמך" required />
          <Input label="חיפוש" placeholder="חפש פריט..." icon={<Icons.Search />} />
          <Input label="אימייל" placeholder="email@example.com" error="כתובת אימייל לא תקינה" />
          <div style={{ marginTop: '16px' }}>
            <Checkbox label="מתנה אנונימית" checked={checked} onChange={() => setChecked(!checked)} />
          </div>
        </div>
      </Section>

      {/* Progress */}
      <Section title="📊 Progress">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ProgressRing value={72} label="ימים ללידה" />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <ProgressBar value={38} label="השלמת רשימה" showValue />
            <div style={{ height: '16px' }} />
            <ProgressBar value={80} color="sage" label="Nursery 🛏️" showValue />
            <div style={{ height: '16px' }} />
            <ProgressBar value={60} color="beige" label="Feeding 🍼" showValue />
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section title="🃏 Cards">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <ProductCard image="🛏️" title="מיטת תינוק" price={1500} status="available" />
          <ProductCard image="🚗" title="עגלת תינוק" price={2400} status="purchased" />
          <ProductCard image="👶" title="בגד גוף" price={60} status="available" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatCard icon="📦" value="32" label="פריטים" />
          <StatCard icon="🎉" value="12" label="נקנו" variant="primary" />
          <StatCard icon="✨" value="₪8,450" label="נשאר" />
        </div>
      </Section>

      {/* Navigation */}
      <Section title="🧭 Navigation">
        <div style={{ marginBottom: '24px' }}>
          <Tabs
            tabs={[
              { id: 'all', label: 'הכל' },
              { id: 'purchased', label: 'נקנו' },
              { id: 'available', label: 'זמינים' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <StepNav
            steps={[
              { id: 'shipping', label: 'משלוח' },
              { id: 'payment', label: 'תשלום' },
              { id: 'confirm', label: 'אישור' },
            ]}
            currentStep="payment"
            completedSteps={['shipping']}
          />
        </div>
        <Card shadow>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: '60px',
          }}>
            <BottomNavItem icon={<Icons.Home />} label="בית" active={activeNav === 'home'} onClick={() => setActiveNav('home')} />
            <BottomNavItem icon={<Icons.Clock />} label="פעילות" active={activeNav === 'activity'} onClick={() => setActiveNav('activity')} />
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: tokens.colors.chestnut,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokens.colors.white,
              marginTop: '-20px',
              boxShadow: '0 4px 12px rgba(149, 69, 53, 0.3)',
            }}>
              <Icons.Plus />
            </div>
            <BottomNavItem icon={<Icons.List />} label="פריטים" active={activeNav === 'items'} onClick={() => setActiveNav('items')} />
            <BottomNavItem icon={<Icons.User />} label="פרופיל" active={activeNav === 'profile'} onClick={() => setActiveNav('profile')} />
          </div>
        </Card>
      </Section>

      {/* Avatars */}
      <Section title="👤 Avatars">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Avatar size="sm" initials="שר" />
          <Avatar size="md" initials="שר" color="chestnut" />
          <Avatar size="lg" initials="שר" color="sage" />
          <Avatar size="xl" initials="שר" />
        </div>
      </Section>

      {/* Gift Notification Card */}
      <Section title="🎁 Gift Notification">
        <Card shadow padding={24}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎁</div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.textPrimary, marginBottom: '8px' }}>
              🎉 קיבלת מתנה!
            </h2>
            <p style={{ color: tokens.colors.textSecondary, marginBottom: '24px' }}>
              מישהו שאוהב אותך קנה לך משהו מהרשימה
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'rgba(149, 69, 53, 0.05)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: tokens.colors.cream,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}>🚗</div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>עגלת Bugaboo</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.chestnut }}>₪3,200</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <UserBadge name="דודה רחל" emoji="💕" />
            </div>
            <div style={{
              padding: '16px',
              backgroundColor: tokens.colors.white,
              borderRadius: '12px',
              border: `2px dashed ${tokens.colors.beige}`,
              fontStyle: 'italic',
              color: tokens.colors.textPrimary,
            }}>
              "מזל טוב לכם! מחכים לפגוש את התינוק 💛"
              <div style={{ marginTop: '8px', fontSize: '14px', color: tokens.colors.textSecondary, fontStyle: 'normal' }}>
                - דודה רחל
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* Full Width Button */}
      <Section title="📱 Full Width Button">
        <Button variant="primary" fullWidth>צפי בפרטים</Button>
        <div style={{ height: '12px' }} />
        <Button variant="secondary" fullWidth>המשיכי לרשימה</Button>
      </Section>
    </div>
  );
}

// Section Component
const Section = ({ title, children }) => (
  <div style={{
    marginBottom: '32px',
    backgroundColor: tokens.colors.white,
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(149, 69, 53, 0.05)',
  }}>
    <h2 style={{
      fontSize: '18px',
      fontWeight: 700,
      color: tokens.colors.textPrimary,
      marginBottom: '16px',
      fontFamily: tokens.fonts.hebrew,
    }}>{title}</h2>
    {children}
  </div>
);
