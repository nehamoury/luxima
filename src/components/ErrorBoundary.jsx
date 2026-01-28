import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full border border-rose-100">
                        <h1 className="text-2xl font-serif font-bold text-rose-600 mb-4">Something went wrong.</h1>
                        <p className="text-slate-600 mb-6">The application encountered an unexpected error. Please share the details below with support.</p>

                        <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-64 mb-6">
                            <code className="text-red-400 font-mono text-xs block mb-2">
                                {this.state.error && this.state.error.toString()}
                            </code>
                            <pre className="text-slate-400 font-mono text-[10px] whitespace-pre-wrap">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
