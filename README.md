# Some thoughts from Jason's version

Color generation library seems wrong.
* Use of bg/fg as seeds doesn't allow tonal components in colors in the gray space.  Designers like funky shades of gray.
* Should switch from HSV -> HSL internally, view the bg color as a seed color for tone
* Map the neutral color from white to black using HSL
* Map the theme color from white + 1 to black -1 using HSL
* Default fg color to the inverted tone mapping used for bg-neutral
* Allow for specification of fg seed value which would allow for tonal control

For the overall project:
* Consolidate code, it's too messy
* Reorganize files by functional purpose
* Finish the color generation functions
* Figuring out ways of using the structure as a transport for constants.  Likes the values in theme.offsets become more than just indexes.
* Alternate state requests in getThemeColors.  Either single or separate batches.  Likely separate to start.
* Clean up theme settings vs. ITheme as well as generation logic there
* Add overlay and high contrast themes and demonstrations

Long term:
* Allow for theme creation in the configurator
* Override swatch colors
* Change offsets 

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

