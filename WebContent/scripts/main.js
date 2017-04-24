(function () {

/**
 * Variables
 */
var user_id       = '';
var user_fullname = '';
var lng           = -122.08;
var lat           = 37.38;

/**
 * Initialize
 */
function init() {
  // Register event listeners
  $('login-btn').addEventListener('click', login); 
  $('register-btn').addEventListener('click', register); 
  $('register-link').addEventListener('click', showRegister);
  $('login-link').addEventListener('click', showLogin);
  $('nearby-btn').addEventListener('click', loadNearbyRestaurants);
  $('fav-btn').addEventListener('click', loadFavoriteRestaurants);
  $('recommend-btn').addEventListener('click', loadRecommendedRestaurants);
  
  validateSession();
  //onSessionValid({user_id : '1111', name: 'John Smith'});
}

/**
 * Session
 */
function validateSession() {
  // The request parameters
  var url = './LoginServlet';
  var req = JSON.stringify({});
	  
  // display loading message
  showLoadingMessage('Validating session...');

  // make AJAX call
  ajax('GET', url, req,
    // session is still valid
    function (res) {
	  var result = JSON.parse(res);

	  if (result.status === 'OK') {
		onSessionValid(result);
	  }
    }
  );
}

function onSessionValid(result) {
  user_id = result.user_id;
  user_fullname = result.name;
	  
  var loginForm = $('login-form');
  var restaurantNav = $('restaurant-nav');
  var restaurantList = $('restaurant-list');
  var avatar = $('avatar');
  var welcomeMsg = $('welcome-msg');
  var logoutBtn = $('logout-link');
  var registerForm = $('register-form');
  
  welcomeMsg.innerHTML = 'Welcome, ' + user_fullname;

  showElement(restaurantNav);
  showElement(restaurantList);
  showElement(avatar);
  showElement(welcomeMsg);
  showElement(logoutBtn, 'inline-block');
  hideElement(loginForm);
  hideElement(registerForm);

  initGeoLocation();
}

function onSessionInvalid() {
  var loginForm = $('login-form');
  var restaurantNav = $('restaurant-nav');
  var restaurantList = $('restaurant-list');
  var avatar = $('avatar');
  var welcomeMsg = $('welcome-msg');
  var logoutBtn = $('logout-link');
  var registerForm = $('register-form');

  hideElement(restaurantNav);
  hideElement(restaurantList);
  hideElement(avatar);
  hideElement(logoutBtn);
  hideElement(welcomeMsg);
  hideElement(registerForm);
  showElement(loginForm);
}

function initGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onPositionUpdated, onLoadPositionFailed, {maximumAge: 60000});
	showLoadingMessage('Retrieving your location...');
  } else {
    onLoadPositionFailed();
  }
}

function onPositionUpdated(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;

  loadNearbyRestaurants();
}

function onLoadPositionFailed() {
  console.warn('navigator.geolocation is not available');
  //loadNearbyRestaurants();
  getLocationFromIP();
}

function getLocationFromIP() {
  // Get location from http://ipinfo.io/json
  var url = 'http://ipinfo.io/json'
  var req = null;
  ajax('GET', url, req,
    // session is still valid
    function (res) {
      var result = JSON.parse(res);
      if ('loc' in result) {
        var loc = result.loc.split(',');
        lat = loc[0];
        lng = loc[1];
      } else {
        console.warn('Getting location by IP failed.');
      }
      loadNearbyRestaurants();
    }
  );
}

//-----------------------------------
//  Login
//-----------------------------------
function showLogin(){
  clearRegisterError();
  var registerForm = $('register-form');
  hideElement(registerForm);
  var loginForm = $('login-form');
  showElement(loginForm);
}
function login() {
  clearLoginError();
  var username = $('username').value;
  var password = $('password').value;
  password = md5(username + md5(password));
  
  //The request parameters
  var url = './LoginServlet';
  var params = 'user_id=' + username + '&password=' + password;
  var req = JSON.stringify({});

  ajax('POST', url + '?' + params, req,
    // successful callback
    function (res) {
      var result = JSON.parse(res);
      
      // successfully logged in
      if (result.status === 'OK') {
    	onSessionValid(result);
      }
    },
    // error
    function () {
      showLoginError();
    }
  );
}

function showLoginError() {
    $('login-error').innerHTML = 'Invalid username or password';
}

function clearLoginError() {
	$('login-error').innerHTML = '';
}

  
//-----------------------------------
//  Register
//-----------------------------------
function showRegister() {
	clearLoginError();
  var loginForm = $('login-form');
  hideElement(loginForm);
  var registerForm = $('register-form');
  showElement(registerForm);
}
function register() {
	clearRegisterError();
  var username = $('usernamer').value;
  var passwordr = $('passwordr').value;
  var passwordConfirm = $('passwordc').value;
  if(username===''|| passwordr==='' || passwordr!==passwordConfirm){
    showRegisterError();
  }else{
    var fn = $('firstName').value;
    var ln = $('lastName').value;
    passwordr = md5(username + md5(passwordr));
    //The request parameters
    var checkUser = 'user_id=' + username;
    var params = 'user_id=' + username + '&password=' + passwordr+ '&fn=' + fn + '&ln=' + ln;
    var url = './RegisterServlet';
    var req = JSON.stringify({});
    ajax('GET', url+'?'+checkUser, req,
      // successful callback
      function (res) {
        var result = JSON.parse(res);    
        // username available
        if (result.status === 'OK') {
        	regiUser(url+'?'+params);
        }
      },
      // error
      function () {
        showRegisterError();
      }
    );
  }
}
function regiUser(url){
  var req = JSON.stringify({});
  ajax('POST', url , req,
    // successful callback
    function (res) {
      var result = JSON.parse(res);
      // successfully register
      if (result.status === 'OK') {
        showLogin();
      }
    }
  )
}
       
function showRegisterError() {
    $('register-error').innerHTML = 'Username in use or Password not valid!';
}

function clearRegisterError() {
	$('register-error').innerHTML = '';
}
// -----------------------------------
//  Helper Functions
// -----------------------------------

/**
 * A helper function that makes a navigation button active
 * 
 * @param btnId - The id of the navigation button
 */
function activeBtn(btnId) {
  var btns = document.getElementsByClassName('main-nav-btn');

  // deactivate all navigation buttons
  for (var i = 0; i < btns.length; i++) {
    btns[i].className = btns[i].className.replace(/\bactive\b/, '');
  }
  
  // active the one that has id = btnId
  var btn = $(btnId);
  btn.className += ' active';
}

function showLoadingMessage(msg) {
  var restaurantList = $('restaurant-list');
  restaurantList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> ' + msg + '</p>';
}

function showWarningMessage(msg) {
  var restaurantList = $('restaurant-list');
  restaurantList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> ' + msg + '</p>';
}

function showErrorMessage(msg) {
  var restaurantList = $('restaurant-list');
  restaurantList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> ' + msg + '</p>';
}

/**
 * A helper function that creates a DOM element <tag options...>
 * 
 * @param tag
 * @param options
 * @returns
 */
function $(tag, options) {
  if (!options) {
    return document.getElementById(tag);
  }

  var element = document.createElement(tag);

  for (var option in options) {
    if (options.hasOwnProperty(option)) {
      element[option] = options[option];
    }
  }

  return element;
}

function hideElement(element) {
  element.style.display = 'none';
}

function showElement(element, style) {
  var displayStyle = style ? style : 'block';
  element.style.display = displayStyle;
}

/**
 * AJAX helper
 * 
 * @param method - GET|POST|PUT|DELETE
 * @param url - API end point
 * @param callback - This the successful callback
 * @param errorHandler - This is the failed callback
 */
function ajax(method, url, data, callback, errorHandler) {
  var xhr = new XMLHttpRequest();

  xhr.open(method, url, true);

  xhr.onload = function () {
	switch (xhr.status) {
	  case 200:
		callback(xhr.responseText);
		break;
	  case 403:
		onSessionInvalid();
		break;
	  case 401:
		errorHandler();
		break;
	}
  };

  xhr.onerror = function () {
    console.error("The request couldn't be completed.");
    errorHandler();
  };

  if (data === null) {
    xhr.send();
  } else {
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(data);
  }
}

// -------------------------------------
//  AJAX call server-side APIs
// -------------------------------------

/**
 * API #1
 * Load the nearby restaurants
 * API end point: [GET] /Dashi/restaurants?user_id=1111&lat=37.38&lon=-122.08
 */
