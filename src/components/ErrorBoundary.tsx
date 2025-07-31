import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);

    // 在生产环境也显示详细错误信息（临时调试用）
    this.setState({
      error,
      errorInfo,
    });
  }

  public render() {
    if (this.state.hasError) {
      // 自定义降级 UI
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-red-600 mb-4">出现了错误</h2>

              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">错误信息:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{this.state.error?.toString()}</pre>
              </div>

              {this.state.errorInfo && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">组件堆栈:</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                重新加载页面
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
