angular.module('app')

.controller('UserPledgeController', function($scope, $stateParams, UserPledgeFactory) {
  UserPledgeFactory.getUserPledgeData().then(function(pledgeData) {
    $scope.userPledgePosts = pledgeData.data;

  });
  $scope.pledgename = $stateParams.pledgename;
})
.factory('UserPledgeFactory', function($http, $stateParams) {
  var getUserPledgeData = function() {
    return $http({
      method: 'GET',
      url: '/api/pledge/posts',
      params: {pledgename: $stateParams.pledgename}
    })
    .success(function(data) {
      data = data.filter(function(postObj) {
        return postObj.username === $stateParams.username;
      }).sort(function(postObj1, postObj2) {
        return postObj1.createdAt - postObj2.createdAt;
      })
      return data;
    })
    .catch(function(err) {
      console.error(err);
    })
  }

  return {
    getUserPledgeData: getUserPledgeData
  }

})
.factory('subscribe', function($http) {
  var subscribeToPledge = function(pledgename, callback) {
    console.log('pledgename: ', pledgename);
    $http.post('/api/pledge/subscribe', {pledgename: pledgename})
    .success(function(data, status, headers, config) {
      callback(data);
      console.log('subscribeToPledge data: ', data);
    })
    .error(function(data, status, headers, config) {
      console.log('error status with subscribeToPledge: ', status, data, headers, config);
    });
  };

  return {
    subscribeToPledge: subscribeToPledge
  }
});

