import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Logged for local debugging only — no analytics/reporting wired up.
    console.error('Portfolio site crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleResetData = () => {
    try {
      localStorage.removeItem('portfolioData');
      localStorage.removeItem('portfolioDataVersion');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.wrap}>
          <div style={styles.box}>
            <h1 style={styles.title}>Something went wrong.</h1>
            <p style={styles.text}>
              The page hit an unexpected error. Reloading usually fixes it —
              if it keeps happening, resetting the locally saved site data
              should clear it up.
            </p>
            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={this.handleReload}>
                Reload page
              </button>
              <button style={styles.btnSecondary} onClick={this.handleResetData}>
                Reset saved data &amp; reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#08080e',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
    padding: '2rem',
  },
  box: { maxWidth: 460, textAlign: 'center' },
  title: { fontSize: '1.6rem', marginBottom: '0.75rem' },
  text: { color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '1.75rem', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    background: '#C9A84C', color: '#000', border: 'none', padding: '0.7rem 1.3rem',
    fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
  },
  btnSecondary: {
    background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.7rem 1.3rem', cursor: 'pointer', fontSize: '0.85rem',
  },
};
