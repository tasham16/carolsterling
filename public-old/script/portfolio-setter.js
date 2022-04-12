/**
 * Portfolio setter- parses the portfolio item data from a XML file, displays the items separated
 * by pages and adds a category filter functionality.
 * @author Pexeto
 * http://pexeto.com 
 */


/**
 * Declare a function for the arrays that checks
 * whether an array contains a value.
 * @param value the value to search for
 * @return true if the array contains the value and false if the
 * array doesn't contain the value
 */
Array.prototype.contains=function(value){
	var length=this.length;
	for(var i=0; i<length; i++){
		if(this[i]===value){
			return true;
		}
	}
	return false;
};

var portfolioSetter = {
	//main settings
	xmlSource : 'portfolio.xml',
	pageWrapperClass: 'page_wrapper',
	pageHolderId: 'page_holder',
	navigationId: 'portfolio_pagination',
	categoriesId: 'portfolio_categories',
	itemClass: 'portfolio_item',
	itemsPerPage: 12, //will be overwritten by the XML data
	pageWidth: 980,
	showCategories: true,  //will be overwritten by the XML data
	allText: 'ALL', //the ALL text displayed before the categories names, will be overwritten by the XML data
	easing: '', //will be overwritten by the XML data
	animationSpeed: 500, //will be overwritten by the XML data
	
	categories : [],
	items : [],
	pageWrappers : [],
	pageHolder:null,
	imagesLoaded:0,
	main:this,
	counter:0,
	ie:false,
	categoryHolder:null,
	
	init : function() {
		$('#'+this.pageHolderId).append('<div class="loading"></div>');
		this.loadItems();
	},
	
	/**
	 * Parses the XML portfolio item data.
	 */
	loadItems:function(){
		$.ajax({
			type:'GET',
			url: this.xmlSource,
			dataType:'xml',
			success:function(xml){
			
				//get the settings
				if($(xml).find('show_categories:first').text()==='off'){
					portfolioSetter.showCategories=false;
				}
				portfolioSetter.allText=$(xml).find('all_text:first').text();
				portfolioSetter.easing=$(xml).find('animation_easing:first').text();
				portfolioSetter.animationSpeed=Number($(xml).find('animation_speed:first').text());
				portfolioSetter.itemsPerPage=Number($(xml).find('items_per_page:first').text());
				
			
				if(portfolioSetter.showCategories){
					//get the portfolio categories
					$(xml).find('categories').eq(0).find('category').each(function(i){
						var current=$(this);
						var category = {
							id:	current.attr('id'),
							name: current.text()
						};
						portfolioSetter.categories.push(category);
					});
				}
				
				//get the portfolio items
				$(xml).find('item').each(function(i){
					var current=$(this);
					var thum=current.find('thumbnail:first').text();
					var prev = current.find('preview:first').text();
					var cat=current.find('category:first').text().split(',');
					var desc = current.find('description:first').text();
					
					var item = {
						thumbnail:thum,
						preview:prev,
						category:cat,
						description:desc,
						obj:$('<div class="'+portfolioSetter.itemClass+'" style="background-image:url('+thum+');"><a rel="lightbox" class="single_image" href="'+prev+'" title="'+desc+'"><img class="hidden" /></a></div>')
					};
					portfolioSetter.items.push(item);
				});
			
				portfolioSetter.setSetter();
			}
		});
	},
	
	/**
	 * Calls the main functions for setting the portfolio items.
	 */
	setSetter:function(){
		 
		if($.browser.msie){
			this.ie=true;
		}
		this.pageHolder=$('#'+portfolioSetter.pageHolderId);
		this.pageHolder.after('<div id="'+this.navigationId+'"><ul></ul></div>');
		if(this.showCategories){
			this.displayCategories();
		}
		this.loadImages();
		
	},
	
	/**
	 * Displays the categories.
	 */
	displayCategories:function(){
		
		this.categoryHolder=$('<div id="'+this.categoriesId+'"></div>');	
		this.categoryHolder.append('<ul></ul>');
		this.pageHolder.before(this.categoryHolder);
		var catUl=this.categoryHolder.find('ul');
		
		//add the ALL link
		var allLink= $('<li>'+this.allText+'</li>');
		catUl.append(allLink);
		this.showSelectedCat(allLink);
		
		//bind the click event
		allLink.bind({
			'click': function(){
				portfolioSetter.displayItems();
				portfolioSetter.showSelectedCat($(this));
			},
			'mouseover':function(){
				$(this).css({cursor:'pointer'});
			}
		});
		
		//add all the category names to the list
		var catNumber=this.categories.length;
		for(var i =0; i<catNumber; i++)(function(i){
			var category = $('<li>'+portfolioSetter.categories[i].name+'</li>');
			catUl.append(category);
			
			//bind the click event
			category.bind({
				'click': function(){
					portfolioSetter.displayItems(portfolioSetter.categories[i].id);
					portfolioSetter.showSelectedCat($(this));
				},
				'mouseover':function(){
					$(this).css({cursor:'pointer'});
				}
			});
		})(i);
	},
	
	showSelectedCat:function(selected){
		//hide the previous selected element
		var prevSelected=this.categoryHolder.find('ul li.selected');
		if(prevSelected[0]){
			var prevHtml=prevSelected.find('div.port_cat').html();
			prevSelected.html(prevHtml);
			prevSelected.removeClass('selected');
		}
		
		//show the new selected element
		var html = selected.html();
		selected.html('<div class="port_cat_active"><div class="port_cat_l"></div><div class="port_cat">'+html+'</div><div class="port_cat_r"></div> </div>');
		selected.addClass('selected');
	},
	
	/**
	 * Loads the images. When all the images are loaded calls the displayItems 
	 * function to display the images.
	 */
	loadImages:function(){
		var imageCount=this.items.length;
		for(var i in this.items){
			if(this.items.hasOwnProperty(i)){
			 var img = new Image();
				$(img).load(function() {
					portfolioSetter.imagesLoaded++;
					if(portfolioSetter.imagesLoaded===imageCount){
						//all the images are loaded, display them all
						portfolioSetter.displayItems();
					}
				}).attr('src', portfolioSetter.items[i].thumbnail);  
			}
		}
	},
	
	/**
	 * Displays the portfolio items.
	 */
	displayItems:function(){
		
		var filterCat=arguments.length===0?false:true;
				
		//reset the divs and arrays
		$('.'+this.itemClass).css({display:'none'});
		this.pageHolder.html('');
		this.pageHolder.width(200);
		portfolioSetter.pageWrappers=[];
		portfolioSetter.pageHolder.animate({marginLeft:0});
		
		var length=this.items.length;	

		portfolioSetter.counter=0;
		var catId=arguments[0];
		for ( var i = 0; i < length; i++)
			(function(i, filterCat, catId) {
				
				if(!filterCat || (filterCat && portfolioSetter.items[i].category.contains(catId))){
					if(portfolioSetter.counter%portfolioSetter.itemsPerPage===0){
						//create a new page wrapper and make the holder wider
						portfolioSetter.pageHolder.width(portfolioSetter.pageHolder.width()+portfolioSetter.pageWidth);
						var wrapper=$('<div class="'+portfolioSetter.pageWrapperClass+'"></div>');
						portfolioSetter.pageWrappers.push(wrapper);
						portfolioSetter.pageHolder.append(wrapper);
					}
					
					if(portfolioSetter.ie){
						var obj=$('<div class="'+portfolioSetter.itemClass+'" style="background-image:url('+portfolioSetter.items[i].thumbnail+');"><a rel="lightbox" class="single_image" href="'+portfolioSetter.items[i].preview+'" title="'+portfolioSetter.items[i].description+'"></a><img class="hidden"/></div>');
						portfolioSetter.pageWrappers[portfolioSetter.pageWrappers.length-1].append(obj);
						portfolioSetter.items[i].obj=obj;
					}else{
						portfolioSetter.pageWrappers[portfolioSetter.pageWrappers.length-1].append(portfolioSetter.items[i].obj);
					}

					if(portfolioSetter.counter>=portfolioSetter.itemsPerPage){
						portfolioSetter.items[i].obj.show();
					}else{
						setTimeout(function() {
							//display the image by fading in
							portfolioSetter.items[i].obj.fadeIn().animate({opacity:1},0);
						},portfolioSetter.counter*100);
					}

					portfolioSetter.counter++;
				}
		})(i,filterCat, catId);
		
		//call the lightbox plugin
		$("a[rel='lightbox']").colorbox({current:"{current}/{total}"});
		
		$('.portfolio_item').corner();
		
		//show the navigation buttons
		this.showNavigation();
		this.setHoverFunctionality();
				
	},
	
	
	/**
	 * Displays the navigation buttons.
	 */
	showNavigation:function(){
		//reset the divs and arrays
		var navUl=$('#'+this.navigationId+' ul');
		navUl.html('');
		
		var pageNumber=this.pageWrappers.length;
		if(pageNumber>1){
			for(var i=0; i<pageNumber; i++)(function(i){
				var li = $('<li></li>');
				navUl.append(li);
				//bind the click handler
				li.bind({
					'click': function(){
						var marginLeft=i*portfolioSetter.pageWidth+i*8;
						portfolioSetter.pageHolder.animate({marginLeft:[-marginLeft,portfolioSetter.easing]}, portfolioSetter.animationSpeed);
						
						navUl.find('li.selected').removeClass('selected');
						$(this).addClass('selected');
					},
					'mouseover':function(){
						$(this).css({cursor:'pointer'});
					}
				});
			})(i);
			
			navUl.find('li:first').addClass('selected');
			
			//center the navigation
			var buttonWidth=21;
			var marginLeft=(this.pageWidth-20)/2-pageNumber*buttonWidth/2;
			navUl.css({marginLeft:marginLeft});
		}
	},
	
	setHoverFunctionality:function(){
		$('.portfolio_item').hover(function(){
			//$(this).css({backgroundColor:'#000000'});
			$(this).stop().animate({opacity:0.7});
		}, function(){
			$(this).stop().animate({opacity:1});
		});
	}
};
