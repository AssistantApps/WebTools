import React, { ReactNode } from 'react';
import { anyObject } from '../helper/typescriptHacks';

import { AssistantAppsApiService } from '../services/api/AssistantAppsApiService';
import { ToastService } from '../services/common/ToastService';

export interface IDependencyInjection {

  //api
  assistantAppsApiService: AssistantAppsApiService;

  // common
  toastService: ToastService,
}

export const defaultDependencyInjectionFunc = () => {
  return {
    //api
    assistantAppsApiService: new AssistantAppsApiService(),

    // common
    toastService: new ToastService(),
  };
};

export const DependencyInjectionContext = React.createContext<IDependencyInjection>(
  anyObject
);
interface IDependencyInjectionProviderProps {
  children: ReactNode;
}
export const DependencyInjectionProvider: React.FC<IDependencyInjectionProviderProps> = (
  props: IDependencyInjectionProviderProps
) => {
  const { children } = props;
  return (
    <DependencyInjectionContext.Provider
      value={defaultDependencyInjectionFunc()}
    >
      {children}
    </DependencyInjectionContext.Provider>
  );
};

export function withDependencyInjectionProvider<TProps>(
  WrappedComponent: any
): React.FC<TProps> {
  return (props: TProps) => (
    <DependencyInjectionContext.Provider
      value={defaultDependencyInjectionFunc()}
    >
      <WrappedComponent {...props} />
    </DependencyInjectionContext.Provider>
  );
}
export function withDependencyInjectionConsumer<
  WithoutExpectedDependencyInjectionType,
  ExpectedDependencyInjectionType
>(
  WrappedComponent: any,
  mapper: (
    DependencyInjection: IDependencyInjection
  ) => ExpectedDependencyInjectionType
) {
  const wrapper: React.FC<WithoutExpectedDependencyInjectionType> = (
    props: WithoutExpectedDependencyInjectionType
  ) => {
    return (
      <DependencyInjectionContext.Consumer>
        {(DependencyInjection: IDependencyInjection) => (
          <WrappedComponent {...mapper(DependencyInjection)} {...props} />
        )}
      </DependencyInjectionContext.Consumer>
    );
  };
  return wrapper;
}

export function withServices<WithoutExpectedServicesType, ExpectedServicesType>(WrappedComponent: any, mapper: (services: IDependencyInjection) => ExpectedServicesType) {
  const wrapper: React.FC<WithoutExpectedServicesType> = (props: WithoutExpectedServicesType) => {
    return (
      <DependencyInjectionContext.Consumer>
        {
          (services: IDependencyInjection) =>
            <WrappedComponent {...(mapper(services))} {...props} />
        }
      </DependencyInjectionContext.Consumer>
    );
  }
  return wrapper;
}