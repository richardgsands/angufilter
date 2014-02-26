app.controller('MainController', ['$scope', '$http',
    function MainController($scope, $http) {

      $scope.data = angufilterIntialData;      // Global variable TODO: Make into angular service?

      $scope.filteredData;


      $scope.getHeaders = function(data) {
        if ( data != null && data.length>0 ) {
          return Object.keys( data[0] )
        } else {
          return null;
        }
      }

      $scope.filterKeys = ['Rendering engine', 'Platform(s)', 'CSS grade'];
      


    }
]);