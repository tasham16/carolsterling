/**
 * This file contains the functionality for initializing all the scripts in the
 * site and also there are some main initial settings included here, such as
 * setting rounded corners automatically, setting the Twitter functionality,
 * etc.
 * 
 * @author Pexeto
 */

var tonicSite = {
	initSite : function() {
		// init the portfolio functionality
		portfolioSetter.init();

		// set the contact form functionality
		tonicContactForm.set();

		// set the news functionality
    // dm: deleting nov 24, 2017
		//newsSetter.init();

		// load the slider
		tonicSite.loadSlider();

		// sets the colorbox lightbox
		$("a[rel='lightbox']").colorbox();

		// load the scrolling functionality
		$('#menu ul li a').click(function(event) {
			event.preventDefault();
			var rel = $(this).attr('rel');
			if (rel && $('#' + rel)[0]) {
				$.scrollTo($('#' + rel), 700);
			}
		});

		// fix the IE6 position fixed issue
		if ($.browser.msie && $.browser.version.substr(0, 1) < 7) {
			$("#menu_container").css("position", "absolute");
			$(window).scroll(function() {
				$("#menu_container").css("top", $(window).scrollTop() + "px");
			});
		}

		// set the Cufon font replacement
		this.setCufon();

		// set rounded corners
		window.onload = this.setDefaultRoundedCorners;

	},

	/**
	 * Loads the Nivo image slider.
	 */
	loadSlider : function() {
		// load the Nivo slider
		$(window)
				.load(function() {
					$('#slider').nivoSlider( {
						effect : 'random', // Specify sets like:
						// 'fold,fade,sliceDown'
						slices : 15,
						animSpeed : 800,
						pauseTime : 3000,
						startSlide : 0, // Set starting Slide (0 index)
						directionNav : false, // Next & Prev
						directionNavHide : true, // Only show on hover
						controlNav : true, // 1,2,3...
						controlNavThumbs : false, // Use thumbnails for
						// Control
						// Nav
						controlNavThumbsFromRel : false, // Use image rel for
						// thumbs
						keyboardNav : true, // Use left & right arrows
						pauseOnHover : true, // Stop animation while hovering
						manualAdvance : false, // Force manual transitions
						captionOpacity : 0.8, // Universal caption opacity
						beforeChange : function() {
						},
						afterChange : function() {
						},
						slideshowEnd : function() {
						} // Triggers after all slides have been shown
					});

					// remove numbers from navigation
						$('.nivo-controlNav a').html('');

						// center the slider navigation
						var slideNumber = $('.nivo-controlNav a').length;
						var slideLeft = 960 / 2 - slideNumber * 21 / 2;
						$('.nivo-controlNav:first').css( {
							left : slideLeft
						});

						// set corners to the slider
						$('#slider_container')
								.append(
										'<div id="corner_left_top"></div><div id="corner_right_top"></div><div id="corner_left_bottom"></div><div id="corner_right_bottom"></div>');
					});
	},

	/**
	 * Displays the latest tweet- when the Twitter icon in the main menu is
	 * hovered, a tooltip with the tweet is shown.
	 * @param username the Twitter username
	 */
	showTwitterStatus : function(username) {

		$
				.ajax( {
					url : "http://twitter.com/statuses/user_timeline/"
							+ username + ".json?callback=?&count=2",
					dataType : "json",
					timeout : 15000,

					success : function(data) {
						var bubble = $('<div id="twitter_status" class="twt"><div id="twitter_status_top" class="twt"></div><p>' + data[0].text + '</p></div>');

						$("#menu").append(bubble);
						$('#twitter_status').css( {
							marginTop : -10
						}).hide();
						$("#menu_icon_right").hover(
								function() {
									$("#menu").find('#twitter_status').stop()
											.show().animate( {
												marginTop : 0
											});
								},
								function() {
									$("#menu").find('#twitter_status').stop()
											.animate( {
												marginTop : -10
											}).hide();
								});
					}
				});
	},

	/**
	 * Sets the Cufon font replacement.
	 */
	setCufon : function() {
		Cufon.replace('h1');
		Cufon.replace('h2');
		Cufon.replace('h3');
		Cufon.replace('h4');
		Cufon.replace('h5');
		Cufon.replace('h6');
	},

	/**
	 * Calls the function to set the rounded corners by default to all the
	 * elements from the "rounded_corner" class.
	 */
	setDefaultRoundedCorners : function() {
		tonicSite.setRoundedCorners($('img.rounded_corner'));
		$('.rounded_corner').not('img').corner();

	},

	/**
	 * Sets rounded corners to images.
	 * @param obj an image element
	 */
	setRoundedCorners : function(obj) {

		obj.each(function(i) {
			var width = $(this).width();
			var height = $(this).height();
			var src = $(this).attr('src');
			var divWrapper = $('<div></div>');

			var divClass = 'corner_wrapper';
			var classes = $(this).attr('class').split(' ');
			for ( var i = 0; i < classes.length; i++) {

				if (classes[i] !== 'rounded_corner') {
					divClass += ' ' + classes[i];
				}

			}

			$(this).addClass('hidden').wrap(divWrapper).hide();
			$(this).parent().css( {
				width : width,
				height : height,
				backgroundImage : 'url(' + src + ')'
			}).addClass(divClass).corner('7px');

		});

	}
};

