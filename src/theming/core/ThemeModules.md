# Theme Modules

The core theming functionality is extensible via a module system.  Once registered, a module gains controls of an object which acts as a peer of the props object.

A module has can have a separate type for theme definitions and resolved themes or use the same type.  A module gets registered via a call to `registerThemeModule` passing in a partial instance of `IThemeModuleProps`

    export interface IThemeModuleProps {
      name: string;
      default: IModuleDefinition;
      dependsOn?: string[];
      resolveDef: ThemeDefinitionResolver;
      updateProps?: PropsUpdater;
      stringConfig?: ThemeStringHandler;
    }

| Property | Description |
| --- | --- |
| __name__ | Name of the module.  This will be the key value used in the various styles and states. |
| __default__ | Default value for the module.  Used if the theme definition does not specify any particular values. |
| __dependsOn__ | Optional array of modules that this module depends on.  These modules will be evaluated before this module ensuring that style resolution can depend on those values. |
| __resolveDef__ | A function for transforming the definition version of the module into the resolved version.  If not specified this will use the same logic that the uses for cascading. |
| __updateProps__ | Function for setting values from the module into the props object.  This will happen at theme resolution time and optionally if parameters are passed.  See below. |
| __stringConfig__ | Optionally allows a module to try to parse a portion of a configuration string and build a theme definition used to configure a theme.  See below. |

## Module Resolution

This is the process by which a module turns itself from a definition into a resolved module.  This happens on theme creation for the default style, on style resolution for non-default styles, and as a partial mapping for states at these same times.

### Resolve Function
Resolution happens by providing a handler with the following signature:

    export type ThemeDefinitionResolver = (
      name: string,
      obj: IBaseStyle,
      defaultDef: IModuleDefinition | undefined,
      allowPartial: boolean,
      definition?: IModuleDefinition,
      parent?: IBaseStyle,
    ) => any;

| Parameter | Description |
| --- | --- |
| __name__ | Passed in name of the module. |
| __obj__ | The style or state which is currently being built.  If a style it can be assumed that modules specified in dependsOn have had their chance at it first.
| __defaultDef__ | Passed in default definition to fall back on when building styles.  This will be what was specified in the registration function.
| __allowPartial__ | If false then the function is resolving a full style where non-optional values should be defined.  If true, a state is being resolved where all properties are assumed to be optional.
| __definition__ | The locally scoped definition for this module, if available.
| __parent__ | For the default style this will be undefined.  For non-default styles this will be the default style.  For states this will be the style the states are modifying.

## Updating Props

The props object for each of the styles will be returned by `themeStyleCore` calls without having code run in most cases.  A module is provided the opportunity to modify the props at style resolution time by providing an `updateProps` function.

### API Signature

    export type PropsUpdater = (
      props: IStyleProps,
      module: IModuleResolved,
      params?: object
    ) => IStyleProps;

| Parameter | Description |
| --- | --- |
| __props__ | Base properties object.  At this point standard props cascading has happened and modules earlier in the list have been executed and added their properties.
| __module__ | Resolved instance of this module for the style or state.  Note that if it is a state it is likely a partial representation.
| __params__ | Optional set of parameters defined by the module itself to vary behavior.

The function should return a modified props object.

### Parameterization

While normally the returned props are only adjusted once, then saved for quick lookups later on.  If parameters are provided to the `themeStyleCore` call, modules for which a parameter object is specified will have a chance to run again dynamically to modify the return results.

An example would be for a module called typography.  There might be an optional parameter called textClass.  Behavior might be as follows:
* `themeStyleCore` standard - just return props which has already been filled in with default text properties.
* `themeStyleCore` with `typography: { textClass: 'h2' }` - the default text styles are replaced with a larger font size to make the text appear as for the h2 type of behavior.

It's up to a given module to define what will happen when parameterized.  The function will only execute after style resolution if a parameter with that module name is specified.

## String Configuration

The final place modules can inject themselves is with string configuration.  This allows them to participate in calls to `themeFromChangeStringCore`.  To do this the `stringConfig` property should be filled in with the following API type

    export type ThemeStringHandler = (
      theme: IBaseTheme,
      definition: IBaseThemeDef,
      term: string,
      param?: string
    ) => number;

| Parameter | Description |
| --- | --- |
| __theme__ | Theme that will be used as a baseline for modification
| __definition__ | Partial theme definition to be __modified__ if this string is handled
| __term__ | Current term being processed in a string split on spaces
| __param__ | Next term in the argument array if the __term__ wasn't the last one

This will return the number of handled terms: 1 if param was unused, 2 if it was used, 0 if the module didn't handle the call.
