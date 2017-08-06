'use strict';

export default function ($rootScope, $state, $window) {
  'ngInject';

  $rootScope.page = {
    sitename : 'UNIFES',
    title : '_',
    breadcrumbs : [],

    // Sets page title
    setTitle: function(title) {
      this.title = title ;
    },

    setBreadcrumbs: function (crumbs) {
      this.breadcrumbs = crumbs;
    }
  };

  if  (!Meteor.userId() && !Meteor.loggingIn()){
    Meteor.setTimeout(function() {
      if(!$state.params.id) $state.go('core.home');
    });
  }

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
  //  console.log('test');
  });


  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    if (error === 'AUTH_REQUIRED') $state.go('auth.signin');
  });

  // Always record previous state
  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    storePreviousState(fromState, fromParams);

    // Change title
    if ($state.current.title) {
      $rootScope.page.setTitle($state.current.title );
    } else {
      $rootScope.page.setTitle(""); // no title if none specified
    }

    // if($state.current.breadcrumbs) {
    //   $rootScope.page.setBreadcrumbs($state.current.breadcrumbs );
    // } else {
    //   $rootScope.page.setBreadcrumbs([]);
    // }
    // For Header to display Blue Breadcrumbs Header or nah
    $rootScope.state_name = $state.current.name;
    // Scroll to top of page on refresh
    $window.scrollTo(0, 0);
  });

  // Store previous state
  // only store this state if it shouldn't be ignored
  function storePreviousState (state, params) {
    if (!state || !state.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }

  // Blur events can be double-fired, so we'll filter those out with prevEvent tracking
  $window.onfocus = function (event) {
    $rootScope.$broadcast('windowFocus', event);
  };

  $window.onblur = function (event) {
    $rootScope.$broadcast('windowBlur', event);
  };
}