function loadNearbyRestaurants() {
  console.log('loadNearbyRestaurants');
  activeBtn('nearby-btn');

  // The request parameters
  var url = './restaurants';
  var params = 'user_id=' + user_id + '&lat=' + lat + '&lon=' + lng;
  var req = JSON.stringify({});
  
  // display loading message
  showLoadingMessage('Loading nearby restaurants...');
  
  // make AJAX call
  ajax('GET', url + '?' + params, req, 
    // successful callback
    function (res) {
      var restaurants = JSON.parse(res);
      if (!restaurants || restaurants.length === 0) {
        showWarningMessage('No nearby restaurant.');
      } else {
        listRestaurants(restaurants);
      }
    },
    // failed callback
    function () {
      showErrorMessage('Cannot load nearby restaurants.');
    }  
  );
}

/**
 * API #2
 * Load favorite (or visited) restaurants
 * API end point: [GET] /Dashi/history?user_id=1111
 */
function loadFavoriteRestaurants(event) {
  event.preventDefault();
  activeBtn('fav-btn');

  // The request parameters
  var url = './history';
  var params = 'user_id=' + user_id;
  var req = JSON.stringify({});
  
  // display loading message
  showLoadingMessage('Loading favorite restaurants...');

  // make AJAX call
  ajax('GET', url + '?' + params, req, 
    function (res) {
      var restaurants = JSON.parse(res);
      if (!restaurants || restaurants.length === 0) {
        showWarningMessage('No favorite restaurant.');
      } else {
        listRestaurants(restaurants);
      }
    },
    function () {
      showErrorMessage('Cannot load favorite restaurants.');
    }  
  );
}

/**
 * API #3
 * Load recommended restaurants
 * API end point: [GET] /Dashi/recommendation?user_id=1111
 */
function loadRecommendedRestaurants() {
  activeBtn('recommend-btn');

  // The request parameters
  var url = './recommendation';
  var params = 'user_id=' + user_id;
  var req = JSON.stringify({});
  
  // display loading message
  showLoadingMessage('Loading recommended restaurants...');

  // make AJAX call
  ajax('GET', url + '?' + params, req,
    // successful callback
    function (res) {
      var restaurants = JSON.parse(res);
      if (!restaurants || restaurants.length === 0) {
        showWarningMessage('No recommended restaurant. Make sure you have favorites.');
      } else {
        listRestaurants(restaurants);
      }
    },
    // failed callback
    function () {
      showErrorMessage('Cannot load recommended restaurants.');
    } 
  );
}

/**
 * API #4
 * Toggle favorite (or visited) restaurants
 * 
 * @param business_id - The restaurant business id
 * 
 * API end point: [POST]/[DELETE] /Dashi/history
 * request json data: { user_id: 1111, visited: [a_list_of_business_ids] }
 */
function changeFavoriteRestaurant(business_id) {
  // Check whether this restaurant has been visited or not
  var li = $('restaurant-' + business_id);
  var favIcon = $('fav-icon-' + business_id);
  var isVisited = li.dataset.visited !== 'true';
  
  // The request parameters
  var url = './history';
  var req = JSON.stringify({
    user_id: user_id,
    visited: [business_id]
  });
  var method = isVisited ? 'POST' : 'DELETE';

  ajax(method, url, req,
    // successful callback
    function (res) {
      var result = JSON.parse(res);
      if (result.status === 'OK') {
        li.dataset.visited = isVisited;
        favIcon.className = isVisited ? 'fa fa-heart' : 'fa fa-heart-o';
      }
    }
  );
}

function getSampleReview(review, business_id){
	  // The request parameters
	  var url = './comment';
	  var params = 'business_id=' + business_id;
	  var req = JSON.stringify({});
	  // make AJAX call
	  ajax('GET', url + '?' + params, req,
	    // successful callback
	    function (res) {
	      var comments = JSON.parse(res);
	      if (!comments || comments.length === 0) {
	    	  review.innerHTML = 'Be the first one to share your comment?';
	      } else {
	    	  review.innerHTML = TruncReview(comments[0].comment);
	      }
	    },
	    // failed callback
	    function () {
	      showErrorMessage('Cannot load comments.');
	    } 
	  );
}

