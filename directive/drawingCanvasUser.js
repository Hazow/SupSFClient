myApp.directive("drawingCanvasUser", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            //user.draw();
            user.go();
            scope.$emit('readyCanvasMyFighter', user);


            var doc = angular.element(document);
            doc.on('keypress', function(e) {

                //console.log(e.keyCode);
                if(!user.moving){
                    if (e.keyCode === 100) {        // walk right

                        if(user.status == "special"){user.resetStatus();}

                        if((user.position == "crouch" || user.status != "")&& user.position!="jump"){
                            user.immobile();
                            return;
                        }


                        user.goAccel=true;
                        user.isAccel = true;
                        user.or="right";

                        scope.$emit('event', "right");
                    }else if(e.keyCode===113){      // walk left
                        if(user.status == "special"){user.resetStatus();}
                        if((user.position == "crouch" || user.status != "")&& user.position!="jump"){
                            user.immobile();
                            return;
                        }


                        user.goAccel=true;
                        user.isAccel = true;
                        user.or="left";
                        scope.$emit('event', "left");
                    }else if(e.keyCode===122){      // begin jump
                        if(user.position==""){
                            user.jump();
                            scope.$emit('event', "jump");
                        }
                    }else if(e.keyCode===114){      // punch
                        user.punch();
                        scope.$emit('event', "punch");
                    }else if(e.keyCode===115){      // crouch

                        user.accel = 0;
                        user.crouch();
                        scope.$emit('event', "crouch");
                    }else if(e.keyCode===101){      //block
                        user.protect();
                        scope.$emit('event', "protect");
                    }else if(e.keyCode===102){      // kick
                        user.kick();
                        scope.$emit('event', "kick");
                    }else if(e.keyCode===99){       // special
                        user.kamehameha();
                        scope.$emit('event', "kamehameha");
                    }

                }
                scope.$emit('changePos', 'position: '+user.position+' | status: '+user.status+' | XSpeed: '+user.accel+' | YSpeed: '+Math.round(user.velY)+' | isHurting: '+user.isHurting+'| isCalculC: '+user.isCalculC);
            });

            doc.on('keyup', function(e) {

                user.isAccel = false;
                user.frame=0;

                //console.log(e.keyCode);

                if (e.keyCode === 68) {     //end walk right
                    user.goAccel=false;
                    scope.$emit('event', "stop");
                }else if(e.keyCode===81){   //end walk left
                    user.goAccel=false;
                    scope.$emit('event', "stop");
                }else if(e.keyCode===90){   //end jump

                }else if(e.keyCode===83){   //end crouch
                    if(user.status !="special"){
                        scope.$emit('event', "endCrouch");
                        user.standup();
                        user.position = "";
                    }
                }else if(e.keyCode===82){  //end punch
                    scope.$emit('event', "endStatus");
                    user.status = "";
                    user.isHurting = false;
                    user.resetCombat();
                }else if(e.keyCode===69){   //end protect
                    scope.$emit('event', "endStatus");
                    user.isProtecting=false;
                    user.status = "";
                    user.isHurting = false;
                }else if(e.keyCode===70){  //end kick
                    scope.$emit('event', "endStatus");
                    user.status = "";
                    user.isHurting = false;
                    user.resetCombat();
                }else if(e.keyCode===67){   //end special

                    if(user.status == "special"){
                        scope.$emit('event', "endSpecial");
                        user.resetStatus();
                        user.standup();
                        user.isHurting = false;
                        user.resetCombat();
                    }
                    user.specialload = 0;
                }

                user.draw();
                scope.$emit('correctLatency', user);
                scope.$emit('changePos', 'position: '+user.position+' | status: '+user.status+' | XSpeed: '+user.accel+' | YSpeed: '+Math.round(user.velY)+' | isHurting: '+user.isHurting);
            });
        }
    };
});