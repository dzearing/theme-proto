# Core Theming

Core infrastructure for the theming system.  This infrastructure provides the scaffolding for theming that is heirarchical and inherited.  This also has the capability of extending via a system of modules that allows for code execution and property transformations at various points in the system.

Note that this is not necessarily designed to be used directly.  It is recommended that this be wrapped in a strongly typed layer with additional modules of interest added.

The high level concepts are as follows:

## Theme

This is the overall container for a set of information that can be used to set whatever you want.  It could easily be thought of as scheme or behaviors or really any kind of properties that are desired.  There are two types here, a definition type and a resolved type.

#### Theme Definitions

Definitions are the input values that will get turned into full on themes.  A definition can be a partial set of information, whereas a full theme will be fully resolved and ready to use.  When registering new themes with the system they are specified by definition, but used as a full theme.

### Theming APIs
The core theming APIs include the following:
* __registerThemeCore__ - register a theme definition with a specific name.  If the parent property is specied on the definition it will be based on the theme with that parent name.
* __getThemeCore__ - get a theme by name.  When this is called the theme will be turned from a definition to a full theme.  If the name is not found it will get the default theme.
* __getDefaultThemeCore__ - get the default theme.  This will cause the default theme to be resolved if it has not been already.
* __themeFromChangeStringCore__ - create a one-off theme using a string to modify the base theme.  This can do things like change the default background shade (and have the various calculated colors adjusted appropriately)

## Styles

A style is a set of properties that define behaviors for a given type of entity.  The theme itself is a style at the root level and is considered the default style.  This style is resolved when the them is created.  There can also be any number of named styles within the theme definition.

### Props

Every style has a props object which contains the set of property values that will be consumed by the callers.  The core framework is not opinionated as to the type of this object.  For web users this might be fabric's `IRawStyle` which has the complete set of css properties.

#### Style Definitions

Similar to the split between theme and theme definitions, styles start out being defined as definitions.  These definitions contain the values to set for a given style.

#### Style Inheritance
Style definitions can have a reference to a parent style name.  Definitions will be aggregated all the way up the default style and the style will be created using a merge of the cascaded definitions.

#### Created on Demand
Note also that within a theme, non-default styles start out as a factory function.  This function will be used to create the resolved style when requested by a control.  As a result if there is a style named 'button', this will not be created until a consumer needs that style.

### Style APIs

The primary styling API is as follows:
* __themeStyleCore__ - given a theme, an optional style name, and an optional set of parameters return a `props` object as specified above for that style name.  If a name is not specified this will return default style props, the optional parameters are used by the module system as described below.

### Simple Style Example
Given the following theme definition:

    const themeDef = {
      props: { foo: 1 },
      styles: {
        user1: { props: { bar: 2 } },
        user2: { parent: 'user1', props: { foo: 3 } },
        user3: { parent: 'user2', props: { baz: 4 } },
      }
    }

When fully resolved the theme will be as follows:

    theme = {
      props: { foo: 1 },
      styles: {
        user1: { props: { foo: 1, bar: 2 } },
        user2: { props: { foo: 3, bar: 2 } },
        user3: { props: { foo: 3, bar: 2, baz: 4 } },
      }
    }

## States

States are effectively partial styles that override a given style.  They are also inherited and aggregated through the style inheritance system.  The properties and modules that apply to styles, also apply to states.  State definitions are assumed to be partial.  See the following example.

    const themeDef = {
      props: { foo: 1 },

      // default style has a state called :hover with bar: 2
      states: { ':hover': { props: { bar: 2 } } }
      }
      styles: {
        // hover will pick up bar: 2 from default and add foo: 2
        userDef1: { states: { ':hover': { props: { foo: 2 } } } },

        // hover will pick up bar: 3 from here and foo: 2 from userDef1
        userDef2: { parent: 'userDef1',
                    states: { ':hover': { props: { bar: 3 } } } },
          }
        }
      }
    }

The states functionality is written as a module and will add the states with their named values under a selectors object in props.  So given the following style snippet:

    styles: {
      userStyle: { 
        props: { backgroundColor: 'blue' },
        states: {
          ':hover': { 
            props: { 
              backgroundColor: 'red' 
            } 
          }
        }
      }
    }

The props object returned via the `themeStyleCore` call above will have the following structure:

    {
      backgroundColor: 'blue',
      selectors: {
        ':hover': {
          backgroundColor: 'red'
        }
      }
    }
