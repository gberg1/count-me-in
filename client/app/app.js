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
          templateUrl: '/views/feed.html'
        }
      }
    })
    .state('tab.feed.all', {
      url: '/all',
      templateUrl: '/views/feed.all.html',
      controller: 'FeedController' // controller is called twice, decide which one will keep the controller
    })
    .state('tab.feed.pledge', {
      url: '/pledge/:pledgename',
      templateUrl: '/views/feed.pledge.html',
      controller: 'FeedPledgeController' // in feedController.js for now; make separate file when you can come up with a good name for the file or when we seperate things into factory and controller files
    })

    .state('tab.user', {
      url: '/user',
      views: {
        'tab-user': {
          templateUrl: '/views/user.html',
          controller: 'UserController'
        }
      }
    })
    .state('tab.user.profile', {
      url: '/:username/profile',
      templateUrl: '/views/user.profile.html'
    })
    .state('tab.user.profile.following', {
      url: '/following',
      templateUrl: '/views/user.profile.html'
    })

     .state('tab.post', {
      url: '/:username/post',
      views: {
        'tab-post': {
          templateUrl: '/views/post.html',
          controller: 'addPostController'
        }
      }
    })
    .state('tab.post.add', {
      url: '/new',
      templateUrl: '/views/post.add.html'
    })
    .state('tab.post.view', {
      url: '/:post_id',
      templateUrl: '/views/post.view.html',
      controller: 'viewPostController' // in feedController.js for now; make separate file when you can come up with a good name for the file or when we seperate things into factory and controller files
    })
    .state('tab.post.pledge', {
      url: '/:username/:pledgename',
      templateUrl: '/views/user.pledge.html'
    })
    .state('tab.post.pledge.add', {
      url: '/new',
      templateUrl: '/views/user.pledge.add.html',
      controller: 'addPledgeController'
    })
    .state('tab.post.pledge.view', {
      url: '/view',
      templateUrl: '/views/user.pledge.view.html',
      controller: 'viewPledgeController'
    })



    // .state('tab.user.post', {
    //   url: '/:username/post',
    //   views: {
    //     'tab-user-post': {
    //       templateUrl: '/views/post.html',
    //       controller: 'addPostController'
    //     }
    //   }
    // })
    // .state('tab.user.post.add', {
    //   url: '/new',
    //   templateUrl: '/views/post.add.html',
    //   controller: 'addPostController'    
    // })
    // .state('tab.user.post.view', {
    //   url: '/:post_id',
    //   templateUrl: '/views/post.view.html',
    //   controller: 'viewPostController'
    // })
    // .state('tab.user.pledge', {
    //   url: '/:username/:pledgename',
    //   templateUrl: '/views/user.pledge.html',
    //   controller: 'UserPledgeController'
    // })
    // .state('tab.user.pledge.add', {
    //   url: '/new',
    //   templateUrl: '/views/user.pledge.add.html',
    //   controller: 'addPledgeController'
    // })
    // .state('tab.user.pledge.view', {
    //   url: '/view',
    //   templateUrl: '/views/user.pledge.view.html',
    //   controller: 'viewPledgeController'
    // })

    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: '/views/login.html',
          controller: 'AuthController'
        }
      }
    })
    .state('tab.signup', {
      url: '/signup',
      views: {
        'tab-signup': {
          templateUrl: '/views/signup.html',
          controller: 'AuthController'
        }
      }
    })
})

.controller('MainController', function($scope) {

})

