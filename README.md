# Some thoughts from Jason's version

#### theming
* Probably want some documentation of the overall ITheme structure though we should agree on names first

#### theming/core
* Added two documentation files here.
* Likely a few places left for consolidation and making the code more compact but it is getting fairly tight.
* Can look at adding generics support to the module code
* Only one remaining reference out of the directory for grabbing the default theme.  Need to look at how to get rid of that.

#### theming/modules
* Lots of interesting things we can do with colorSets
* More calculated functions such as colorizedText with contrast fallbacks and things like that

#### theming/themes
* Can probably do a pass through these to make them better
* States should have autofg specified so the fg gets reculculated on change

#### coloring
* Switched swatch generation to be tonal and use HSL which is probably better.
* Need to curve the result set and offset the curve based on relative luminance.
* Did find one bug in HSL code had a divide by zero error causing a NaN value.  Should look at fixing in fabric.
* Should probably pare this down or use the fabric version except new shade generation.
* Lots of nice helpers that we could add for half-tone, disabled, saturate, desat

# Issues to resolve

* Persona should use Text component.
* PersonaCoin has right padding baked in.
* Slider should apply its own fonts. (Use Text component.)
* Slider labels should be opt in, not opt out.
* Slider has no ticks. Not even opt in.
* Breadcrumb has baked in margins.
* Breadcrumb uses media queries which makes it a mess to use.
* FocusZone should make it easy to get in and out of a card.

# Components to add

* Text
* Stack

