function Fighter(canvas) {
    this.life = false;
    this.canvas = canvas;
    this.x=0;
    this.oldX=0;
    this.oldY=0;
    this.y=0;
    this.velY=0;
    this.moving=false;
    this.velX = 0,
    this.speed = 5,
    this.friction = 0.98;
    this.stop=false;
    var that=this;
    this.or="right";
    this.accel=0;
    this.isAccel = false;
    this.goAccel =false;
    this.goDesc = false;
    this.isJumping=false;

    // ---- 
    this.frame = 0;
    this.position = "";  // crouch, "", jump
    this.status = "";  // punch, "", kick, special, protect



    this.go=function(){
        if(that.goAccel){
            that.accelerate(that.or);
        }else{
            that.descelerate();
        }
        setTimeout(that.go,1);
    };

    this.accelerate=function(or){
        if(or=="right"){
            that.or="right";
            if(this.accel<10){

                if(this.accel<0){
                    this.accel = -this.accel;
                }
                this.accel+=0.5;
            }
            this.x+=this.accel;
        }else if(or="left"){
            that.or="left";
            if(this.accel>-10){
                if(this.accel>0){
                    this.accel = -this.accel;
                }
                this.accel-=0.5;
            }
            this.x+=this.accel;
        }
        this.frame++;
        this.draw(or);
    };

    this.descelerate=function(){
        if(that.accel!=0){
            if(that.or=="right"){
                if(that.isAccel) {
                    return;
                }
                that.accel-=0.5;
                that.x+=that.accel;
            }else if(that.or=="left"){

                if(that.isAccel){
                    return;
                }
                that.accel+=0.5;
                that.x+=that.accel;
            }

            that.draw(that.or);
            setTimeout(that.descelerate,20);
        }
    };

    this.jump = function(){
        that.isJumping=true;

        that.velY = 0.981 * -(that.y/10);
        that.y += that.velY;

        that.draw(that.or);

        if((that.y-that.oldY)>-300){
            setTimeout(that.jump,5);
        }else{
            that.oldY=that.y;
            that.jumpDown();

        }


    };

    this.jumpDown=function(){
        that.velY = 0.981 * - (that.y/10);
        that.y -= that.velY;
        if((that.y-that.oldY)>300){
            that.y=300 + that.oldY;
        }

        that.draw(that.or);
        if((that.y-that.oldY)<300) {
            setTimeout(that.jumpDown, 1);
        }else{
            that.oldY=that.y;
            that.isJumping=false;
        }
    };

    this.punch=function(){

        that.status = "punch"
        that.draw(that.or);
    };

    this.kick=function(){

        that.status = "kick"
        that.draw(that.or);
    };

    this.protect=function(){

        that.status = "protect"
        that.draw(that.or);
    };

    this.crouch=function(){

        that.position = "crouch";
        that.y = 440;
        that.draw(that.or);
    };

    this.standup=function(){
        that.y = 340;
    };


    this.draw = function(turn,opp) {
        if(turn){
            that.or=turn;
        }else{
            turn=that.or;
        }
        var context = that.canvas.getContext('2d');
        var height = that.canvas.height;
        var width = that.canvas.width;

        context.clearRect(0,0,that.canvas.width,that.canvas.height);
       // console.log("Canvas height : "+height);
       // console.log("Canvas width : "+width);

        var long=200;
        var larg=100;

        if(that.y==0){
            var heightHead=(height-long)-50;
            that.y=(height-long)-50;
            that.oldY=(height-long)-50;
        }else{
            var heightHead=that.y;
        }
        console.log("X : "+this.x+", opp : "+opp);
        if(this.x==0){
            if(opp){
                var X=width - 100;
            }else{
                var X=100;
            }
            that.x=X;
            that.oldX=X;
        }else{
            var X=that.x;
        }

        //console.log(this.frame);

        context.lineWidth = 5;
        context.beginPath();
        context.fillStyle = "#000";
        context.arc(X, heightHead, 30, 0, Math.PI * 2, true); // draw circle for head
        
        context.fill();


        // eyes
        context.beginPath();
        context.fillStyle = "red"; // color
        if(turn=="right"){
            context.arc(X+10, heightHead, 3, 0, Math.PI * 2, true); // draw left eye
            context.fill();
            context.arc(X+20, heightHead, 3, 0, Math.PI * 2, true); // draw right eye
            context.fill();
        }else if(turn=="left"){
            context.arc(X-10, heightHead, 3, 0, Math.PI * 2, true); // draw left eye
            context.fill();
            context.arc(X-20, heightHead, 3, 0, Math.PI * 2, true); // draw right eye
            context.fill();
        }else{
            context.arc(X+10, heightHead, 3, 0, Math.PI * 2, true); // draw left eye
            context.fill();
            context.arc(X+20, heightHead, 3, 0, Math.PI * 2, true); // draw right eye
            context.fill();
        }




        // body
        context.beginPath();
        context.moveTo(X, heightHead+30);
        context.lineTo(X, (heightHead+30)+100);

        // ARMS
        if(this.status==""){
            if(turn=="right"){
    
                context.moveTo(X, heightHead+30);
                context.lineTo(X-40, heightHead+50);
                context.moveTo(X-40, heightHead+48);
                context.lineTo(X-30, heightHead+100);
                context.moveTo(X, heightHead+30);
                context.lineTo(X+10, heightHead+100);
                context.moveTo(X+8, heightHead+100);
                context.lineTo(X+50, heightHead+60);
    
            }
    
            if(turn=="left"){
                context.moveTo(X, heightHead+30);
                context.lineTo(X+40, heightHead+50);
                context.moveTo(X+40, heightHead+48);
                context.lineTo(X+30, heightHead+100);
                context.moveTo(X, heightHead+30);
                context.lineTo(X-10, heightHead+100);
                context.moveTo(X-8, heightHead+100);
                context.lineTo(X-50, heightHead+60);
            }
        }
        if(this.status=="punch"){
                
                if(turn=="left"){

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X+60, heightHead+35);

                    context.moveTo(X+60, heightHead+35);
                    context.lineTo(X+20, heightHead+60);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-60, heightHead+40);

                    context.moveTo(X-60, heightHead+40);
                    context.lineTo(X-130, heightHead+40);

                    

                }
                if(turn=="right"){

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-60, heightHead+35);

                    context.moveTo(X-60, heightHead+35);
                    context.lineTo(X-20, heightHead+60);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X+60, heightHead+40);

                    context.moveTo(X+60, heightHead+40);
                    context.lineTo(X+130, heightHead+40);
                    

                }
        }

         if(this.status=="kick"){
                
                if(turn=="left"){
                     context.moveTo(X, heightHead+30);
                    context.lineTo(X+20, heightHead+100);

                    context.moveTo(X+20, heightHead+100);
                    context.lineTo(X-30, heightHead+80);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-20, heightHead+70);

                    context.moveTo(X-20, heightHead+70);
                    context.lineTo(X-50, heightHead+20);

                }
                if(turn=="right"){

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-20, heightHead+100);

                    context.moveTo(X-20, heightHead+100);
                    context.lineTo(X+30, heightHead+80);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X+20, heightHead+70);

                    context.moveTo(X+20, heightHead+70);
                    context.lineTo(X+50, heightHead+20);
                }
        }

        if(this.status=="protect"){
                
                if(turn=="left"){

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-20, heightHead+100);

                    context.moveTo(X-20, heightHead+100);
                    context.lineTo(X-60, heightHead+60);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X-60, heightHead+35);

                    context.moveTo(X-60, heightHead+35);
                    context.lineTo(X-60, heightHead-20);
                   

                    

                }
                if(turn=="right"){

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X+20, heightHead+100);

                    context.moveTo(X+20, heightHead+100);
                    context.lineTo(X+60, heightHead+60);

                    context.moveTo(X, heightHead+30);
                    context.lineTo(X+60, heightHead+35);

                    context.moveTo(X+60, heightHead+35);
                    context.lineTo(X+60, heightHead-20);
                    

                }
        }






        // LEGS
        if(turn=="right" && this.position=="" && this.status!="kick"){

            
            if(this.frame==0){
                
              
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+200);
                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+200);

            
            }

            if(this.frame<20 && this.frame>0){


                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-40, heightHead+30+150);    // jambe droite haut

                context.moveTo(X-40, heightHead+30+150);    // jambe droite bas
                context.lineTo(X-80, heightHead+30+150);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+100);  // jambe gauche haut

                context.moveTo(X+50, heightHead+30+100);  // jambe gauche bas
                context.lineTo(X+50, heightHead+30+175);
              

            }
            if(this.frame<40 && this.frame>=20){

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-10, heightHead+30+150);

                context.moveTo(X-10, heightHead+30+150);
                context.lineTo(X-50, heightHead+30+130);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+25, heightHead+30+150);
                context.moveTo(X+25, heightHead+30+150);
                context.lineTo(X+25, heightHead+30+200);
             
                

            }
             if(this.frame<60 && this.frame>=40){
                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+125);

                context.moveTo(X+50, heightHead+30+125);
                context.lineTo(X+30, heightHead+30+150);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+5, heightHead+30+150);
                context.moveTo(X+5, heightHead+30+150);
                context.lineTo(X-10, heightHead+30+200);
             
            }
            if(this.frame<80 && this.frame>=60){
                this.frame = 0;
            }
            
             
           

            

        }
        if(turn=="left" && this.position=="" && this.status!="kick"){



            if(this.frame==0){
                
              
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+200);
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+200);
 

                

            }

            if(this.frame<20 && this.frame>0){

                // legs
                

                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+40, heightHead+30+150);    // jambe droite haut

                context.moveTo(X+40, heightHead+30+150);    // jambe droite bas
                context.lineTo(X+80, heightHead+30+150);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+100);  // jambe gauche haut

                context.moveTo(X-50, heightHead+30+100);  // jambe gauche bas
                context.lineTo(X-50, heightHead+30+175);
                

            }
            if(this.frame<40 && this.frame>=20){

    
                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+10, heightHead+30+150);

                context.moveTo(X+10, heightHead+30+150);
                context.lineTo(X+50, heightHead+30+130);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-25, heightHead+30+150);
                context.moveTo(X-25, heightHead+30+150);
                context.lineTo(X-25, heightHead+30+200);
           
                

            }
             if(this.frame<60 && this.frame>=40){

                
                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+125);

                context.moveTo(X-50, heightHead+30+125);
                context.lineTo(X-30, heightHead+30+150);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-5, heightHead+30+150);
                context.moveTo(X-5, heightHead+30+150);
                context.lineTo(X+10, heightHead+30+200);
                
            }
            if(this.frame<80 && this.frame>=60){
                this.frame = 0;
            }



        }

        if(this.position=="crouch"){
                
                if(turn=="left"){

                    context.moveTo(X, heightHead+30+100);
                    context.lineTo(X+40, heightHead+30+115);    // jambe droite haut
    
                    context.moveTo(X+40, heightHead+30+115);    // jambe droite bas
                    context.lineTo(X+80, heightHead+30+115);
    
                    
                    context.moveTo(X, heightHead+30+100);
                    context.lineTo(X-50, heightHead+30+70);  // jambe gauche haut
    
                    context.moveTo(X-50, heightHead+30+70);  // jambe gauche bas
                    context.lineTo(X-50, heightHead+30+115);

                }
                if(turn=="right"){

                    context.moveTo(X, heightHead+30+100);
                    context.lineTo(X-40, heightHead+30+115);    // jambe droite haut
    
                    context.moveTo(X-40, heightHead+30+115);    // jambe droite bas
                    context.lineTo(X-80, heightHead+30+115);
    
                    
                    context.moveTo(X, heightHead+30+100);
                    context.lineTo(X+50, heightHead+30+70);  // jambe gauche haut
    
                    context.moveTo(X+50, heightHead+30+70);  // jambe gauche bas
                    context.lineTo(X+50, heightHead+30+115);

                }
                
        }

        if(this.status=="kick"){
                
                if(turn=="left"){

                   context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+80);

                context.moveTo(X-50, heightHead+30+80);
                context.lineTo(X-110, heightHead+30+80);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-8, heightHead+30+150);
                context.moveTo(X-8, heightHead+30+150);
                context.lineTo(X, heightHead+30+200);

                }
                if(turn=="right"){

                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+80);

                context.moveTo(X+50, heightHead+30+80);
                context.lineTo(X+110, heightHead+30+80);

                
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+8, heightHead+30+150);
                context.moveTo(X+8, heightHead+30+150);
                context.lineTo(X, heightHead+30+200);

                }
                
        }

        

        context.stroke(); // DESSINE


    };


}
Fighter.prototype = new Drawable();