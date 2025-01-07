import React, { Suspense } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface LazyRouteProps {
  component: React.LazyExoticComponent<() => JSX.Element>;
}

export function LazyRoute({ component: Component }: LazyRouteProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}