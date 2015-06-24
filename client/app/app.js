angular.module('app', [
  'ui.router',
  'ionic',
  'ngFileUpload'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/feed/all');

  $stateProvider
    .state('tab', {
      url: '',
      abstract: true,
      templateUrl: 'views/tabs.html'
    })
    .state('tab.feed', {
      url: '/feed',
      views: {
        'tab-feed': {
          templateUrl: '/views/feed.html',
          controller: 'FeedController'
        }
      }
    })
    .state('tab.feed.all', {
      url: '/all',
      templateUrl: '/views/feed.all.html',
      controller: 'FeedController'
    })
    .state('tab.feed.pledge', {
      url: '/pledge',
      templateUrl: '/views/feed.pledge.html',
      controller: 'FeedController'
    })
    .state('tab.user', {
      url: '/user/:username',
      views: {
        'tab-user': {
          templateUrl: '/views/user.html',
          controller: 'UserController'
        }
      }
    })
    .state('tab.user.dashboard', {
      url: '/dashboard',
      templateUrl: '/views/user.dashboard.html'
    })
    .state('tab.user.addPost', {
      url: '/post/new',
      templateUrl: '/views/user.post.add.html',
      controller: 'UserPostController'
    })
    .state('tab.user.pledge', {
      url: '/pledge/:pledgename',
      templateUrl: '/views/user.pledge.html',
      controller: 'UserPledgeController'
    })
    .state('user.pledge-list', {
      templateUrl: '/views/user-pledge-list.html',
      controller: 'UserPledgeListController'
    })
    .state('user.pledge', {
      templateUrl: '/views/user-pledge.html',
      controller: 'UserPledgeController'
    })
    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: '/views/login.html',
          controller: 'LoginController'
        }
      }
    })
    .state('tab.signup', {
      url: '/signup',
      views: {
        'tab-signup': {
          templateUrl: '/views/signup.html',
          controller: 'SignupController'
        }
      }
    })
})

.controller('MainController', function($scope) {

});
