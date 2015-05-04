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
    this.speed = 4,
    this.friction = 0.98;
    this.stop=false;
    var that=this;
    this.or="right";

    this.right = function(){

        console.log("oldX: "+that.oldX+"  x: "+that.x);
        that.moving=true;
        if(that.velX < that.speed){
            that.velX++;
        }

        that.velX *= that.friction;
        that.x+=that.velX;

        if (that.x >= 590) {
            that.stop=true;
            that.x = 590;
        }

        that.draw("right");
        console.log(that.x+"-"+that.oldX+"="+(that.x-that.oldX)+" stop:"+that.stop);
        if((that.x-that.oldX)<50 && !that.stop){
            setTimeout(that.right,5);
        }else{
            that.oldX=that.x;
            that.moving=false;
            that.stop=false
            that.or="right";
        }

    };

    this.left = function(){
        that.moving=true;
        if(that.velX > -that.speed){
            that.velX--;
        }

        that.velX *= that.friction;
        that.x+=that.velX;

        if (that.x <= 5) {
            that.stop=true;
            that.x = 5;
        }
        that.draw("left");
        console.log(that.x+"-"+that.oldX+"="+(that.x-that.oldX)+" stop:"+that.stop);
        if((that.x-that.oldX)>-50 && !that.stop){
            setTimeout(that.left,5);
        }else{
            that.oldX=that.x;
            that.moving=false;
            that.stop=false
            that.or="left";
        }

    };

    this.jump = function(){

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
    };

}
Fighter.prototype = new Drawable();