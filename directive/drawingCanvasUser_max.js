myApp.directive("drawingCanvasUser", function(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            var canvas = element[0];
            var user = new Fighter(canvas);
            user.draw();
            user.go();

            

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

                    }else if(e.keyCode===113){      // walk left
                        if(user.status == "special"){user.resetStatus();}
                        if((user.position == "crouch" || user.status != "")&& user.position!="jump"){
                            user.immobile();
                            return;
                        }

                       
                        user.goAccel=true; 
                        user.isAccel = true;
                        user.or="left";
                       
                    }else if(e.keyCode===122){      // begin jump
                        if(user.position==""){
                            user.jump();
                        }
                    }else if(e.keyCode===114){      // punch
                        user.punch();
                    }else if(e.keyCode===115){      // crouch

                        user.accel = 0;
                        user.crouch();
                    }else if(e.keyCode===101){      //block
                        user.protect();
                    
                    }else if(e.keyCode===102){      // kick
                        user.kick();

                    }else if(e.keyCode===99){       // special
                        user.kamehameha();
                    }

                }
                scope.$emit('changePos', 'position: '+user.position+' | status: '+user.status+' | XSpeed: '+user.accel+' | YSpeed: '+Math.round(user.velY)+' | isHurting: '+user.isHurting+'| isCalculC: '+user.isCalculC);
            });

            doc.on('keyup', function(e) {
               
                user.isAccel = false;
                user.frame=0;

                
              //  console.log(e.keyCode);

                    if (e.keyCode === 68) {     //end walk right
                        user.goAccel=false;
                    }else if(e.keyCode===81){   //end walk left
                        user.goAccel=false;

                    }else if(e.keyCode===90){   //end jump
                     
                        
                    }else if(e.keyCode===83){   //end crouch
                        
                        if(user.status !="special"){
                            user.standup();
                            user.position = "";
                        }
                        

                   }else if(e.keyCode===82){  //end punch
                        user.status = "";
                        user.isHurting = false;
                        user.resetCombat();
                
                    }else if(e.keyCode===69){   //end block

                        user.status = "";
                        user.isHurting = false;
                        
                    
                    }else if(e.keyCode===70){  //end kick
                        user.status = "";

                        user.isHurting = false;
                        user.resetCombat();

                    }else if(e.keyCode===67){   //end special

                        if(user.status == "special"){
                            user.resetStatus();
                            user.standup();
                            user.isHurting = false;
                            user.resetCombat();
                        }
                         user.specialload = 0;

                    }
                    
                    user.draw();
                    scope.$emit('changePos', 'position: '+user.position+' | status: '+user.status+' | XSpeed: '+user.accel+' | YSpeed: '+Math.round(user.velY)+' | isHurting: '+user.isHurting);
            });
        }
    };
});