myApp.controller('mainCtrl', function ($scope,$http,$rootScope,$location) {

    var socket = io.connect("http://localhost:8080");


    $scope.user=$rootScope.loggedUser;
    $scope.messages=[];
    $scope.usersOnline=null;
    $scope.newMsg=new Message();
    $scope.XY=100;
    $scope.searching=null;

    socket.emit("login",$scope.user);


    $scope.$on('changePos', function(evt, value){
        $scope.XY=value;
        $scope.$apply();
    });

    $scope.quickFight=function(){
        $scope.searching="Searching...";
        socket.emit("searchFight",$scope.user);
    };

    $scope.stopSearch=function(){
        $scope.searching=null;
        socket.emit("stopSearchFight",$scope.user);
    };

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

    socket.on('findFight', function (user) {
        $scope.searching="Fighters found !, You will fight versus "+user.pseudo+" !";
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
