myApp.controller('loginCtrl', function ($scope,$location,$http,$rootScope) {

    $scope.dataLoading = false;
    $scope.userToLog=new User();
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
                    $rootScope.loggedUser=new User(data._id,data.pseudo,"",data.win,data.lose,data.fights,data.created);
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