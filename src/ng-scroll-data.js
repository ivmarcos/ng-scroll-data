// © Copyright 2015 Marcos Andrei Ivanechtchuk <ivmarcos@gmail.com>.  All Rights Reserved.

(function(){
	angular.module('ng-scroll-data',[]).directive('ngScrollData', function(){

		return {
			restrict: 'EA',
			link : function(scope, element, attrs){		
				
				//get the values passed in the view
				var lastPosition = undefined;
				var stepDown = parseInt(attrs.ngScrollStepDown);
				var stepUp = parseInt(attrs.ngScrollStepUp);
				var limit = scope.ngScrollLimit = parseInt(attrs.ngScrollLimit);
				var length = 0;
				scope.ngScrollBegin = 0;

				//bind the window scroll event
				$(window).scroll(function(e){
					var dh = $(document).height();
					var wh = $(window).height();
					var st = $(window).scrollTop();
					var scrollEvent = {e : e, dh : dh, wh : wh, st : st};
					onScroll(scrollEvent);
				});

				//listen the ctrl+end & ctrl+home keys to simulate then
				$(window).keydown(function(e){
					//end
					if (e.ctrlKey && e.keyCode == 35){
						lastPosition = undefined;
						scope.ngScrollBegin = length - limit;
						var dh = $(document).height();
						$(window).scrollTop(dh);
						scope.$apply();
					};
					//home
					if (e.ctrlKey && e.keyCode == 36){
						lastPosition = undefined;
						scope.ngScrollBegin = 0;
						var dh = $(document).height();
						var wh = $(window).height();
						$(window).scrollTop(dh-wh);
						scope.$apply();
					};
				});

				//scroll event
				function onScroll(e){
					var position = e.st + e.wh;
					var isBottom = position == e.dh;
					var isTop = position == e.wh;
					var isFirstPage = scope.ngScrollBegin == 0;
					var isLastPage = (length - limit) <= scope.ngScrollBegin;
					if (!lastPosition) lastPosition = position;
					var middlePosition = parseInt((e.dh - e.wh) / 2);
					var move = lastPosition == position ? 'stop' : position > lastPosition ? 'down' : 'up';

					//adding offset
					if (isBottom && move == 'down' && !isLastPage) {
						scope.ngScrollBegin = scope.ngScrollBegin + stepDown;
						lastPosition = undefined;
						$(window).scrollTop(middlePosition);
						scope.$apply();
						return;
					}
					//removing offset
					if (move == 'up' && !isFirstPage){
						scope.ngScrollBegin = scope.ngScrollBegin - stepUp;	
						if (scope.ngScrollBegin < 0) scope.ngScrollBegin = 0;	
						lastPosition = undefined;
						$(window).scrollTop(middlePosition);
						scope.$apply();
						return;
					}
					if ((isBottom && move == 'stop' && !isLastPage) || (isTop && move == 'stop' && !isFirstPage)){
						lastPosition = undefined;
						$(window).scrollTop(middlePosition);
						return;
					}				
					lastPosition = position;
				};			
			
				//unbind functions
				var destroy = function(){		
					$(window).unbind('scroll');
					$(window).unbind('keydown');
				};

				element.on('$destroy', destroy);
				scope.$on('$destroy', destroy);

				//update the length value
				scope.$watch(attrs.ngScrollData, function(){
					length = scope.$eval(attrs.ngScrollItems).length;
				});

			},
		}
	
	}).filter('ngScrollPaginator', function() {
	  return function(input, limit, begin) {
	    if (Math.abs(Number(limit)) === Infinity) {
	      limit = Number(limit);
	    } else {
	      limit = parseInt(limit);
	    }
	    if (isNaN(limit)) return input;

	    if (angular.isNumber(input)) input = input.toString();
	    if (!angular.isArray(input) && !isString(input)) return input;

	    begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
	    begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;

	    if (limit >= 0) {
	      return input.slice(begin, begin + limit);
	    } else {
	      if (begin === 0) {
		return input.slice(limit, input.length);
	      } else {
		return input.slice(Math.max(0, begin + limit), begin);
	      }
	    }
	  };
	});
}());
