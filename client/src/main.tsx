import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/errors/ErrorFallback';
import {
  QueryErrorResetBoundary,
} from '@tanstack/react-query';


import App from './App';
import './index.css';

import { queryClient } from './lib/queryClient';

import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
           <QueryErrorResetBoundary>

              {({ reset }) => (

                <ErrorBoundary
                  onReset={reset}
                  FallbackComponent={
                    ErrorFallback
                  }
                >

                  <App />

                </ErrorBoundary>
              )}

            </QueryErrorResetBoundary>

          <Toaster
          position="top-right"
           reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);






// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';

// import App from './App';
// import './index.css';

// ReactDOM.createRoot(
//   document.getElementById('root')!
// ).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );


