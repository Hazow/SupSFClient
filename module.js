var myApp = angular.module('myApp', ['ngRoute','luegg.directives','ngAudio']);

myApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'partials/main.html',
            controller: 'mainCtrl'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl',
            publicAccess: true
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerCtrl',
            publicAccess: true
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

myApp.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        if ( $rootScope.loggedUser == null ) {
            // no logged user, we should be going to #login
            if ( next.templateUrl == "partials/login.html" || next.templateUrl == "partials/register.html") {
                // already going to #login, no redirect needed
            } else {
                // not going to #login, we should redirect now
                $location.path( "/login" );
            }
        }
    });
})

function Drawable() {
    this.init = function(x, y, width, height) {
        // Defualt variables
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

/*myApp.run(['$rootScope', function($rootScope, $location, user, $route) {

    var routesOpenToPublic = [];
    angular.forEach($route.routes, function(route, path) {
        // push route onto routesOpenToPublic if it has a truthy publicAccess value
        route.publicAccess && (routesOpenToPublic.push(path));
    });

    $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {
        var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));
        if(closedToPublic && !user.isLoggedIn()) {
            $location.path('/login');
        }
    });
}]);*/