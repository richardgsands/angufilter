/**
 * angufilter
 * For AngularJS
 * By ...?
 */

var app = angular.module('angufilter', [] );

app.directive('angufilter', function () {

  //var filters;    // Array to hold filter structure, including possible values and whether each one is checked

  return {
    templateUrl: 'views/angufilter.html', 
    // Restricting the directive to work witin the scope of the element and passing in attributes from document scope
    restrict: 'E',
    scope: { datapoints: '=', filterKeys: '=', filteredResults: '=' },

    link: function (scope, element) {

      scope.filters = [];

      // This directive requires a 'filters' object in parent controller
      // ================================================================
      // INPUTS
      // filters.datapoints - all datapoints
      // filters.filterKeys - property names to filter on
      // ================================================================
      // OUTPUTS
      // filters.filteredDatapoints - datapoints that match selected filters
      // ================================================================

      // Initialise filtered datapoints to be all datapoints
      // filtered = datapoints;

      // Deep watch dataset
      scope.$watch('[datapoints, filterkeys]', function () {

        if (scope.datapoints !== undefined && scope.filterKeys !== undefined) {

          // Set index on datapoints array
          scope.datapoints.forEach(function(d, i) {
            d._filterIndex = i;
          });

          // Display all datapoints whenever dataset is updated
          scope.filteredResults = scope.datapoints;

          // Building filters from datapoints
          scope.filters = [];
          buildFilters(scope.datapoints, scope.filterKeys, scope.filters)

        }

      }, true);

      // Deep watch filter options to updated filtered datapoints when 'checked' flag changes
      scope.$watch('filters', function() {

        if( scope.datapoints === undefined ) return;

        var filteredResults = shallowCopyArray( scope.datapoints );

        // First loop over filters to work out which datapoints should be visible

        scope.filters.forEach(function(thisFilter) {
          thisFilter.datapointIndexesFilteredByThis = [];

          thisFilter.filterOptions.forEach(function(thisFilterOption) {

            if (!thisFilterOption.checked) {
              // Remove all datapoints for this option - reverse loop
              for(var d=filteredResults.length-1; d>=0; d-=1) {
                var thisFilterIndex = filteredResults[d]._filterIndex;
                if ( thisFilterOption.matchingDatapointIndexes.indexOf(thisFilterIndex) != -1 ) {
                  thisFilter.datapointIndexesFilteredByThis.push(thisFilterIndex);
                  filteredResults.splice(d,1);
                }
              }
            }

          });
        });

        // Now loop over filters again to work out which filter options should be visible (based on visible datapoints)

        // Cache of visible datapoint indexes
        var visibleDatapointIndexes = [];
        filteredResults.forEach(function(thisDatapoint) {
          visibleDatapointIndexes.push(thisDatapoint._filterIndex);
        });

        scope.filters.forEach(function(thisFilter) {
          thisFilter.filterOptions.forEach(function(thisFilterOption) {
  
            thisFilterOption.matchingDatapointCount = 0;
            thisFilterOption.matchingDatapointIndexes.forEach(function(thisMatchingDatapointIndex) {

              if ( visibleDatapointIndexes.indexOf(thisMatchingDatapointIndex) != -1 || thisFilter.datapointIndexesFilteredByThis.indexOf(thisMatchingDatapointIndex) != -1) {
                thisFilterOption.matchingDatapointCount++;
              }

            });

          });
        });


        // Finally, set scope filteredResults array

        scope.filteredResults = filteredResults;

      }, true);

      scope.toggleOptionChecked = function(filter, option, optionIndex) {
        var allOptionsChecked = true;
        var allOptionsUnchecked = true;
        var optionsCheckedCount = 0;
        var optionsCheckedLastIndex = -1;
        filter.filterOptions.forEach(function(option, i){
          if (option.checked) {
            optionsCheckedCount++;
            optionsCheckedLastIndex = i;
          }
          allOptionsChecked = allOptionsChecked && option.checked;
          allOptionsUnchecked = allOptionsUnchecked && !option.checked;
        });
        
        // If all options are checked, turn all others off and this one on
        if (allOptionsChecked) {
          filter.filterOptions.forEach(function(option, i) {
            if (i == optionIndex) {
              option.checked = true;  // Turn just this one on
            } else {
              option.checked = false;  // Turn others off
            }
          });
          return;

        // If just this option is checked, turn all other options on as well
        } else if (optionsCheckedCount==1 && optionsCheckedLastIndex==optionIndex) {
          filter.filterOptions.forEach(function(option) {
            option.checked = true;
          });

        // Otherwise, just toggle option
        } else {
          option.checked=!option.checked;

        }

      }

     scope.isFilterApplied = function(filter) {
        return filter.filterOptions.some(function(option) {
          return !option.checked;
        });
      }

      scope.filterSelectAll = function(filter) {
         filter.filterOptions.forEach(function(option) {
          option.checked = true;
        });

      }


    } // End of link function

  };

  /* Build filters */

  function buildFilters(datapoints, filterKeys, filters) {

    // Populate filters array
    filterKeys.forEach(function(thisFilterKey) {
      // Create new filter structure
      var thisFilter = { filterKey: thisFilterKey, filterOptions: [] };
      filters.push(thisFilter);

      datapoints.forEach(function(thisDatapoint) {
        // Check if filter option has been found, add if necessary
        var matchingFilterOption = addFilterOptionIfNotPresent( filters[filters.length-1], thisDatapoint[thisFilterKey] );
        // Index this datapoint against filter option
        matchingFilterOption.matchingDatapointIndexes.push(thisDatapoint._filterIndex);
        matchingFilterOption.matchingDatapointCount++;

      });

      // Sort filter options alphabetically
      thisFilter.filterOptions.sort(function(a, b) {
        return a.value > b.value;
      });
    });

    // Populate visible datapoints array

  }

  function addFilterOptionIfNotPresent(filter, optionValue) {
    var lastFilterChecked;
    var filterOptionPresent = filter.filterOptions.some(function(o) {
      lastFilterChecked = o;
      return o.value == optionValue;
    });

    if (!filterOptionPresent) {
      // Create new filter option and return this
      var newFilterOption = { value: optionValue, checked: true, matchingDatapointIndexes: [], matchingDatapointCount: 0 }
      filter.filterOptions.push( newFilterOption );
      return newFilterOption;
    } else {
      // Return found filter option
      return lastFilterChecked;
    }
  }

  function shallowCopyArray(arrayToCopy) {
    if (arrayToCopy === undefined) return undefined;

    var newArray = [];
    arrayToCopy.forEach(function(e) {
      newArray.push(e);
    });
    return newArray;
  }




});