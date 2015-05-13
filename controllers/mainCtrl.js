myApp.controller('mainCtrl', function ($scope,$http,$rootScope,$location,ngAudio,$localStorage) {

    var socket = io.connect("http://localhost:8080/");

    $scope.sound = ngAudio.load("sound/9BH.wav"); // returns NgAudioObject
    $scope.user=$rootScope.loggedUser;
    $scope.users=null;
    $scope.leaderBoard=false;
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

    $http.get('http://localhost:8080/user').
        success(function(data, status, headers, config) {
            $scope.users=data;
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });

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

    $scope.unlog=function(){
        $localStorage.user=null;
        $rootScope.loggedUser=null;
        socket.disconnect();
        $location.path('/login');
    };
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

    $scope.$watch('myFighter.life', function(newValue, oldValue) {
        if(newValue==0){
            $scope.fighting=false;

            $scope.user.lose++;
            $scope.user.fights.push({results: 0,versus: $scope.opponent});
            console.log($scope.user);
            $http.put('http://localhost:8080/user', $scope.user).
                success(function(data, status, headers, config) {
                    console.log(data);
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });
            $scope.newMsg.sender="Console";
            $scope.newMsg.body=$scope.opponent.pseudo+" win versus "+$scope.user.pseudo;
            socket.emit('message',$scope.newMsg);
            $scope.newMsg=null;
            $scope.opponent=null;
            $scope.searching=null;
            socket.emit('majLeaderBoard',$scope.user);
        }
    });

    $scope.$watch('opponentFighter.life', function(newValue, oldValue) {
        if(newValue==0){
            $scope.fighting=false;

            $scope.user.win++;
            $scope.user.fights.push({results: 1,versus: $scope.opponent});
            $http.put('http://localhost:8080/user', $scope.user).
                success(function(data, status, headers, config) {
                    console.log(data);
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });

            $scope.opponent=null;
            $scope.searching=null;
            socket.emit('majLeaderBoard',$scope.user);
        }
    });

    /*************************************** FIGH **************************************************/

    $scope.$watch('myFighter.accel', function(newValue, oldValue) {
        if(newValue==0){
            console.log("Accel null");
            socket.emit("correctLatency",{
                opponent : $scope.opponent,
                x:$scope.myFighter.x,
                y:$scope.myFighter.y,
                status:$scope.myFighter.status,
                position:$scope.myFighter.position,
                specialload:$scope.myFighter.specialload,
                or:$scope.myFighter.or,
                frame:$scope.myFighter.frame,
                life:$scope.myFighter.life,
                isHurting : $scope.myFighter.isHurting
            });
        }

    });

    $scope.$on('event', function(evt, value){
            socket.emit("event", { opponent:$scope.opponent, event:value });
    });

    socket.on('eventOpponent', function (value) {

        if($scope.myFighter.contextOpponent==null){
            $scope.myFighter.contextOpponent=$scope.opponentFighter.context;
        }
        if($scope.opponentFighter.contextOpponent==null){
            $scope.opponentFighter.contextOpponent=$scope.myFighter.context;
        }

        console.log(value);
        switch(value){
            case "right":
            case"left":
                $scope.opponentFighter.isAccel = true;
                $scope.opponentFighter.or=value;
                $scope.opponentFighter.goAccel=true;
                break;
            case "stop":
                $scope.opponentFighter.isAccel=false;
                $scope.opponentFighter.frame=0;
                $scope.opponentFighter.goAccel=false;
                $scope.opponentFighter.isHurting = false;
                break;
            case "jump":
                $scope.opponentFighter.jump();
                break;
            case "punch":
                $scope.opponentFighter.punch();
                break;
            case "crouch":
                $scope.opponentFighter.crouch();
                break;
            case "kick":
                $scope.opponentFighter.kick();
                break;
            case "protect":
                $scope.opponentFighter.protect();
                break;
            case "kamehameha":
                $scope.opponentFighter.kamehameha();
                break;
            case "endCrouch":
                $scope.opponentFighter.isAccel = false;
                $scope.opponentFighter.frame=0;
                $scope.opponentFighter.isHurting = false;
                $scope.opponentFighter.standup();
                $scope.opponentFighter.position = "";
                break;
            case "endStatus":
                $scope.opponentFighter.isAccel = false;
                $scope.opponentFighter.frame=0;
                $scope.opponentFighter.status = "";
                $scope.opponentFighter.isHurting = false;
                $scope.opponentFighter.resetCombat();
                $scope.opponentFighter.draw();
                break;
            case "endSpecial":
                $scope.opponentFighter.isAccel = false;
                $scope.opponentFighter.frame=0;
                $scope.opponentFighter.status = "";
                $scope.opponentFighter.standup();
                $scope.opponentFighter.specialload = 0;
                $scope.opponentFighter.isHurting = false;
                break;
        }
        $scope.$apply();
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

    /************************************************************** LEADERBOARD ******************************************/

    socket.on('majLeaderBoard',function(user){
        console.log("majLeaderBoard");
        $scope.users.forEach(function(entry){
           if(entry._id==user._id){
               $scope.users[$scope.users.indexOf(entry)]=user;
               console.log("found");
           }
        });
        $scope.$apply();
    });



    /************************************************************** OTHER ************************************************/
    $scope.sortByRatio=function(us){
        //console.log(us.pseudo+" : "+(us.lose/us.win));
        if(us.lose==0 && us.win==0){
            return null;
        }
        return parseInt(us.lose, 10) / parseInt(us.win, 10);
    };

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
            if(entry._id==user._id){
                $scope.usersOnline.splice($scope.usersOnline.indexOf(entry),1);
                if($scope.opponent._id==user._id){
                    $scope.messages.push(new Message(null,"Console","Your opponent has quit the fight !"));
                    $scope.opponentFighter.life=0;
                }
            }
        });
        $scope.$apply();
    });

});
