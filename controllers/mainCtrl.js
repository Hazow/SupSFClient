myApp.controller('mainCtrl', function ($scope,$http,$rootScope,$location) {

    var socket = io.connect("http://37.59.122.17");


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

    socket.emit("login",$scope.user);


    $scope.$on('changePos', function(evt, value){
        $scope.XY=value;
        $scope.$apply();
    });

    $scope.quickFight=function(){
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
        console.log(data.opponent.pseudo+" a r�pondu a votre demande : "+data.res);
        if(data.res){
            $scope.opponent=data.opponent;
            $scope.getAskingForFight=false;
            $scope.fighting=true;
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

    $scope.sendMsg=function(){
        $scope.newMsg.sender=$scope.user.pseudo;
            $http.post('http://37.59.122.17/msg', $scope.newMsg).
                success(function(data, status, headers, config) {
                    socket.emit('message',$scope.newMsg);
                    $scope.newMsg=new Message();
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });
    };

    socket.on('findFight', function (user) {
        $scope.searching="Fighters found !, You will fight versus "+user.pseudo+" !";
        $scope.fighting=true;
        $scope.opponent=user;
        $scope.$apply();
    });

    socket.on('waitingFight', function () {
        $scope.searching="No fighters found, you are in the waiting list...";
        $scope.$apply();
    });

    socket.on('message', function (message) {
        $scope.messages.push(message);
        $scope.$apply();
    });

    socket.on('alreadyOnline', function (user) {
        console.log("alreadyOnline");
        $rootScope.loggedUser=null;
        $rootScope.error="User already online";
        $scope.user=null;
        console.log("alreadyOnline");
        $location.path('/login');
        $scope.$apply();
    });

    socket.on('allMessages', function (messages) {
        $scope.messages=messages;
        $scope.$apply();
        console.log(messages);
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
