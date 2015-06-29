angular.module('app')
.directive('feedPledge', function() {
  return {
    restrict: 'E',
    scope: {
      pledgeName: '=',
      awsurl: '=',
      hasLiked: '=',
      likes: '=',
      text: '=',
      title: '=',
      username: '=',
      date: '=',
      getcomments: '='
    },
    templateUrl: './templates/feedPledge.html',
    link: function(scope, element, attr) {
    }
  }
})
