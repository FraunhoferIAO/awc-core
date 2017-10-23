# Adaptive Web Components Framework

AWC is a framework for the implementation of adpative user interface components based on the 
[Web Components Specifications](https://github.com/w3c/webcomponents). Components are implemented as custom elements 
that are able to switch to different variants of their inner DOM structure depending on user preferences or context 
conditions. Additionally, it provides CSS context queries to allow developers to easily define styles that depend on 
context properties.

## How to try it...
To play around with some AWC examples:
 * `git clone` this repository
 * be sure to have `node` and `npm` installed (see [node.js](http://nodejs.org/))
 * go to the `examples` subdirectory
 * `npm install` the examples' dependencies
 * `npm start` to run lite-server
 * try the examples in any browser natively supporting custom elements, templates and shadow DOM or through the 
  webcomponents.js polyfills ([Browser Support Table](https://www.webcomponents.org/)).

## How to create your own adaptive web components
The Adaptive Web Components Framework is pre-bundled in standalone distributable file located at `dist/awc-core.js`. 
By simply loading this script, AWC's public API is exposed in a global `awc` object.

 * Load adaptive web components core
```html
<script src="dist/awc-core.js"></script>
```

 * Implement your adaptive web component and its variants
```js
// Create the adaptive web component class
class MyAdaptiveElement extends awc.AdaptiveComponent(HTMLElement) {
  // Implementation of properties and behavior
}

// Register an adaptive variant (first one will be used as default)
MyAdaptiveElement.registerVariant(
  class MyFirstVariant extends awc.AdaptiveVariant {
    get template() {/*...*/}
    static matches(context) {/*...*/}
    // Implementation of properties and behavior
  }
);

// Register additional variants
MyAdaptiveElement.registerVariant(/*...*/);

// Define the adaptive web component as custom element
window.customElements.define('my-adaptive-element', MyAdaptiveElement);
```

 * Create a profile store for your page
```js
// Create a changable profile store instance
let profilestore = new awc.ProfileStore(true);
```

 * Use your adaptive web component in your page
```html
<my-adaptive-element></my-adaptive-element>
```

 * Change context properties in the profile store to switch variants
```js
profilestore.changeProfile(/*{propname: value}*/);
```

For for more details see the [API documentation](./doc/API.md) or have a look into the sources of the provided 
[examples](./example/).

## How to use context dependent styles
AWC provides the custom `<context-style>` element. Similar to media queries `@media` rules, it allows to define CSS 
styles through `@context` rules. The contained CSS rules are applied to the document depending on context properties as 
supplied by a profile store.

```html
<!-- Reference to external file containing context rules -->
<context-style href="stylesheets/contexts.css"></context-style>

<!-- Context-conditional reference to external file -->
<context-style context="(max-context-property: 40%)" href="stylesheets/styles.css"></context-style>

<!-- Inline with context rules -->
<context-style>
  @context (max-context-property: 40%) { 
    body { background-color: #eee}
  }
</context-style>
```

`@context` rules support both, the traditional `min-`/`max-` prefixed notation as well as the range notation defined in 
[Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/#mq-range-context).

```css
@context (30% <= context-property <= 70%) { 
   body { background-color: #eee}
}

@context (min-context-property: 30%) and (max-context-property: 70%) {
  body { background-color: #eee}
}
```

## Known limitations
 * Currently, AWC only works in browers that support [ES6 classes](http://caniuse.com/#feat=es6-class).
 * The current version of AWC should still be treatet as a research prototype. It may not be ready for productive use. 
   Be sure to test your implementations based on it in all relevant browsers.
 * Adaptive web components have to be custom elements, not customized native elements. That means that the 
   `AdaptiveComponent` mixin may only be applied to `HTMLElement`.
 * Adaptive web components that extend other adaptive web components are not yet supported.

## License
The Adaptive Web Components Framework is licensed under the [Clear BSD License](LICENSE).

## Funding Acknowledgement

The research leading to these results has received funding from the European Union's Seventh Framework Programme (FP7) 
under grant agreement no. 610510 ([Prosperity4all](http://www.prosperity4all.eu/)).

Visit the [GPII DeveloperSpace](https://ds.gpii.net) to find more useful resources.