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

        turn=this.or;
        var context = this.canvas.getContext('2d');
        var height = this.canvas.height;
        var width = this.canvas.width;

        context.clearRect(0,0,this.canvas.width,this.canvas.height);

        console.log("Canvas height : "+height);
        console.log("Canvas width : "+width);

        var long=200;
        var larg=100;

        if(this.y==0){
            var heightHead=(height-long)-50;
            this.y=(height-long)-50;
            this.oldY=(height-long)-50;
        }else{
            var heightHead=this.y;
        }
        if(this.x==0){
            var X=100;
            this.x=X=100;
            this.oldX=X=100;
        }else{
            var X=this.x;
        }

        context.lineWidth = 5;
        context.beginPath();
        context.fillStyle = "#000";
        context.arc(X, heightHead, 30, 0, Math.PI * 2, true); // draw circle for head
        // (x,y) center, radius, start angle, end angle, anticlockwise
        context.fill();

        /*context.beginPath();
         context.strokeStyle = "red"; // color
         context.lineWidth = 3;
         context.arc(200, 50, 20, 0, Math.PI, false); // draw semicircle for smiling
         context.stroke();*/

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
        context.strokeStyle = "#000";
        context.stroke();

        // arms
        context.beginPath();
        context.strokeStyle = "#000"; // blue
        context.moveTo(X, heightHead+30);
        if(turn=="right"){
            context.lineTo(X-40, heightHead+50);
            context.moveTo(X-40, heightHead+48);
            context.lineTo(X-30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X+200, heightHead+30);
            /*context.moveTo(X+8, heightHead+100);
             context.lineTo(X+200, heightHead+60);*/
            context.fillStyle = "#000";
            context.fillRect(X+100, (heightHead+30)-50, 100, 100);
        }else if(turn=="left"){
            context.lineTo(X+40, heightHead+50);
            context.moveTo(X+40, heightHead+48);
            context.lineTo(X+30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X-200, heightHead+30);
            /*context.moveTo(X+8, heightHead+100);
             context.lineTo(X+200, heightHead+60);*/
            context.fillStyle = "#000";
            context.fillRect(X-200, (heightHead+30)-50, 100, 100);
        }else{
            context.lineTo(X-40, heightHead+50);
            context.moveTo(X-40, heightHead+48);
            context.lineTo(X-30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X+10, heightHead+100);
            context.moveTo(X+8, heightHead+100);
            context.lineTo(X+50, heightHead+60);
        }


        context.stroke();

        // legs
        context.beginPath();
        context.strokeStyle = "#000";
        context.moveTo(X, heightHead+30+100);
        context.lineTo(X-50, heightHead+30+200);
        context.moveTo(X, heightHead+30+100);
        context.lineTo(X+50, heightHead+30+200);
        context.stroke();


    };


    this.draw = function(turn) {
        turn=that.or;
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
        if(this.x==0){
            var X=100;
            that.x=X=100;
            that.oldX=X=100;
        }else{
            var X=that.x;
        }

        context.lineWidth = 5;
        context.beginPath();
        context.fillStyle = "#000";
        context.arc(X, heightHead, 30, 0, Math.PI * 2, true); // draw circle for head
        // (x,y) center, radius, start angle, end angle, anticlockwise
        context.fill();

        /*context.beginPath();
         context.strokeStyle = "red"; // color
         context.lineWidth = 3;
         context.arc(200, 50, 20, 0, Math.PI, false); // draw semicircle for smiling
         context.stroke();*/

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
        context.strokeStyle = "#000";
        context.stroke();

        // arms
        context.beginPath();
        context.strokeStyle = "#000"; // blue
        context.moveTo(X, heightHead+30);
        if(turn=="right"){
            context.lineTo(X-40, heightHead+50);
            context.moveTo(X-40, heightHead+48);
            context.lineTo(X-30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X+10, heightHead+100);
            context.moveTo(X+8, heightHead+100);
            context.lineTo(X+50, heightHead+60);
        }else if(turn=="left"){
            context.lineTo(X+40, heightHead+50);
            context.moveTo(X+40, heightHead+48);
            context.lineTo(X+30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X-10, heightHead+100);
            context.moveTo(X-8, heightHead+100);
            context.lineTo(X-50, heightHead+60);
        }else{
            context.lineTo(X-40, heightHead+50);
            context.moveTo(X-40, heightHead+48);
            context.lineTo(X-30, heightHead+100);
            context.moveTo(X, heightHead+30);
            context.lineTo(X+10, heightHead+100);
            context.moveTo(X+8, heightHead+100);
            context.lineTo(X+50, heightHead+60);
        }


        context.stroke();

        // legs
        context.beginPath();
        context.strokeStyle = "#000";
        context.moveTo(X, heightHead+30+100);
        context.lineTo(X-50, heightHead+30+200);
        context.moveTo(X, heightHead+30+100);
        context.lineTo(X+50, heightHead+30+200);
        context.stroke();
      //  setTimeout(that.draw, 1);
    };


}
Fighter.prototype = new Drawable();