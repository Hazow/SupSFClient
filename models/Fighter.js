function Fighter(canvas) {
    this.life = false;
    this.canvas = canvas;
    this.x=0;
    this.oldX=0;
    this.oldY=0;
    this.y=0;
    this.velY=0;
    this.moving=false;
    this.velX = 0;
    this.speed = 5;
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
    this.specialload = 0;
    this.isHurting = false;



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

                if(this.accel>10){
                    this.accel=10;
                }

                if(that.isAccel) {
                    return;
                }
                that.accel-=0.5;
                that.x+=that.accel;
            }else if(that.or=="left"){

                if(this.accel<-10){
                    this.accel=-10;
                }

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
        that.position="jump";

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
            that.position="";
        }
    };

    this.punch=function(){

        that.status = "punch"
        that.draw(that.or);
    };

    this.kick=function(){

        if(that.position=="crouch"){return;}
        that.status = "kick"
        that.draw(that.or);
    };

    this.kamehameha=function(){
        if(that.position=="crouch"){return;}

        that.status = "special";
        that.y = 380;
        if(that.specialload<15){
            that.specialload++;
        }

        that.draw(that.or);
    };

    this.protect=function(){

        that.status = "protect"
        that.draw(that.or);
    };

    this.crouch=function(){

        if(that.position!="" || that.status != "" || that.status == "special"){return;}
        this.accel = 0;
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

        var maincolor = "#d3d3d3";
        var eyescolor = "#e50000";

        var mainlinewidth = 12;

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

        if(that.x>that.canvas.width){
            that.x=1;
        }
        if(that.x<0){
            that.x=that.canvas.width;
        }



        context.lineWidth = mainlinewidth;
        context.beginPath();
        context.fillStyle = maincolor;
        context.arc(X, heightHead, 30, 0, Math.PI * 2, true); // draw circle for head

        context.fill();


        // eyes
        context.beginPath();
        context.fillStyle = eyescolor; // color
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
        context.strokeStyle = maincolor;
        context.moveTo(X, heightHead+30);
        context.lineTo(X, (heightHead+30)+100);
        context.stroke();

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
            context.stroke();
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
            context.stroke();
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
            context.stroke();
        }

        if(this.status=="special"){

            if(turn=="left"){

                context.moveTo(X, heightHead+30);
                context.lineTo(X-30, heightHead+30);

                context.moveTo(X-30, heightHead+30);
                context.lineTo(X-63, heightHead+30);

                context.moveTo(X-63, heightHead+30);
                context.lineTo(X-65, heightHead+18);


                context.moveTo(X, heightHead+30);
                context.lineTo(X-20, heightHead+70);

                context.moveTo(X-20, heightHead+70);
                context.lineTo(X-63, heightHead+35);

                context.moveTo(X-63, heightHead+35);
                context.lineTo(X-65, heightHead+47);
                context.stroke();


                context.beginPath();
                context.strokeStyle = 'rgba(40, 72, 232, 0.5)';
                context.fillStyle = 'rgba(40, 72, 232, '+that.specialload+')';
                context.lineWidth = 0;

                if(that.specialload>1 && that.specialload<15){
                    if(that.specialload<9){
                        context.arc(that.x-90, that.y+30, that.specialload*2, 0, Math.PI * 2, true);
                    }else{
                        context.arc(that.x-90, that.y+30, 8*2, 0, Math.PI * 2, true);
                    }

                    if(that.specialload>9){
                        context.lineWidth = 20;
                        context.moveTo(that.x-90, that.y+30);
                        context.lineTo(that.x-90*(that.specialload*that.specialload), that.y+30);
                    }
                }
                context.fill();
                context.stroke();

                context.beginPath();
                context.strokeStyle = maincolor;
                context.lineWidth = mainlinewidth;

            }

            if(turn=="right"){

                context.moveTo(X, heightHead+30);
                context.lineTo(X+30, heightHead+30);

                context.moveTo(X+30, heightHead+30);
                context.lineTo(X+63, heightHead+30);

                context.moveTo(X+63, heightHead+30);
                context.lineTo(X+65, heightHead+18);


                context.moveTo(X, heightHead+30);
                context.lineTo(X+20, heightHead+70);

                context.moveTo(X+20, heightHead+70);
                context.lineTo(X+63, heightHead+35);

                context.moveTo(X+63, heightHead+35);
                context.lineTo(X+65, heightHead+47);
                context.stroke();


                context.beginPath();
                context.strokeStyle = 'rgba(40, 72, 232, 0.5)';
                context.fillStyle = 'rgba(40, 72, 232, '+that.specialload+')';
                context.lineWidth = 0;
                if(that.specialload>1 && that.specialload<15){
                    if(that.specialload<9){
                        context.arc(that.x+90, that.y+30, that.specialload*2, 0, Math.PI * 2, true);
                    }else{
                        context.arc(that.x+90, that.y+30, 8*2, 0, Math.PI * 2, true);
                    }

                    if(that.specialload>9){
                        context.lineWidth = 20;
                        context.moveTo(that.x+90, that.y+30);
                        context.lineTo(that.x+90*(that.specialload*that.specialload), that.y+30);
                    }
                }
                context.fill();
                context.stroke();

                context.beginPath();
                context.strokeStyle = maincolor;
                context.lineWidth = mainlinewidth;
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
        if(turn=="right" && (this.position==""||this.position=="jump") && this.status!="kick"  && this.status!="special" ){


            if(this.frame==0){


                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+200);

                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+200);

                context.stroke();
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
                context.stroke();

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
                context.stroke();


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
                context.stroke();

            }
            if(this.frame<80 && this.frame>=60){
                this.frame = 0;
            }






        }
        if(turn=="left" && (this.position==""||this.position=="jump") && this.status!="kick" && this.status!="special" ){



            if(this.frame==0){


                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+200);
                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+200);
                context.stroke();



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
                context.stroke();

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
                context.stroke();


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
                context.stroke();

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
                context.stroke();

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
                context.stroke();

            }

        }

        if(this.status=="special"){

            if(turn=="left"){

                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+120);  // jambe gauche haut

                context.moveTo(X+50, heightHead+30+120);  // jambe gauche bas
                context.lineTo(X+63, heightHead+30+160);


                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+120);  // jambe gauche haut

                context.moveTo(X-50, heightHead+30+120);  // jambe gauche bas
                context.lineTo(X-63, heightHead+30+160);
                context.stroke();



            }
            if(turn=="right"){

                context.moveTo(X, heightHead+30+100);
                context.lineTo(X-50, heightHead+30+120);  // jambe gauche haut

                context.moveTo(X-50, heightHead+30+120);  // jambe gauche bas
                context.lineTo(X-63, heightHead+30+160);


                context.moveTo(X, heightHead+30+100);
                context.lineTo(X+50, heightHead+30+120);  // jambe gauche haut

                context.moveTo(X+50, heightHead+30+120);  // jambe gauche bas
                context.lineTo(X+63, heightHead+30+160);
                context.stroke();

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
                context.stroke();

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
                context.stroke();

            }

        }

        //cible

        context.moveTo(900, 50);
        context.lineTo(900, 500);
        context.moveTo(900, 500);
        context.lineTo(950, 500);
        context.moveTo(950, 50);
        context.lineTo(950, 500);

        context.stroke();


        context.lineCap = 'round';


        that.combat(context);


    };



    this.combat=function(context){

        // console.log("calcCombat");


        that.isCalculC = true;

        var minX= that.x+50;
        var maxX= that.x+50;

        var minY= that.y+30;
        var maxY= that.y+30+200;

        var colorYmax = "";
        var colorYmin = "";

        var gradient = context.createLinearGradient(100,0,100,100);
        gradient.addColorStop(0,"red");     // Départ
        gradient.addColorStop(0.5,"yellow"); // Intermédiaire
        gradient.addColorStop(1,"white");    // Arrivée



        switch (that.status){

            case "punch":
                if(that.or == "right"){maxX = that.x+130; minX = that.x+60;}
                else{maxX = that.x-60; minX = that.x-130;}

                maxY = minY = that.y+40;

                break;

            case "kick":
                if(that.or == "right"){maxX = that.x+110;minX =that.x+60;}
                else{maxX = that.x-60;minX =that.x-110;}

                maxY = minY = that.y+30+80;
                break;

            case "special":
                if(that.or == "right"){maxX = that.canvas.width;minX = that.x+200;}
                else{maxX = that.x-118; minX = 0;}

                maxY = minY = that.y+35;
                break;
        }






        //limit body 
        /*  context.beginPath();
         context.strokeStyle = 'rgba(255, 0, 255, 0.7)';
         context.moveTo(minX, minY);
         context.lineTo(maxX, maxY);
         */

        context.stroke(); // DESSINE




        if(that.or == "right"){
            for(var i = minX; i<maxX; i++){

                if(that.status == "" || that.isHurting || (that.status == "special" && that.specialload<10 || that.status == "special" && that.specialload>14)){return;}

                colorYmax = context.getImageData(i, maxY+7, 1, 1).data[1];

                //console.log(colorYmax);


                if(colorYmax!=0 || that.isHurting){

                    that.isHurting = true;

                    context.beginPath();
                    context.strokeStyle = 'rgba(255,0,0,0.7)';
                    context.fillStyle = '#ff0000';
                    context.lineWidth = 0;
                    context.arc(i, maxY, 15, 0, Math.PI * 2, true);
                    context.fill();
                    context.stroke();
                    break;
                }
            }
        }

        if(that.or == "left"){
            for(var i = maxX; i>minX; i--){

                if(that.status == "" || that.isHurting || (that.status == "special" && that.specialload<10 || that.status == "special" && that.specialload>14)){return;}

                colorYmax = context.getImageData(i, maxY+7, 1, 1).data[1];


                if(colorYmax!=0 || that.isHurting){

                    that.isHurting = true;

                    context.beginPath();
                    context.strokeStyle = 'rgba(255,0,0,0.7)';
                    context.fillStyle = '#ff0000';
                    context.lineWidth = 0;
                    context.arc(i, maxY, 15, 0, Math.PI * 2, true);
                    context.fill();
                    context.stroke();

                    break;
                }
            }
        }




    };


}
Fighter.prototype = new Drawable();