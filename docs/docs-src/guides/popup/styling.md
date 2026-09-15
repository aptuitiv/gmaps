---
---

# Styling a popup

You have full style control over how the popup looks. The popup container is a div. You can assign your own class name to it with the `className` property or the [setClassName](/api-reference/overlay#setclassname) method.

The popup container div will have the following default styles:

- `backgroundColor: #fff`
- `color: #333`
- `padding: 3px 6px`
- `borderRadius: 4px`
- `boxShadow: 0 0 5px rgba(0,0,0,0.3)`
- `transform: translate(-50%, -100%)`

If the [`center`](/api-reference/popup#popup-options) option is set to `false` then `transform: translate(0, -100%)` so that the popup is above the element. If you don't want that then you can override the `transform` style.

The other default styles can be removed by setting the [`theme`](/api-reference/popup#popup-options) option to `none`.

You can also override individual default styles with the [styles](/api-reference/overlay#properties) property or the [style()](/api-reference/overlay/#style) method.

There are four ways to style the popup:

1. Do nothing and the above default styles are set.
2. Create a `div` tag that you set as the content for the popup. That `div` tag can either have a CSS class that you attach styles to, or you can assign styles to the `div` DOM element when you are creating it. You will probably want to also set the [`theme`](/api-reference/popup#popup-options) to `none` to remove the default styles. Note that the popup content is set inside the popup container `div` that by default has the above styles applied to it.
3. Pass an object of styles to the [`styles`](/api-reference/popup#popup-options) to style the container `div` tag that wraps the popup content. These styles will overwrite the default styles above if you pass the same style name. For example, if you include `color` in your `styles` object then that will overwrite the default color above. You can also set the [`theme`](/api-reference/popup#popup-options) to `none` to completely remove the default styles.
4. Add a class name to the container `div` that wraps the popup content with the [`className`](/api-reference/popup#popup-options) option and then attach styles to that CSS class name.
