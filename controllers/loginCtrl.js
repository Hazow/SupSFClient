myApp.controller('loginCtrl', function ($scope,$location,$http,$rootScope,$localStorage) {

    $scope.dataLoading = false;
    $scope.userToLog=new User();
    $scope.saveMe=false;
    $scope.$storage = $localStorage;
    /*$scope.userToLog.pseudo="Zow";
    $scope.userToLog.password="zow";*/

    $scope.error=false;

    if($rootScope.error){
        $scope.error=$rootScope.error;
    }

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    $scope.login = function () {
        $scope.dataLoading = true;

        $http.post('http://localhost:8080/isLogin', $scope.userToLog).
            success(function(data, status, headers, config) {
                // this refers to the scope
                if(data!=null && !isEmpty(data)){
                    $rootScope.loggedUser=new User(data._id,data.pseudo,data.password,data.win,data.lose,data.fights,data.created);
                    if($scope.saveMe){
                        $scope.$storage.user=$rootScope.loggedUser;
                    }
                    console.log(data);
                    $location.path('/');
                }else{
                    $scope.error="Invalid Username";
                    $scope.dataLoading = false;
                }

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });

        /*AuthenticationService.Login($scope.username, $scope.password, function(response) {
         if(response.success) {
         AuthenticationService.SetCredentials($scope.username, $scope.password);
         $location.path('/');
         } else {
         $scope.error = response.message;
         $scope.dataLoading = false;
         }
         });*/
    };
    //$scope.login();

    $scope.toRegister = function () {
        $location.path('/register');
    };

});