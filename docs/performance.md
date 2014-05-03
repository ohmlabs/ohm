# Designer's Guide to High Performing Websites
Building a high performance website is a remarkably challenging feat, but there are very clear steps to follow to maximize the performance of your site or app. How you build your structure and build your applications matters immensely in regards to performance. A major consideration: running scripts blocks parallel downloads, which can slow down your site download times. 

Basic Rule: the most basic technologies (HTML/CSS) should be used in lieu of writing complicated scripts or using javascript plugins whenever possible.

* Make fewer HTTP requests
* Use a CDN
* Add an Expires header
* Gzip components
* Put stylesheets at the top
* Move scripts to the bottom
* Caching
* CSS image sprites
* Avoid CSS expressions
* Make JS and CSS external
* Reduce DNS lookups
* Minify JS
* Avoid redirects
* Remove duplicate scripts
* Configure ETags
* Make AJAX cacheable
