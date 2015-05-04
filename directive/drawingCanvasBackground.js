myApp.directive("drawingCanvasBackground", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var context = canvas.getContext('2d');

            var height = canvas.height;
            var width =canvas.width;

            console.log("Canvas height : "+height);
            console.log("Canvas width : "+width);

            var long=200;
            var larg=100;

            element.bind('mousemove', function(event){
                scope.$emit('changePos', event.offsetX+" - "+event.offsetY);
            });


        }
    };
});