myApp.directive("drawingCanvasOpponent", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            //user.draw();
            //console.log("endDraw");
            //user.go();
            scope.$emit('readyCanvasOpponentFighter', user);
        }
    };
});