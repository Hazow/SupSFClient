myApp.controller('registerCtrl', function ($scope,$location,$http,$rootScope) {

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

    $scope.register = function () {
        console.log('hello');
    };

    $scope.toLogin = function () {
        console.log('helloWorld');
        $location.path('/');
    };

});