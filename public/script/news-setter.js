/**
 * News setter- parses the news data from a XML file, displays previews of the
 * news separated by pages and adds a functionality for displaying a post after
 * clicking on the smaller preview
 * 
 * @author Pexeto http://pexeto.com
 */

var newsSetter = {
	// main default settings
	xmlSourceFile : 'news.xml',
	divContainerId : 'news',
	itemsPerPage : 3,
	pageWidth : 464,
	easing : '', // will be overwritten by the XML data
	animationSpeed : 500, // will be overwritten by the XML data

	// data containers
	news : [],
	divContainer : null,
	firstColumn : null,
	wrapper : null,
	pageWrappers : [],
	currentShown : 0,

	/**
	 * Inits the news setter.
	 */
	init : function(args) {
		for ( var key in args) {
			if (typeof args[key] !== 'function') {
				this[key] = args[key];
			}
		}
		this.divContainer = $('#' + this.divContainerId);
		this.parseData();
	},

	/**
	 * Parses the data from the XML file, creates objects from the data and
	 * saves the objects into arrays.
	 */
	parseData : function() {
		$.ajax( {
			type : 'GET',
			url : newsSetter.xmlSourceFile,
			dataType : 'xml',
			success : function(xml) {

				// get the number of items per page
				newsSetter.itemsPerPage = Number($(xml).find(
						'items_per_page:first').text());
				newsSetter.easing = $(xml).find('animation_easing:first')
						.text();
				newsSetter.animationSpeed = Number($(xml).find(
						'animation_speed:first').text());

				$(xml).find('post').each(
						function(i) {
							var current = $(this);
							var post = {
								title : current.find('ptitle:first').text(),
								thumbnail : current.find('thumbnail:first')
										.text(),
								small_thumbnail : current.find(
										'small_thumbnail:first').text(),
								date : current.find('date:first').text(),
								category : current.find('category:first')
										.text(),
								author : current.find('author:first').text(),
								content : $('content:first', current).text()
							};

							// create the object for the post
							post.obj = $(newsSetter.createPostHtml(post));
							post.smallObj = $(newsSetter
									.createSmallPostHtml(post));

							newsSetter.news.push(post);
						});

				if (newsSetter.news.length > 0) {
					newsSetter.displayContent();
				}
			}
		});
	},

	/**
	 * Creates the HTML for the big preview post from the left.
	 */
	createPostHtml : function(post) {
		var html = '<div class="news_post_container"><h2>' + post.title + '</h2><div class="post_info">';
		if (post.date) {
			html += post.date + ' | ';
		}
		if (post.category) {
			html += post.category + ' | ';
		}
		if (post.author) {
			html += post.author;
		}
		html += '</div>';
		if (post.thumbnail) {
			html += '<img src="' + post.thumbnail + '" alt="" class="alignleft rounded_corner shadow" />';
		}
		html += '<p>' + post.content + '</p></div>';
		post.obj = $(html);

		return html;
	},

	/**
	 * Creates the HTML for the smaller preview post from to the right.
	 */
	createSmallPostHtml : function(post) {
		var html = '<div class="prev_post">';
		if (post.small_thumbnail) {
			html += '<img src="' + post.small_thumbnail + '" alt="" class="alignleft rounded_corner shadow" />';
		}
		html += '<h3>' + post.title + '</h3><div class="post_info">';
		if (post.date) {
			html += post.date + ' | ';
		}
		if (post.category) {
			html += post.category + ' | ';
		}
		if (post.author) {
			html += post.author;
		}
		html += '</div></div>';

		return html;
	},

	/**
	 * Displays the main content of the news container.
	 */
	displayContent : function() {
		newsSetter.firstColumn = $('<div class="two_columns_1"></div>');
		var secondColumn = $('<div class="two_columns_2"><div id="news_wrapper"></div></div>');
		newsSetter.divContainer.append(newsSetter.firstColumn);
		newsSetter.divContainer.append(secondColumn);
		newsSetter.wrapper = secondColumn.find('#news_wrapper');

		// show the first post
		newsSetter.showPost(newsSetter.news[0]);

		// show the other posts from the right
		newsSetter.displayPostList();

		// load the Cufon font replacement
		tonicSite.setCufon();
	},

	showPost : function(post) {
		newsSetter.firstColumn.html(post.obj);
	},

	/**
	 * Displays all the smaller post previews to the right, separated by pages.
	 */
	displayPostList : function() {

		for ( var i = 0; i < newsSetter.news.length; i++) {
			if (i % newsSetter.itemsPerPage === 0) {
				var pageWrapper = $('<div class="news_posts"></div>');
				newsSetter.pageWrappers.push(pageWrapper);
				newsSetter.wrapper.width(newsSetter.wrapper.width() + 500);
				newsSetter.wrapper.append(pageWrapper);
			}
			var post = newsSetter.news[i].smallObj;

			newsSetter.pageWrappers[newsSetter.pageWrappers.length - 1]
					.append(post);
		}

		if (newsSetter.news.length > newsSetter.itemsPerPage) {
			newsSetter.showNavigation();
		}

		newsSetter.setPostClickHandlers();
	},

	/**
	 * Shows the pagination below the smaller post previews.
	 */
	showNavigation : function() {
		newsSetter.wrapper
				.parent()
				.append(
						'<div id="prev_post_nav"><a href="" id="prev_post_l"></a> <a href="" id="prev_post_r"></a></div>');
		var prevButton = newsSetter.wrapper.parent().find('a#prev_post_l');
		var nextButton = newsSetter.wrapper.parent().find('a#prev_post_r');

		// set the next button click handler
		nextButton.click(function(event) {

			event.preventDefault();
			if (newsSetter.currentShown < newsSetter.pageWrappers.length - 1) {
				var margin = -(newsSetter.currentShown + 1)
						* (newsSetter.pageWidth + 20);
				newsSetter.wrapper.animate( {
					marginLeft : [ margin, newsSetter.easing ]
				}, newsSetter.animationSpeed);
				newsSetter.currentShown++;
			}
		});

		// set the previous button click handler
		prevButton.click(function(event) {
			event.preventDefault();
			if (newsSetter.currentShown !== 0) {
				var margin = -(newsSetter.currentShown - 1)
						* (newsSetter.pageWidth + 20);
				newsSetter.wrapper.animate( {
					marginLeft : [ margin, newsSetter.easing ]
				}, newsSetter.animationSpeed);
				newsSetter.currentShown--;
			}
		});
	},

	/**
	 * Sets post click handlers to the smaller previews. When a small preview post is clicked
	 * the whole content of the post is shown to the left.
	 */
	setPostClickHandlers : function() {
		var newsNumber = newsSetter.news.length;
		for ( var i = 0; i < newsNumber; i++)
			(function(i) {
				newsSetter.news[i].smallObj.each(function(j) {
					$(this).bind(
							{
								'click' : function() {
									var current = newsSetter.news[i];
									current.obj.hide();

									newsSetter.firstColumn.html(current.obj);
									current.obj.fadeIn(700);

									tonicSite.setRoundedCorners(current.obj
											.find('img.rounded_corner'));
									Cufon.replace(current.obj.find('h2'));
								},
								'mouseover' : function() {
									$(this).addClass('prev_post_hover');
									$(this).css( {
										cursor : 'pointer'
									});
								},
								'mouseout' : function() {
									$(this).removeClass('prev_post_hover');
								}
							});
				});
			})(i);

	}

};