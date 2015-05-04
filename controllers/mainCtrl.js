myApp.controller('mainCtrl', function ($scope,$http,$rootScope,$location) {

    $scope.user=$rootScope.loggedUser;
    $scope.messages=[];
    $scope.usersOnline=null;
    $scope.newMsg=new Message();
    $scope.XY=100;

    $scope.$on('changePos', function(evt, value){
       $scope.XY=value;
        $scope.$apply();
    });

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

    var socket = io.connect("http://localhost:8080");
    socket.emit("login",$scope.user);

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

    /*   $http.get('http://localhost:8080/customer').
     success(function(data, status, headers, config) {
     $scope.customers.splice(0,$scope.customers.length);
     data.forEach(function(entry){
     $scope.customers.push(new Customer(entry._id,entry.firstname,entry.lastname,entry.created,entry.website));
     });
     }).
     error(function(data, status, headers, config) {
     console.log(data+" / "+status);
     });

     $scope.pushCustomer = function(customer) {
     console.log(customer);
     $http.post('http://localhost:8080/customer', customer).
     success(function(data, status, headers, config) {
     // this refers to the scope
     $scope.customers[$scope.customers.length] = data;
     $scope.customerToPush = {}; // Reset the current element
     }).
     error(function(data, status, headers, config) {
     console.log(data);
     });
     };

     $scope.delCustomer = function(customer){
     $http.delete('http://localhost:8080/customer/'+customer.id).
     success(function(data, status, headers, config) {
     $scope.customers.splice($scope.customers.indexOf(customer),1);
     }).
     error(function(data, status, headers, config) {
     console.log(data);
     });

     };

     $scope.showUpdate = function(customer){
     $scope.show=true;
     $scope.customerToUpdate=customer;
     };

     $scope.updateCustomer = function(customer){
     console.log(customer);
     $http.put('http://localhost:8080/customer', customer).
     success(function(data, status, headers, config) {

     $scope.customers[$scope.customers.indexOf(customer)]=customer;
     $scope.show=false;
     }).
     error(function(data, status, headers, config) {
     console.log(data);
     });

     };


     $scope.limit=$scope.customers.length;
     $scope.filter='-name';*/
});
