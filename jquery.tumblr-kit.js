;(function ( $, window, undefined ) {

	$.fn.getTumblrPosts = function(options) {

		$.views.helpers({
			getHostname: function() {
				// Returns the blog hostname
				return TUMBLR_HOSTNAME;
			},

			getTintedAudioPlayer: function(view, color) {
				// Returns the embed code for the Flash audio player, optionally tinted with
				// the specified hex "color" value.
				var embed = view.data.player;
				if (color != null) {
					var regex = /color=FFFFFF/g;
					color = color.split("#")[1];
					return embed.replace(regex, "color=" + color);
				} else {
					return embed;
				}
			},

			getPhotoURL: function(view, size) {
				// Returns the best image URL from available photo sizes based on the specified
				// "size" parameter. For non-native sizes, returns the next largest size (if available).
				var images = view.data.alt_sizes,
					src = "",
					i = 0;
				for (var i = 0; i < images.length; i++) {
					if (images[i].width >= size) src = images[i].url; else break;
				}
				return (src === "") ? images[0].url : src;
			},

			getPhotoOrientation: function(view) {
				// Returns the image’s aspect ratio.
				var size = view.data.original_size;
				if (size.width > size.height) {
					return "landscape";
				} else if (size.width < size.height) {
					return "portrait";
				} else {
					return "square";
				}
			},

			getVideoEmbed: function(view, size) {
				// Returns the best embed code from available video sizes based on the specified
				// "size" parameter. For non-native sizes, returns the next smallest size.
				var players = view.data.player,
					embed = "",
					i = 0;
				for (var i = 0; i < players.length; i++) {
					if (players[i].width <= size) embed = players[i].embed_code; else break;
				}
				return (embed === "") ? players[0].embed_code : embed;
			}
		});

		// Default settings
		var settings = $.extend({
			"hostname": TUMBLR_HOSTNAME,
			"id": null, // post ID
			"type": "", // text, quote, link, answer, video, audio, photo
			"tag": "",
			"limit": 20, // 1 — 20
			"offset": 0, // 0 or integer
			"format": "", // none (for html), text, raw
			"template": "", // ID of JsRender template
			"success": null,
			"error": null,
			"complete": null
		}, options);

		var target = this;

		return this.each(function() {
			// Construct URL to call API based on settings
			if (settings.type != "") settings.type = "/" + settings.type;

			var uri = "http://api.tumblr.com/v2/blog/" +
				settings.hostname + "/posts" +
				settings.type + "?api_key=" +
				TUMBLR_API_KEY;

			// Either request a single post by ID or a set of posts by tag, limit, offset
			if (settings.id) {
				uri += "&id=" + parseInt(settings.id);
			} else {
				if (settings.tag) uri += "&tag=" + encodeURI(settings.tag);
				if (settings.limit) uri += "&limit=" + parseInt(settings.limit);
				if (settings.offset) uri += "&offset=" + parseInt(settings.offset);
			}

			// Send Ajax request to Tumblr API and render returned posts
			var request = $.ajax({
				url: uri,
				dataType: "jsonp",
				jsonp: "jsonp",
				success: function(data, textStatus, jqXHR) {
					// Hide ‘loading’ messages included in markup, if any
					target.html("");

					// Process each returned post
					$.each(data.response.posts, function() {
						// Set a default JsRender template if none was specified
						var template = (settings.template != "") ? settings.template : "#tmpl-" + this.type;

						// Render the post contents with the JsRender template
						target.append($(template).render(this));
					});

					// Run completion function if set
					if (typeof settings.success === "function") settings.success(data, textStatus, jqXHR);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					if (typeof settings.error === "function") settings.error(jqXHR, textStatus, errorThrown);
				},
				complete: function(jqXHR, textStatus) {
					if (typeof settings.complete === "function") settings.complete(jqXHR, textStatus);
				}
			});
		});
	};
}(jQuery, window));
