myApp.directive("drawingCanvasEnemy", function(){
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

            var heightHead=(height-long)-50;
            var spaceBegin=width-100;


            context.beginPath();
            context.fillStyle = "#000";
            context.arc(spaceBegin, heightHead, 30, 0, Math.PI * 2, true); // draw circle for head
            // (x,y) center, radius, start angle, end angle, anticlockwise
            context.fill();

            /*context.beginPath();
             context.strokeStyle = "red"; // color
             context.lineWidth = 3;
             context.arc(200, 50, 20, 0, Math.PI, false); // draw semicircle for smiling
             context.stroke();*/

            // eyes
            context.beginPath();
            context.fillStyle = "#fff"; // color
            context.arc(spaceBegin-10, 45, 3, 0, Math.PI * 2, true); // draw left eye
            context.fill();
            context.arc(spaceBegin+10, 45, 3, 0, Math.PI * 2, true); // draw right eye
            context.fill();

            // body
            context.beginPath();
            context.moveTo(spaceBegin, heightHead+30);
            context.lineTo(spaceBegin, (heightHead+30)+100);
            context.strokeStyle = "#000";
            context.stroke();

            // arms
            context.beginPath();
            context.strokeStyle = "#000"; // blue
            context.moveTo(spaceBegin, heightHead+30);
            context.lineTo(spaceBegin-50, heightHead+30+50);
            context.moveTo(spaceBegin, heightHead+30);
            context.lineTo(spaceBegin+50, heightHead+30+50);
            context.stroke();

            // legs
            context.beginPath();
            context.strokeStyle = "#000";
            context.moveTo(spaceBegin, heightHead+30+100);
            context.lineTo(spaceBegin-50, heightHead+30+200);
            context.moveTo(spaceBegin, heightHead+30+100);
            context.lineTo(spaceBegin+50, heightHead+30+200);
            context.stroke();

        }
    };
});