myApp.directive("drawingCanvasUser", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            user.draw();
            console.log("endDraw");

            var doc = angular.element(document);
            doc.on('keydown', function(e) {
                console.log(e.keyCode);
                if(!user.moving){
                    if (e.keyCode === 68) {
                        user.right();
                    }else if(e.keyCode===81){
                        user.left();
                    }else if(e.keyCode===90){
                        user.jump();
                    }else if(e.keyCode===82){
                        user.punch();
                        setTimeout(user.draw("right"),1000);
                    }
                }
                /*else if(e.keyCode===113){
                    //user.left();
                }*/

            });

            /*element.bind('keyup', function(event){

                //console.log(event.keyCode);
                //if(event.keyCode==100){
                    user.right();
                //}
                //scope.$emit('changePos', event.offsetX+" - "+event.offsetY);
            });*/
        }
    };
});