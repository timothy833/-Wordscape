import React from 'react';
import * as Sentry from "@sentry/react";
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
//error - React 在元件發生錯誤時會自動傳進來的錯誤物件 (React 錯誤邊界的生命周期)
// eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <h2>Oops! 發生錯誤</h2>
          <p>請重新整理頁面或稍後再試。</p>
          <button onClick={() => window.location.reload()}>重新整理</button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
