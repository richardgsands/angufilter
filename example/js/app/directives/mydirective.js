/**
 * Mydirective
 * For AngularJS
 * By ...?
 */

angular.module('mydirective', [] )
    .directive('mydirective', function ($parse, $http) {
    return {
        restrict: 'EA',
        scope: {

        },
        templateUrl: 'views/mydirective.html',

        controller: function ( $scope ) {

        },

        link: function( $scope, elem, attrs, ctrl ) {

        }
    };
});
