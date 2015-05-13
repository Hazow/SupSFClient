myApp.controller('mainCtrl', function ($scope,$http,$rootScope,$location,ngAudio) {

    var socket = io.connect("http://localhost:8080/");

    $scope.sound = ngAudio.load("sound/9BH.wav"); // returns NgAudioObject

    $scope.user=$rootScope.loggedUser;
    $scope.messages=[];
    $scope.usersOnline=null;
    $scope.newMsg=new Message();
    $scope.XY=100;
    $scope.searching=null;
    $scope.askingForFight=null;
    $scope.getAskingForFight=null;
    $scope.opponent=null;
    $scope.fighting=false;
    $scope.opponentFighter=null;
    $scope.myFighter=null;
    $scope.posBase=null;
    $scope.stopFight=null;

    socket.emit("login",$scope.user);


    $scope.$on('changePos', function(evt, value){
        $scope.XY=value;
        $scope.$apply();
    });

    $scope.$on('readyCanvasMyFighter', function(evt, value){
        $scope.myFighter=value;
        if($scope.posBase=="right"){
            value.draw("left",true);
        }else{
            value.draw("right");
        }
        console.log("Fin Fighter");
    });

    $scope.$on('readyCanvasOpponentFighter', function(evt, value){
        $scope.opponentFighter=value;
        if($scope.posBase=="right"){
            value.draw("right");
        }else{
            value.draw("left",true);
        }
        console.log("Fin Opponent");
    });

    /**************************************** AFTER FIGHT *************************************/

    $scope.quitFight = function(){
        $scope.fighting=false;
        socket.emit("stopFight",$scope.opponent);
        $scope.searching=null;
        $scope.opponent=null;
    };

    socket.on('stopFight', function () {
        $scope.fighting=false;
        $scope.opponent=null;
        $scope.searching=null;
        $scope.$apply();
    });

    /*************************************** FIGH **************************************************/
    $scope.$on('moving', function(evt, value){
        if(value=="right"){
            socket.emit("moveRight",$scope.opponent);
        }else{
            socket.emit("moveLeft",$scope.opponent);
        }
    });

    $scope.$on('stopMoving', function(evt, value){
        socket.emit("stopMoving",$scope.opponent);
    });

    $scope.$on('correctLatency', function(evt, value){
        //console.log(value);
        socket.emit("correctLatency",{
            opponent : $scope.opponent,
            x:value.x,
            y:value.y,
            status:value.status,
            position:value.position,
            specialload:value.specialload,
            or:value.or,
            frame:value.frame,
            life:value.life,
            isHurting : value.isHurting
        });
        $scope.searching=null;
    });

    socket.on('correctLatency', function (value) {
        $scope.opponentFighter.x=value.x;
        $scope.opponentFighter.y=value.y;
        $scope.opponentFighter.status=value.status;
        $scope.opponentFighter.position=value.position;
        $scope.opponentFighter.or=value.or;
        $scope.opponentFighter.frame=value.frame;
        $scope.opponentFighter.life=value.life;
        $scope.opponentFighter.specialload=value.specialload;
        $scope.opponentFighter.isHurting=value.isHurting;
        $scope.opponentFighter.draw();
        $scope.$apply();
    });

    socket.on('opponentMove', function (value) {
        $scope.opponentFighter.isAccel = true;
        $scope.opponentFighter.or=value;
        $scope.opponentFighter.goAccel=true;
        $scope.$apply();
    });

    socket.on('opponentStopMove', function (value) {
        $scope.opponentFighter.isAccel=false;
        $scope.opponentFighter.frame=0;
        $scope.opponentFighter.goAccel=false;
        $scope.$apply();
    });

    /************************************* BEFORE FIGHT **********************************************/
    $scope.quickFight=function(){
        $scope.sound.play();
        $scope.searching="Searching...";
        socket.emit("searchFight",$scope.user);
    };

    $scope.askforFight=function(user){
        if(user._id!=$scope.user._id){
            $scope.askingForFight=user;
            socket.emit("askForFight",user);
        }else{
            console.log("You can't fight vs yourself...");
        }

    };

    $scope.acceptFight=function(){
        if($scope.opponent){
            console.log("Accepte fight vs"+$scope.opponent.pseudo);
            socket.emit("goFight",$scope.opponent);
            $scope.getAskingForFight=false;
            $scope.askingForFight=true;
            $scope.fighting=true;
            $scope.posBase="right";
        }
    };

    $scope.declineFight=function(){
        if($scope.opponent){
            socket.emit("cancelFight",$scope.opponent);
            $scope.getAskingForFight=false;
            $scope.askingForFight=false;
            $scope.opponent=null;
            $scope.fighting=false;
        }
    };

    socket.on('askForFight', function (user) {
        $scope.getAskingForFight=true;
        $scope.askingForFight=true;
        $scope.opponent=user;
        console.log(user.pseudo+" want fight against you ! Are you agree ?");
        $scope.$apply();
    });

    socket.on('responseForFight', function (data) {
        console.log(data.opponent.pseudo+" a répondu a votre demande : "+data.res);
        if(data.res){
            $scope.opponent=data.opponent;
            $scope.getAskingForFight=false;
            $scope.fighting=true;
            $scope.posBase="left";
        }else{
            $scope.opponent=null;
            $scope.getAskingForFight=false;
            $scope.askingForFight=false;
            $scope.fighting=false;
        }
        $scope.$apply();
    });

    $scope.stopSearch=function(){
        $scope.searching=null;
        socket.emit("stopSearchFight",$scope.user);
    };

    socket.on('findFight', function (data) {
        $scope.searching="Fighters found !, You will fight versus "+data.user.pseudo+" !";
        $scope.opponent=data.user;
        $scope.fighting=true;
        console.log(data.pos);
        $scope.posBase=data.pos;
    });


    socket.on('waitingFight', function () {
        $scope.searching="No fighters found, you are in the waiting list...";
        $scope.$apply();
    });

    /**************************************************************** CHAT *********************************************/
    $scope.sendMsg=function(){
        $scope.newMsg.sender=$scope.user.pseudo;
        $http.post('http://localhost:8080/msg', $scope.newMsg).
            success(function(data, status, headers, config) {
                socket.emit('message',$scope.newMsg);
                $scope.newMsg=new Message();
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    };

    socket.on('allMessages', function (messages) {
        $scope.messages=messages;
        $scope.$apply();
        console.log(messages);
    });

    socket.on('message', function (message) {
        $scope.messages.push(message);
        $scope.$apply();
    });
    /************************************************************** OTHER ************************************************/

    socket.on('alreadyOnline', function (user) {
        console.log("alreadyOnline");
        $rootScope.loggedUser=null;
        $rootScope.error="User already online";
        $scope.user=null;
        console.log("alreadyOnline");
        $location.path('/login');
        $scope.$apply();
    });

    socket.on('listUserOnline', function (users) {
        $scope.usersOnline=users;
        $scope.$apply();
    });

    socket.on('newUserOnline', function (user) {
        $scope.usersOnline.push(user);
        $scope.$apply();
    });

    socket.on('disconnectUserOnline', function (user) {
        $scope.usersOnline.forEach(function(entry){
            if(entry.pseudo==user.pseudo){
                $scope.usersOnline.splice($scope.usersOnline.indexOf(entry),1);
            }
        });
        $scope.$apply();
    });

});
