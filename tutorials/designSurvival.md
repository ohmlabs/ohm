# Design Survival

#### Warning

This guide is not designed for absolute novice web developer. Therefore, I thought it would be helpful to provide some references for those people. I recommend starting with watching these videos first. They are stylish introductions to the concepts that you will need to be a web developer. You may also want to complete the W3C tutorials and grab a copy of any of the books listed in the additional materials section and peruse it at your leisure. That being said, the best way is to simply dive in and build your own site.   
 
## CSS3
### Pre-processors: SASS v. LESS v. Stylus

### [Box Model ](http://www.w3schools.com/cssref/default.asp#box)
![Box Model](img/box-model.png)

Precision is the key when aligning content with CSS. A deep understanding of the properties related to the box model and display is crucial for creating responsive designs and finely tuned layouts.

* overflow 
* clearfix  
* display
  + inline (default): The element is displayed as an inline-level element (e.g. span) 
  + block: element is displayed as a block-level element with width &height (e.g. div, p)
  + inline-block

### Padding 
```css
padding:25px 50px 75px 100px;
```

* top padding is 25px
* right padding is 50px
* bottom padding is 75px
* left padding is 100px

### [Background](http://www.w3schools.com/css3/css3_backgrounds.asp)
```css
body {background:#ffffff url('img_tree.png') no-repeat right top;}
```

* background-color
* background-image
* background-repeat
* background-attachment
* background-position

Also important:

* background-size
* background-origin

### [Borders](http://www.w3schools.com/css3/css3_borders.asp)

* border-radius
* box-shadow
* border-image

![Font Shorthand](img/font-shorthand.png)
### [Typography](http://www.w3schools.com/css3/css3_fonts.asp)
Typography is quickly becoming the calling card of good web design. No longer limited to a small collection of "web-safe" fonts. With the introduction of the @font-face rule and the text-shadow to CSS3 the possibilities are getting very exciting.

![Typography](img/typography.jpg)
### 2D/3D Transformations
### Animations
### Transitions
### Multiple Column Layout
### User Interface
### Selectors 
Understanding CSS selectors is the most critical concept to grasp if you are going to become a guru of front end design. A detailed understanding of every CSS property is useless if you don't understand how to apply them to what you want. Here [source 6] is a guide to complex selectors, and most of the recommended books have great chapters on the subject.

* child selectors:
  + descendant selector ( div p) 
  + direct child selector (div > p) selects only those directly within the parent
* sibling selectors (div ~ p) selects the specified elements that shares a parent and follows
* adjacent sibling selector (div +p)
* attribute selector (a[target], a[href="http://drake.fm"])
* pseudo classes (a:visited, a:focus, li:first-child, :nth-child)

#### [Selector Specificity](http://css-tricks.com/specifics-on-css-specificity/)
I would suggest following the link for a more detailed explanation of specificity. In a  nutshell, different selectors have different specificity values. As a result, those CSS rules with the highest specificity value will override those with lower values. It is calculated as such:

![Specificity](img/specificity.png)

## HTML5 
Using progressive HTML5 techniques can not only save you time developing, but also can enrich performance. For example, rather than writing a long chunk of code to validate a form input, use the new HTML5 form elements which automatically validate (input="email"). Of the many HTML5 features the most important are:

* Semantics
* Better Forms
  + autofocus
  + placeholder text
  + new input types (email, date-picker, etc.)
  + required fields
  + automatic validation (may some day replace client side validation)
* Canvas element
* Audio/Video Support

Commonly associated but technically separate/experimental features with their own specification

* Geolocation API
* Web Sockets
* SVG
* Local Storage

### HTML DOM Objects - Methods and Properties

Some commonly used HTML DOM methods:

* getElementById(id) - get the node (element) with a specified id
* appendChild(node) - insert a new child node (element)
* removeChild(node) - remove a child node (element)

Some commonly used HTML DOM properties:

* innerHTML - the text value of a node (element)
* parentNode - the parent node of a node (element)
* childNodes - the child nodes of a node (element)
* attributes - the attributes nodes of a node (element)

Some commonly used HTML DOM events

* onclick
* onresize
* onload
* onblur
* onfocus
* onscroll

## Javascript
Stuff everyone should use:

* Modernizr
* JQuery
* Klass

Popular Frameworks and Libraries

* Backbone.js
* Underscore.js
* Bootstrap
* Handlebars.js
* ember.js
* XUI

Really cool icing

* D3
* skrollr.js
* impress.js
* jquery file upload

Server-side javascript

* Node.js
* coffee-script
* connect
* stylus
* nib
* express
* socket.io

## References

* HTML5 & CSS3 Readiness
* Browser Support Stats (Jul 12)
* Test your browser
* Yahoo's guide to High Performance Websites
* HTML5 Performance
* Complex Selectors
* Detailed CSS positioning

### Specifications

* W3C HTML Specification
* W3C CSS Specification

### Resources for Beginners

* Don't Fear the Internet
* Dive into HTML5
* Code Academy

### Software I Use

* TextMate
* Emacs
* Github 
* Homebrew
* Compass
* cheat sheets
* Dropbox

### Cool Tools 

* Stack Overflow
* HTML5 Please
* CSS3 Please
* HTML5 Boilerplate
* Tabifier
* DocHub
* Quora
* jsFiddle or Gists

### Further Reading

* High Performance Web Sites - Steve Souders 
* CSS The Definite Guide - Eric A Meyer
* CSS Pocket Reference - Eric A Meyer
* Javascript: The Good Parts - Douglas Crockford
* Secrets of the Javascript Ninja - John Resig
* JQuery Novice to Ninja - Early Castledine and Craig Sharkie
* Responsive Design - Ethan Marcotte
 
### Browser Support

The first step to designing a website or web app is to determine which browsers and screens you want to support. Once you have decided which screens you want to support you have to think about the features that your app will require (geolocation, media playback, etc.) and determine which technologies are best for creating these features. Naturally, you want to use the most cutting edge technologies, but some of the browsers that you want to support may not support some features. For this problem the feature-detection library Modernizr should be used to allow the site to determine which features are supported. Users should use technology that is most likely to be supported and fallbacks and polyfills should be created to maintain desired capabilities. According to the most recent trends in browsers, I would recommend users support the following browsers:

* Chrome
* Firefox
* Safari
* IE9
* Mobile + iPad

I know that it may trouble some people to see mobile lumped together like that but I won't get into the details of how to design a website for the millions of possible screen sizes that can be encountered in that space. I will write a blog post later on the subject of responsive design.

### Technical Interviews:

* Never dive too quickly into the question. If the question so easy they wouldn't be asking it. When you jump into a problem its generally with a brute-force solution, or at least not the most elegant solution. A few minutes of deliberation could lead you to a solution that will reflect much better on you.
* Think out loud. The whole point is to understand how you think. And just thinking in silence and then scribbling an answer that you hope is correct will not help your interviewer get what they want. They want to see you get the right answer, and if your train of thought is sending you in the wrong direction they will almost always drop hints.
* Critique your own solution. Before you decide to present your answer ask yourself: is this a perfect solution? If the answer is yes, think again. You may not be able to fix the shortcomings of your solution but it will help you tremendously to follow up your answer with "If I had more time one shortcoming in this solution that I would address would be..."
