import { IClassNames, IStyleFunction, mergeStyleSets } from "office-ui-fabric-react";
import * as React from "react";
import { ITheme } from './theming/ITheme';
import { ThemeLayer } from './theming/ThemeProvider';

export type IStyleFunction<TProps, TStyles> = (
  props: TProps
) => Partial<TStyles>;

export interface IPropsWithStyles<TProps, TStyles> {
  styles?: IStyleFunction<TProps, TStyles> | Partial<TStyles>;
}

// Components should accept styling.
export type IComponentProps<TProps, TStyles> = TProps & {
  styles?: IStyleFunction<IPropsWithStyles<TProps, TStyles>, TStyles> | Partial<TStyles>;
  changeTheme?: string;
}

export type IStyleProps<TProps, TStyles> = TProps & {
  theme: ITheme;
};

// Views should accept processed classNames.
export type IViewProps<TProps, TStyles> = TProps & {
  classNames: IClassNames<TStyles>;
}

const augmentations = {};

export interface IComponentOptions<TProps, TStyles> {
  displayName: string;
  state?: React.ComponentType<IComponentProps<TProps, TStyles>>;
  styles?: IStyleFunction<IStyleProps<TProps, TStyles>, TStyles> | Partial<TStyles>;
  view?: React.ComponentType<IViewProps<TProps, TStyles>>;
}

function evaluateStyle<TProps, TStyles>(
  props: TProps,
  styles?: IStyleFunction<TProps, TStyles> | Partial<TStyles> | undefined
): Partial<TStyles> | undefined {
  if (typeof styles === 'function') {
    return styles(props);
  }

  return styles;
}

// Helper function to tie them together.
export function createComponent<TProps, TStyles>(
  options: IComponentOptions<TProps, TStyles>
): React.StatelessComponent<IComponentProps<TProps, TStyles>> {

  const result: React.StatelessComponent<TProps> = (userProps: TProps) => {
    const augmented = augmentations[options.displayName] || {};
    const ComponentState = augmented.state || options.state;
    const ComponentView = augmented.view || options.view;
    const componentStyles = augmented.styles || options.styles;

    ComponentView.displayName = ComponentView.displayName || options.displayName;

    const content = (processedProps: IComponentProps<TProps, TStyles>) => {
      const { styles } = processedProps;

      return (
        <ThemeLayer changeTheme={processedProps.changeTheme}>{(theme: ITheme) => {
          const styleProps = { theme, ...(processedProps as {}) };

          return ComponentView({
            ...processedProps as {},
            classNames: mergeStyleSets(
              evaluateStyle(styleProps, componentStyles),
              evaluateStyle(styleProps, styles as any)
            )
          });
        }}</ThemeLayer>
      );
    };

    return !!ComponentState ? (
      <ComponentState>{content}</ComponentState>
    ) : (
        content(userProps)
      );
  };

  result.displayName = options.displayName;

  return result;
}

// Helper function to augment existing components that have been created.
export function augmentComponent<TProps, TStyles>(
  options: IComponentOptions<TProps, TStyles>
) {
  augmentations[options.displayName] = {
    ...augmentations[options.displayName],
    ...options
  };
}