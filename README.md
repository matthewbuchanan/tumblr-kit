Tumblr Kit
==========

A jQuery framework for ajax loading post content via Tumblr’s v2 API and rendering it in your document using customisable JsRender templates. See the [demo](http://dl.dropbox.com/u/25640/tumblr-kit/demo/index.html).

## Dependencies

Tumblr Kit requires [jQuery 1.4+](http://jquery.com) and [JsRender 1.0pre+](http://github.com/borismoore/jsrender/).

## Setup

Include the dependent frameworks listed above:

	<script src="http://code.jquery.com/jquery.js"></script>
	<script src="http://borismoore.github.com/jsrender/jsrender.js"></script>

Declare global variables for your Tumblr OAuth Consumer Key ([register one here](http://www.tumblr.com/oauth/apps)) and your blog’s hostname:

	<script>
		var TUMBLR_API_KEY = "U41Qn………0e6aR";
		var TUMBLR_HOSTNAME = "matthewb.tumblr.com";
	</script>

Replace the values above with your own details.

### Use in public themes

If you’re including Tumblr Kit in a public theme, you’ll need to have your users generate their own key, which isn’t ideal. I believe Tumblr is looking at a solution to make this easier for theme authors, but for now you’ll need to provide a [custom text](http://www.tumblr.com/docs/en/custom_themes#appearance-options) tag for the Consumer Key and output the blog’s hostname using the undocumented `{Host}` tag:

	<meta name="text:Tumblr OAuth Consumer Key" content=""/>

	var TUMBLR_API_KEY = "{text:Tumblr OAuth Consumer Key}";
	var TUMBLR_HOSTNAME = "{Host}";

## Post templates

Tumblr Kit uses [JsRender](http://github.com/borismoore/jsrender) templates to define the markup for each imported post. JsRender supercedes the now-deprecated [jQuery Templates](http://api.jquery.com/jQuery.template/) plugin. Boris Moore provides basic [demos and documentation](http://borismoore.github.com/jsrender/demos/) for JsRender, and I’ve put together a [sample template](http://github.com/matthewbuchanan/tumblr-kit/blob/master/sample-jsrender-templates.md) for each post type as part of this repository.

Include a JsRender template in your HTML page for each post type you intend to import. For example, the template for a text post might look like this:

	<script id="tmpl-text" type="text/x-jsrender">
		<article id="post-{{:id}}" class="post-{{:type}}">
			<h1>{{:title}}</h1>
			{{:body}}
		</article>
	</script>

Tumblr’s [API documentation](http://www.tumblr.com/docs/en/api/v2#text-posts) provides a JSON schema for each post type that will help you to define your templates.

### JsRender Helpers

JsRender provides a mechanism for registering helper functions to assist with the processing of data within templates. The following helpers are included with Tumblr Kit:

<table>
	<thead>
		<tr>
			<th>Helper function</th>
			<th>Post&nbsp;type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>getHostname()</code></td>
			<td></td>
    	<td>Returns the blog hostname as declared in the TUMBLR_HOSTNAME global variable.</td>
		</tr>
		<tr>
			<td><code>getTintedAudioPlayer(view[, color])</code></td>
			<td>audio</td>
    	<td>Returns the embed code for the Flash audio player, optionally tinted with the specified hex `color` value.</td>
		</tr>
		<tr>
			<td><code>getPhotoURL(view, size)</code></td>
			<td>photo</td>
    	<td>Returns the best image URL from available photo sizes based on the specified `size` parameter.</td>
		</tr>
		<tr>
			<td><code>getPhotoOrientation(view)</code></td>
			<td>photo</td>
    	<td>Returns the image’s aspect ratio as <code>"portrait"</code>, <code>"landscape"</code> or <code>"square"</code>.</td>
		</tr>
		<tr>
			<td><code>getVideoEmbed(view, size)</code></td>
			<td>video</td>
    	<td>Returns the best embed code from available video sizes based on the specified <code>size</code> parameter.</td>
		</tr>
	</tbody>
</table>

*Pass `#view` to the above helpers (where required) to set the current context for the function.

## Usage

With your globals and templates declared, importing post data is easy. Tumblr Kit provides a single function to import posts, `getTumblrPosts()`, which is called on a jQuery selector, like this:

	$("#posts").getTumblrPosts();

By default, this loads the 20 most recent posts from the target blog and renders them inside the `#posts` element using the JsRender templates defined in your page. When no template ID is specified in the options, the default template naming scheme is expected: `#tmpl-audio`, `#tmpl-chat`, etc.

If you include an element inside your container with a class of `tumblr-api-loading` it will be hidden on completion of the ajax load.

### Options

The `getTumblrPosts()` function takes several settings parameters (all optional).

<table>
	<thead>
		<tr>
			<th>Option</th>
			<th>Type</th>
			<th>Default</th>
			<th>Value(s)</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>hostname</code></td>
			<td>string</td>
			<td>TUMBLR_HOSTNAME</td>
    	<td>Eg. "matthewb.tumblr.com", "matthewbuchanan.name"</td>
		</tr>
		<tr>
			<td><code>id</code></td>
			<td>integer</td>
			<td>null</td>
    	<td>The ID of a particular Tumblr post</td>
		</tr>
		<tr>
			<td><code>type</code></td>
			<td>string</td>
			<td></td>
    	<td>"answer", "audio", "chat", "link", "photo", "quote", "text" or "video"</td>
		</tr>
		<tr>
			<td><code>tag</code></td>
			<td>string</td>
			<td></td>
    	<td>Eg. "sports", "tech" or "design"</td>
		</tr>
		<tr>
			<td><code>limit</code></td>
			<td>integer</td>
			<td>20</td>
    	<td>The number of posts to load (1 – 20)</td>
		</tr>
		<tr>
			<td><code>offset</code></td>
			<td>integer</td>
			<td>0</td>
    	<td>The starting index of the first post, useful for implementing pagination</td>
		</tr>
		<tr>
			<td><code>format</code></td>
			<td>string</td>
			<td></td>
    	<td>Empty string (for HTML), "text" or "raw"</td>
		</tr>
		<tr>
			<td><code>template</code></td>
			<td>string</td>
			<td></td>
    	<td>The ID of the JsRender template to use, eg. "#myTemplate"</td>
		</tr>
		<tr>
			<td><code>before</code></td>
			<td>function</td>
			<td>null</td>
    	<td>Function to run prior to data retrieval</td>
		</tr>
		<tr>
			<td><code>success</code></td>
			<td>function</td>
			<td>null</td>
    	<td>Function to run upon successful data retrieval</td>
		</tr>
		<tr>
			<td><code>error</code></td>
			<td>function</td>
			<td>null</td>
    	<td>Function to run upon unsuccessful data retrieval</td>
		</tr>
		<tr>
			<td><code>complete</code></td>
			<td>function</td>
			<td>null</td>
    	<td>Function to run following execution of <code>success</code> and <code>error</code> callbacks</td>
		</tr>
	</tbody>
</table>

Use `this` in your callbacks to refer to the container element(s) defined in the jQuery selector used with `.getTumblrPosts()`. The `success`, `error`	 and `complete` callbacks are modelled on those defined in jQuery’s [`$.ajax()` function](http://api.jquery.com/jQuery.ajax/), and implement the same arguments in each case.

## Version history

**0.9.2**
- Correctly pass the context for `this` to callback functions.

**0.9.1**
- Added support for `before()` callback.
- Changed approach to hiding the loading message, now requires a class of `.tumblr-api-loading`.

**0.9**
- Initial public release.

## License

The Tumblr Kit source is copyright © 2012 by [Matthew Buchanan](http://matthewbuchanan.name) and released under the [WTFPL license](http://sam.zoy.org/wtfpl/).