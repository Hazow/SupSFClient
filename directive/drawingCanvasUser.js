myApp.directive("drawingCanvasUser", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            user.draw();
            console.log("endDraw");
            user.go();

            var doc = angular.element(document);
            doc.on('keypress', function(e) {

                console.log(e.keyCode);
                if(!user.moving){
                    if (e.keyCode === 100) {
                        user.isAccel = true;
                       /* user.accelerate("right");*/
                        user.or="right";
                        user.goAccel=true;
                    }else if(e.keyCode===113){
                        user.isAccel = true;
                        user.or="left";
                        user.goAccel=true;
                    }else if(e.keyCode===122){
                        scope.$emit('changePos', user.isJumping);
                        if(!user.isJumping){
                            user.jump();
                        }

                    }else if(e.keyCode===82){
                        user.punch();
                    }else{

                    }
                }
            });

            doc.on('keyup', function(e) {

                user.isAccel = false;

                console.log(e.keyCode);

                    if (e.keyCode === 68) {
                        user.goAccel=false;
                    }else if(e.keyCode===81){
                        user.goAccel=false;
                    }else if(e.keyCode===90){
                        scope.$emit('changePos', user.isJumping);
                    }else if(e.keyCode===82){

                    }else{

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