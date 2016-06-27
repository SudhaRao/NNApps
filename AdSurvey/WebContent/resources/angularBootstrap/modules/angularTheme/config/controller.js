/*
Copyright 2014  IBM Corp. 
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0 

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
//
// controller.js - main angular theme controller
//
// This file contains all theme related angular artifacts needed for this demo theme.
// It handles navigation including the megamenu, megamenu helper functions as well as
// partial page refresh logic which avoids a full page refresh under certain circumstances
//
(function() {
	var themeApp = angular.module('themeApp', []);

	// the factory creates the data model that the various controllers require to work
    themeApp.factory('themeData', function($window, $q, $http) {
    	var ret = {
    		// themeResources is used to load additional html files from WebDAV through ng-include (See theme.html)
			themeResources: $window.ibmCfg.themeConfig.themeRootURI+"/",
			// text is used across all html templates to display localized data
			text: $window.themeLocalization,
			// data contains all sorts of data required for the theme
			data: $window.initData,
			// current represents the currently selected page and contains the id; theme and profile are added later
			current: {
				id: $window.ibmCfg.portalConfig.currentPageOID
			}
		};
		//
		// Helper function, that splits the children into 4 columns for display purposes in the megamenu
		//
		var getMegaMenu = function(node) {
			for (var columns = [[],[],[],[]], cCount = 0, i = 0; i < node.children.length; i++) {
				columns[cCount++].push(node.children[i]);
				if (cCount > 3) cCount = 0;
			}
			return columns;
		};
		//
		// loads the navigation asynchonously and do some post-processing
		//
		ret.loadNavigation = function(parentID) {
			var deferred = $q.defer();
			// for editing usecases we need to attach a randomizer otherwise the feed won't create a page that was just created
			var random = wpModules.toolbar.isToolbarOpened()?"&random="+Math.floor(Math.random() * 10000000):"";
			$http.get(ret.data.navUrl+"?parentID="+parentID+"&showHidden="+ret.data.showHiddenPages+random).success(function(data) {
				var result = {
					navData: data
				}, children = data.children;
				// in order to display the megamenu in the navigation.html, we are changing the datamodel slightly and store this as a megamenu attribute
				for (var i = 0; i < children.length; i++) {
					if (children[i].children.length>0) {
						children[i].megaMenu = getMegaMenu(children[i]);
					}
				};
				// create a map by id for lookup purposes
				// and a parent map for breadcrumb handling
				var m = result.navMap = {}, p = result.navParentMap = {};
				function process(parent) {
					var c = parent.children;
					for (var i = 0; i < c.length; i++) {
						var n = c[i];
						m[n.id] = n;
						p[n.id] = parent.id;
						if (n.children.length>0) {
							process(n);
						}
					};
				}
				process(result.navData);
				// inject current theme id and current profile ref
				result.themeID = m[ret.current.id].themeID;
				result.profileRef = m[ret.current.id].profileRef;
				// resolve the deferred object
				deferred.resolve(result);
		    }).error(function(data) {
		    	alert("ERROR RETRIEVING NAVIGATION DATA\n\nPlease check your server logs to analyze the error.\nIn many cases the exception is happening because the backend server doesn't have CumFix Level 03. Please verify that you are on the latest cumulative fixpack.");
		    	deferred.reject(data);
		    });
		    return deferred.promise;
		}
    	return ret;
    });
	//
	// main theme controller which sets up the scope objects
	//
	themeApp.controller('themeCtrl', function($scope, $rootScope, themeData) {
		$scope.themeResources = themeData.themeResources;
		$scope.text = themeData.text;
		$scope.data = themeData.data;
		$scope.current = themeData.current;
		$scope.navigate = function(nodeId) {
			$rootScope.$emit('navigate', nodeId);
		}
	});
	//
	// navigation controller
	//
	themeApp.controller('navCtrl', function($scope, $rootScope, $http, $window, $location, $compile, themeData) {
		//
		// initialize controller, load navigation and set internal scope with retrieved data
		//
		init = function() {
			themeData.loadNavigation(themeData.data.selectionPath[1].id).then(function(result) {
				$scope.navData = result.navData;
				$scope.navMap = result.navMap;
				$scope.navParentMap = result.navParentMap;
				$scope.current.themeID = result.themeID;
				$scope.current.profileRef = result.profileRef;
			});
			$rootScope.$on('navigate', function(event, nodeId) {
				$scope.navigate(nodeId);
			});
		}
		//
		// Helper method for html templates to check whether the page id is part of the selection path
		//
		$scope.isInSelectionPath = function(id) {
			for (var i = $scope.data.selectionPath.length - 1; i >= 0; i--) {
				var node = $scope.data.selectionPath[i];
				if (node.id==id) {
					return true;
				}
			}
			return false;
		}
		//
		// Helper method for html templates to check the page has children
		//
		$scope.hasChildren = function(node) {
			return node.children.length>0;
		}
		//
		// Helper method for html templates to navigate to the given node id
		//
		$scope.navigate = function(nodeId) {
			var node = $scope.navMap[nodeId];
			// This if verifies if we need to do a full page refresh or if we are in a situation that allows a partial page refresh
			// In case of different themes, different profiles or if the toolbar is opened, a full page refresh is performed
			if ($scope.current.themeID!=node.themeID ||
				$scope.current.profileRef!=node.profileRef ||
				wpModules.toolbar.isToolbarOpened() ||
				$window.history.replaceState==null)
			{
				$window.location.href = node.link; // perform full page refresh
			}
			else {
				partialPageRefresh(node);
			}
		}
		//
		// Method that performs a partial page refresh
		//
		partialPageRefresh = function(node) {
			// (1) close megamenu
			$.proxy(closeMegaMenu, $('.dropdown.open'))();

			// (2) load page content
			if (node.contentLink) {
				$http.get(node.contentLink).then(function (msg) {
					// we check for external javascript in the markup. If there are any then we still do a full page refresh
					// and display a message as this must be handled through modules and loaded up front
					var scripts = $(msg.data).find( 'script[src$=".js"]' );
					if ( scripts.length > 0 ) {
						console.log("*********** IMPORTANT NOTICE **********\n\nThe demo theme detected that the markup retrieved for this page contains script references. In a partial page refresh scenario jQuery loads those scripts in a different manner compared to a full page refresh scenario.\n\nIn order to support this scenario the application developer either needs to take special precautions within the application or the javascript needs to be loaded upfront.\n\nThis demo theme will perform a full page refresh now to keep all applications functional.\n\n*********** IMPORTANT NOTICE **********");
						$window.location.href = node.link; // perform full page refresh
						return;
					}

					// (5) replace page markup
				    $('#ng-view').html(msg.data);
				    
					// (6) switch page url
					$window.setTimeout(function() {
						// we need to do this with a timeout, otherwise the browser doesn't accept it.
						// This is due to the fact that angular itself is also manipulating the url.
						// We are not using the html5 mode from angular here because it requires setting a base ref
			            var url = $window.location.href;
			            if (url.indexOf("#") != -1) { url = url.substring(0,url.indexOf("#")); }
			            if (url.indexOf("?") < 0) { url += node.link;} 
			            else { url += "&"+node.link.substring(1); }
			            $window.history.replaceState(url, null, url);
					},100);
				});
			}

			// (3) set page title
			document.title = node.title.value;

			// (4) update breadcrumb data
			var newSP = [node], m = $scope.navMap, p = $scope.navParentMap, n = node;
			while (n!=null && p[n.id]!=null) {
				n = m[p[n.id]];
				if (n) newSP.unshift(n);
			}
			// merge original part of the breadcrumb, we know we just need the first 2 levels here, so we can hardcode it
			newSP.unshift($scope.data.selectionPath[1]);
			newSP.unshift($scope.data.selectionPath[0]);
			$scope.data.selectionPath = newSP;
		}
		init();
	});

	//
	// Megamenu helper functions
	//
	var blockHover, openMegaMenu = function() { 
    	if (!blockHover) {
    		var that = this;
    		$('.dropdown-menu', that).stop().fadeIn("fast", function() {
    			$(that).addClass("open");
    		});
    	}
    }, closeMegaMenu = function() { 
    	if (!blockHover) {
        	var that = this; 
    		$('.dropdown-menu', that).stop().fadeOut("fast", function() { 
    			$('.dropdown-menu', that).attr("style", ""); 
    			$(that).removeClass("open");
    		});
    	}
	};
	themeApp.directive("dropDownHover", function() {
	  	return {
	    	restrict: 'A',
	        link: function (scope, elm, attr) {
				blockHover = ($(".navbar-toggle").css("display") == "block"); // blocking for push down navigation
			    $(elm).hover(openMegaMenu, closeMegaMenu);
				$(window).resize(function(){
					blockHover = ($(".navbar-toggle").css("display") == "block");
				});
	        }
	  	};
	});

	//
	// Bootstrap this application.
	// This theme supports Angular Apps as Portlets and therefore doesn't take over the
	// full DOM and because of that cannot use ng-app either. There is only one ng-app
	// attribute allowed within one html page.
	//
	$(".attachAngularTheme").each(function() {
		angular.bootstrap(this, ['themeApp']);
	})
})();