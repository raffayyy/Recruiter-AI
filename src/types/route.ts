export interface RouteComponent {
  default: () => JSX.Element;
}

export type LazyComponent = React.LazyExoticComponent<() => JSX.Element>;