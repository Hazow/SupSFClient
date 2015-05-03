myApp.controller('loginCtrl', function ($scope,$http) {

    $http.get('http://localhost:8080/customer').
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
    $scope.filter='-name';
});

myApp.controller('MainCtrl', function ($scope,$http) {
    $scope.online=false;
    $scope.user=[];
    $scope.usersOnline=null;



});