function addAllReview(layout3, lessReview, business_id){
	  var url = './comment';
	  var params = 'business_id=' + business_id;
	  var req = JSON.stringify({});
	  // make AJAX call
	  ajax('GET', url + '?' + params, req,
	    // successful callback
	    function (res) {
	      var comments = JSON.parse(res);
	      layout3.innerHTML='';
	      if (!comments || comments.length === 0) {
    		  var item = $('li', {className: 'comment'});
	    	  var list = $('ul', {className: 'commentList'});
	    	  var sigComment = $('p', {className: 'commentBody'});
	    	  sigComment.innerHTML = 'No reviews available yet! Be the first one to share your comment?';
	    	  item.appendChild(sigComment);
	    	  list.appendChild(item);
	    	  layout3.appendChild(list);
	      } else {
	    	  var list = $('ul', {className: 'commentList'});
	    	  for (var i = 0; i < comments.length; i++) {
	    		  if(i>10){
	    			  break;
	    		  }
	    		  var item = $('li', {className: 'comment'});
	    		  var user = $('p', {className: 'commentUser'});
	    		  user.innerHTML = 'From ' + comments[i].user +':';
	    		  var sigComment = $('p', {className: 'commentBody'});
	    		  sigComment.innerHTML = comments[i].comment;
	    		  item.appendChild(user);
	    		  item.appendChild(sigComment);
	    		  list.appendChild(item);
	    	  }
	    	  layout3.appendChild(list);
	      }
	      layout3.appendChild(lessReview);
	    },
	    // failed callback
	    function () {
	      showErrorMessage('Cannot load comments.');
	    } 
	  );
}
function TruncReview(review){
	var revLen = review.length;
	if(revLen<87){
		return review;
	}else{
		list = review.split(" ");
		wordCount = list.length;
		var index = wordCount-1;
		while(revLen>82){
			revLen=revLen-list[index].length;
			index--;
		}
		return list.slice(0,index+1).join(' ')+'..."';
	}
}

function leaveComments(business_id, layout4){
	if(layout4.style.display==='block'){
		hideElement(layout4);
	}else{
		showElement(layout4);
	}
}

function submitComment(business_id,user_id,count){
	  clearCommentError(count);
	  //The request parameters
	  var url = './comment';
	  var toSubmit = $('newComment' + '-' + count).value;
	  if(toSubmit===''){
		  showCommentError(count);
	  }else{
		  var req = JSON.stringify({business_id: business_id, user_id: user_id, user: user_fullname, comment:toSubmit});
		  ajax('POST', url , req,
				  // successful callback
			function (res) {
			  var result = JSON.parse(res);
			  // successfully logged in
			  if (result.status === 'OK') {
				  showCommentResult(count);
			  }
		  	},
		  	// error
		  	function () {
		  		showCommentError(count);
		  	}
		  );
	  }
}

function showCommentError(count) {
    $('comment-msg' + '-' + count).innerHTML = 'Submission Error, please try again!';
}

function showCommentResult(count) {
    $('comment-msg' + '-' + count).innerHTML = 'Successful submission!';
}

function clearCommentError(count) {
    $('comment-msg' + '-' + count).innerHTML = '';
}
// -------------------------------------
//  Create restaurant list
// -------------------------------------

/**
 * List restaurants
 * 
 * @param restaurants - An array of restaurant JSON objects
 */
function listRestaurants(restaurants) {
	  // Clear the current results
	  var restaurantList = $('restaurant-list');
	  restaurantList.innerHTML = '';

	  for (var i = 0; i < restaurants.length; i++) {
	    addRestaurant(restaurantList, restaurants[i],i);
	  }
	}

/**
 * Add restaurant to the list
 * 
 * @param restaurantList - The <ul id="restaurant-list"> tag
 * @param restaurant - The restaurant data (JSON object)
 */
