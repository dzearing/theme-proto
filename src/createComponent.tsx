import {
  IClassNames,
  IStyleFunction,
  mergeStyleSets
} from "office-ui-fabric-react";
import * as React from "react";
import { ITheme } from "./theming/ITheme";
import { ThemeContext } from "./theming/ThemeProvider";

export type IStyleFunction<TProps, TStyles> = (
  props: TProps
) => Partial<TStyles>;

export interface IPropsWithStyles<TProps, TStyles> {
  styles?: IStyleFunction<TProps, TStyles> | Partial<TStyles>;
}

// Components should accept styling.
export type IComponentProps<TProps, TStyles> = TProps & {
  styles?:
    | IStyleFunction<IPropsWithStyles<TProps, TStyles>, TStyles>
    | Partial<TStyles>;
};

export type IStyleProps<TProps, TStyles> = TProps & {
  theme: ITheme;
};

// Views should accept processed classNames.
export type IViewProps<TProps, TStyles> = TProps & {
  classNames: IClassNames<TStyles>;
};

const augmentations = {};

export interface IComponentOptions<TProps, TStyles, TStatics> {
  displayName: string;
  state?: React.ComponentType<IComponentProps<TProps, TStyles>>;
  styles?:
    | IStyleFunction<IStyleProps<TProps, TStyles>, TStyles>
    | Partial<TStyles>;
  view?: React.ReactType<IViewProps<TProps, TStyles>>;
  statics?: TStatics;
}

function evaluateStyle<TProps, TStyles>(
  props: TProps,
  styles?: IStyleFunction<TProps, TStyles> | Partial<TStyles> | undefined
): Partial<TStyles> | undefined {
  if (typeof styles === "function") {
    return styles(props);
  }

  return styles;
}

// Helper function to tie them together.
export function createComponent<TProps, TStyles = {}, TStatics = {}>(
  options: IComponentOptions<TProps, TStyles, TStatics>
): React.ComponentClass<IComponentProps<TProps, TStyles>> & TStatics {
  const augmented = augmentations[options.displayName] || {};
  const ComponentState = augmented.state || options.state;
  const ComponentView = augmented.view || options.view;
  const componentStyles = augmented.styles || options.styles;

  class Result extends React.PureComponent<IComponentProps<TProps, TStyles>> {
    public static displayName =
      ComponentView.displayName || options.displayName;

    public render(): JSX.Element {
      const { styles } = this.props;

      return (
        <ThemeContext.Consumer>
          {(theme: ITheme) => {
            const styleProps = { theme, ...(this.props as {}) };

            return ComponentView({
              ...(this.props as {}),
              classNames: mergeStyleSets(
                evaluateStyle(styleProps, componentStyles),
                evaluateStyle(styleProps, styles as any)
              )
            });
          }}
        </ThemeContext.Consumer>
      );
    }
  }

  // Assign statics.
  Object.assign(Result, options.statics);

  return Result as any;
}

// Helper function to augment existing components that have been created.
export function augmentComponent<TProps, TStyles, TStatics>(
  options: IComponentOptions<TProps, TStyles, TStatics>
) {
  augmentations[options.displayName] = {
    ...augmentations[options.displayName],
    ...options
  };
}
