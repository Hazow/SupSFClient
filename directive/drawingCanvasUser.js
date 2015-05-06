myApp.directive("drawingCanvasUser", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            //user.draw();
            console.log("endDraw");
            user.go();
            scope.$emit('readyCanvasMyFighter', user);

            setInterval(correctLatency,25);

            function correctLatency(){
                scope.$emit('correctLatency', user);
            }

            var doc = angular.element(document);
            doc.on('keypress', function(e) {

                console.log(e.keyCode);
                if(!user.moving){
                    if (e.keyCode === 100) {
                        user.isAccel = true;
                       /* user.accelerate("right");*/
                        user.or="right";
                        user.goAccel=true;
                        //scope.$emit('moving',"right");
                    }else if(e.keyCode===113){
                        user.isAccel = true;
                        user.or="left";
                        user.goAccel=true;
                        //scope.$emit('moving',"left");
                    }else if(e.keyCode===122){
                        //scope.$emit('changePos', user.isJumping);
                        if(!user.isJumping){
                            user.jump();
                        }

                    }else if(e.keyCode===114){
                        user.punch();
                    }else if(e.keyCode===115){
                        user.crouch();
                    }else if(e.keyCode===101){
                        user.protect();
                    
                    }else if(e.keyCode===102){
                        user.kick();
                    }

                }

            });

            doc.on('keyup', function(e) {

                user.isAccel = false;
                user.frame=0;

                console.log(e.keyCode);

                    if (e.keyCode === 68) {
                        user.goAccel=false;
                        //scope.$emit('stopMoving');
                    }else if(e.keyCode===81){
                        user.goAccel=false;
                        //scope.$emit('stopMoving',user.x);
                    }else if(e.keyCode===90){
                        //scope.$emit('changePos', user.isJumping);
                    }else if(e.keyCode===83){
                        user.standup();
                        user.position = "";
                   }else if(e.keyCode===82){
                        user.status = "";
                
                    }else if(e.keyCode===69){
                        user.status = "";
                    
                    }else if(e.keyCode===70){
                        user.status = "";
                    }

                    user.draw();

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