function addRestaurant(restaurantList, restaurant,count) {
  var business_id = restaurant.business_id;
  
  // create the <li> tag and specify the id and class attributes
  var li = $('li', {
    id: 'restaurant-' + business_id,
    className: 'restaurant'
  });
  
  // set the data attribute
  li.dataset.business = business_id;
  li.dataset.visited = restaurant.is_visited;
  var layout = $('div', {className: 'horiz-layout'});
  // restaurant image
  layout.appendChild($('img', {src: restaurant.image_url}));

  // section
  var section = $('div', {});
  
  // title
  var title = $('a', {href: restaurant.url, target: '_blank', className: 'restaurant-name'});
  title.innerHTML = restaurant.name;
  section.appendChild(title);
  
  // category
  var category = $('p', {className: 'restaurant-category'});
  category.innerHTML = 'Category: ' + restaurant.categories.join(', ');
  section.appendChild(category);
  
  // stars
  var stars = $('div', {className: 'stars'});
  for (var i = 0; i < restaurant.stars; i++) {
    var star = $('i', {className: 'fa fa-star'});
    stars.appendChild(star);
  }

  if (('' + restaurant.stars).match(/\.5$/)) {
    stars.appendChild($('i', {className: 'fa fa-star-half-o'}));
  }

  section.appendChild(stars);
  
  // comment counts
  var counts = $('p', {className: 'review-count'});
  counts.innerHTML = restaurant.review_count + ' Yelp reviews';
  section.appendChild(counts);

  layout.appendChild(section);

  // address
  var address = $('p', {className: 'restaurant-address'});
  
  address.innerHTML = restaurant.full_address.replace(/,/g, '<br/>');
  layout.appendChild(address);
  // favorite link
  var favLink = $('p', {className: 'fav-link'});
  
  favLink.onclick = function () {
    changeFavoriteRestaurant(business_id);
  };
  
  favLink.appendChild($('i', {
    id: 'fav-icon-' + business_id,
    className: restaurant.is_visited ? 'fa fa-heart' : 'fa fa-heart-o'
  }));
  
  layout.appendChild(favLink);
  
  //sample comment section
  var layout2 = $('div',{className: 'horiz-layout2', id:'layout2'+'-'+ count});
  //sample review
  var  review = $('p', {className: 'review'});
  getSampleReview(review,business_id);
  layout2.appendChild(review);
  //loadmore comments
  var moreReview = $('a', {className: 'loadMore'});
  moreReview.innerHTML = 'learn more';
  layout2.appendChild(moreReview);
  //all comments section(hide)
  var layout3 = $('div',{className: 'horiz-layout3', id:'layout3'+'-'+ count});
  var lessReview = $('a', {className: 'loadLess'});
  lessReview.innerHTML = 'learn less';
  addAllReview(layout3, lessReview, business_id);
  moreReview.onclick = function () {
	  hideElement(layout2);
	  addAllReview(layout3, lessReview, business_id);
	  showElement(layout3);
  };
  lessReview.onclick = function () {
	  hideElement(layout3);
	  review.innerHTML = '';
	  getSampleReview(review,business_id);
	  showElement(layout2,'flex');
  };
  
  // leave comment(hide)
  var layout4 = $('div',{className: 'horiz-layout4', id:'layout4'+'-'+ count});
  var leaveComLabel = $('div', {className: 'LeaveComment'});
  leaveComLabel.innerHTML = 'Leave Your Comment:';
  layout4.appendChild(leaveComLabel);
  var CommentInput = $('input', {className: 'newComment', id: 'newComment' + '-' + count});
  layout4.appendChild(CommentInput);
  var commentBtn = $('button', {className: 'comment-btn'});
  commentBtn.innerHTML = 'Submit';
  commentBtn.onclick = function () {
	  submitComment(business_id,user_id,count);
  };
  layout4.appendChild(commentBtn);
  var commentMsg = $('button', {className: 'comment-msg', id: 'comment-msg' + '-' + count});
  layout4.appendChild(commentMsg);
  
  //comment link
  var commentLink = $('p', {className: 'comment-link'});
  commentLink.onclick = function () {
	  leaveComments(business_id, layout4);
  };
  commentLink.appendChild($('i', {
	    className: 'fa fa-comments-o'}))
  layout.appendChild(commentLink);
  
  //share link
  var shareLink = $('p', {className: 'share-link'});
  shareLink.onclick = function () {
    //todo
  };
  shareLink.appendChild($('i', {
	    className: 'fa fa-facebook-square'}))
  layout.appendChild(shareLink);
  li.appendChild(layout);
  li.appendChild(layout2); 
  li.appendChild(layout3);
  li.appendChild(layout4);
  restaurantList.appendChild(li);
}

init();

})();

// END