/**
 * Contains the functionality of the send email form. Makes the validation and
 * sends the message.
 */
tonicContactForm = {
	emptyNameMessage : 'Please fill in your name',
	invalidEmailMessage : 'Please insert a valid email address',
	emptyQuestionMessage : 'Please write your question',
	sentMessage : 'Message Sent',
	set : function() {
		this.setSendButtonClickHandler();
		this.setInputClickHandler();
	},

	/**
	 * Sets the send button click event handler. Validates the inputs and if they are
	 * not valid, displays error messages. If they are valid- makes an AJAX request to the
	 * PHP script to send the message.
	 */
	setSendButtonClickHandler : function() {
		$("#send_button")
				.click(function(event) {

					event.preventDefault();
					valid = true;

						// remove previous validation error messages and warning styles
						$("#name_text_box").removeClass('invalid');
						$("#email_text_box").removeClass('invalid');
						$("#question_text_area").removeClass('invalid');
						$('#invalid_input').hide();
						$('#sent_successful').hide();
						$('.question_icon').remove();
						$('.contact_message').remove();

						// verify whether the name text box is empty
						var nameTextBox = $("#name_text_box");
						var name = nameTextBox.val();
						if (name == '' || name == null) {
							nameTextBox.addClass('invalid');
							valid = false;
							$(
									'<div class="question_icon"></div><div class="contact_message"><p>' + tonicContactForm.emptyNameMessage + '</p></div>')
									.insertAfter(nameTextBox);
						}

						// verify whether the inserted email address is valid
						var emailTextBox = $("#email_text_box");
						var email = emailTextBox.val();
						if (!tonicContactForm.isValidEmailAddress(email)) {
							emailTextBox.addClass('invalid');
							valid = false;
							$(
									'<div class="question_icon"></div><div class="contact_message"><p>' + tonicContactForm.invalidEmailMessage + '</p></div>')
									.insertAfter(emailTextBox);
						}

						// verify whether the question text area is empty
						var questionTextArea = $("#question_text_area");
						var question = questionTextArea.val();
						if (question == '' || question == null) {
							questionTextArea.addClass('invalid');
							valid = false;
							$(
									'<div class="question_icon"></div><div class="contact_message"><p>' + tonicContactForm.emptyQuestionMessage + '</p></div>')
									.insertAfter(questionTextArea);
						}

						if (!valid) {
							//the form inputs are not valid
							$('.contact_message').animate( {
								opacity : 0
							}, 0).hide();
							$('.question_icon').hover(
									function() {
										$(this).css( {
											cursor : 'pointer'
										});
										$(this).siblings('.contact_message')
												.stop().show().animate( {
													opacity : 1
												}, 200);
									},
									function() {
										$(this).siblings('.contact_message')
												.stop().animate( {
													opacity : 0
												}).hide();
									});

							$('#invalid_input').show();
						} else {
							//the form inputs are valid
							
							// show the loading icon
							$('#contact_status').html(
									'<div class="contact_loader"></div>');

							// the data is valid, sumbit the form
							urlToPhp = "send_email.php";

							var dataString = 'name=' + name + '&question='
									+ question + '&email=' + email;

							$
									.ajax( {
										type : "POST",
										url : urlToPhp,
										data : dataString,
										success : function() {
											$("#submit_form").each(function() {
												this.reset();
											});
											$('#contact_status')
													.html(
															'<div class="check"></div><span>' + tonicContactForm.sentMessage + '</span>');
											setTimeout(function() {
												$('#contact_status').fadeOut(
														500,
														function() {
															$(this).html('')
																	.show();
														});
											}, 3000);
										}
									});
						}
					});
	},

	setInputClickHandler : function() {
		$('.form_input').click(function() {
			$(this).removeClass('invalid');
		});

		$('.form_input').live('keydown', function(e) {
			var keyCode = e.keyCode || e.which;

			if (keyCode == 9) {
				var index = $('.form_input').index($(this));
				$('.form_input').eq(index + 1).removeClass('invalid');
			}
		});
	},

	/**
	 * Checks if an email address is a valid one.
	 * 
	 * @param emailAddress
	 *            the email address to validate
	 * @return true if the address is a valid one
	 */
	isValidEmailAddress : function(emailAddress) {
		var pattern = new RegExp(
				/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	}
};
