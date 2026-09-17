---
---

# Styling a tooltip

You have full style control over how the tooltip looks. The tooltip container is a div. You can assign your own class name to it with the `className` property or the [setClassName](/api-reference/overlay#setclassname) method.

The tooltip container div will have the following default styles:

- `backgroundColor: #fff`
- `color: #333`
- `padding: 3px 6px`
- `borderRadius: 4px`
- `boxShadow: 0 0 5px rgba(0,0,0,0.3)`
- `transform: translate(-50%, 0)`

If the [`center`](/api-reference/tooltip#tooltip-options) option is set to `false` then the `transform` style will not be set.

The other default styles can be removed by setting the [`theme`](/api-reference/tooltip#tooltip-options) option to `none`.

You can also override individual default styles with the [styles](/api-reference/overlay#properties) property or the [style()](/api-reference/overlay/#style) method.

There are four ways to style the tooltip:

1. Do nothing and the above default styles are set.
2. Create a `div` tag that you set as the content for the tooltip. That `div` tag can either have a CSS class that you attach styles to, or you can assign styles to the `div` DOM element when you are creating it. You will probably want to also set the [`theme`](/api-reference/tooltip#tooltip-options) to `none` to remove the default styles. Note that the tooltip content is set inside the tooltip container `div` that by default has the above styles applied to it.
3. Pass an object of styles to the [`styles`](/api-reference/tooltip#tooltip-options) to style the container `div` tag that wraps the tooltip content. These styles will overwrite the default styles above if you pass the same style name. For example, if you include `color` in your `styles` object then that will overwrite the default color above. You can also set the [`theme`](/api-reference/tooltip#tooltip-options) to `none` to completely remove the default styles.
4. Add a class name to the container `div` that wraps the tooltip content with the [`className`](/api-reference/tooltip#tooltip-options) option and then attach styles to that CSS class name.

## Recommended styles

If you end up styling the tooltip with your own custom class, here are some recommended styles:

```css
.MapTooltip {
    background: #fff;
    box-shadow: 0 0 5px rgb(0 0 0 / 30%);
    color: #555;
    font-size: 1.2rem;
    padding: 4px 8px;
}

.MapTooltip::before {
    border: 8px solid transparent;
    border-bottom-color: #fff;
    content: '';
    left: 50%;
    position: absolute;
    top: -15px; /* Google maps sometimes uses partial pixel values. This pulls the triangle down enough to overlap the tooltip box */
    transform: translateX(-50%);
}
```

You may also need to add an offset for the triangle that gets added above the tooltip with the `::before` element. How you set this depends on how you're adding your tooltip. Below is a recommended offset that works well for markers.

```js
offset: [0, 15]
```
