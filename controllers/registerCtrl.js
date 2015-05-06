myApp.controller('registerCtrl', function ($scope,$location,$http,$rootScope) {

    $scope.dataLoading = false;
    $scope.userToRegister=new User();
    $scope.validPassword= null;
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

    $scope.register = function () {

        $scope.dataLoading = true;

        if($scope.userToRegister.password == $scope.validPassword){
            $http.post('http://37.59.122.17/user', $scope.userToRegister).
                success(function(data, status, headers, config) {
                    console.log(data);
                    // this refers to the scope
                    if(data === false){
                        $scope.error="User already exist ! Please choose another pseudo !";
                        $scope.dataLoading = false;
                    }else{
                        $location.path('/');
                        $scope.error="User add";
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log(data);
                });
        }else{
            $scope.error='Passwords are not correct !';
            $scope.dataLoading = false;
        }


    };

    $scope.toLogin = function () {
        $location.path('/');
    };

});