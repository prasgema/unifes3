'use strict';

angular.module('core').controller('AuthController', ['$scope', '$state', '$meteor','$mdDialog', '$reactive',
  function ($scope, $state, $meteor,$mdDialog, $reactive) {
    $scope.signup = function (registration) {
      if(registration.password !== registration.confirmPassword)
        return $scope.err = 'Password did not match';
      else {
        //delete registration.confirmPassword;
        registration.profile.image = '/images/user.png';

        $meteor.createUser(registration, function (err){
          if(!err) {
            var invitation = {};
            invitation.email = registration.email;
            invitation._id = Meteor.userId();
            Meteor.call('emailVerified',invitation);
            let email = Meteor.user().emails[ 0 ].address;
               alert( `Verification sent to ${ email }!`, 'success' );
               $state.go('auth.signin');
             }
             else{
               return $scope.err = 'Email Registered Already - Please Try again';
             }
           });
         }
       };

    $scope.update = function(email) {
       var email= $state.params.email;
         Meteor.call('updateEmail', email, function(error) {
                    if (error) {
                        throw new Error(error.reason);
                    } else {
                        $state.go('auth.signin');
                    }
                });
              },

 $scope.signin = function (email, password){
  Meteor.call('checkEmailVerification', email, function(error,data){
      if (data == "verified"){
           $meteor.loginWithPassword(email, password, function(err){
             if (err){
               return $scope.err = 'Email Registered Already - Please Try again';//  FlashMessages.sendError("Either email or password is incorrect");
            }
            else{
              $state.go('core.home');//  FlashMessages.sendSuccess("Logged in");
             }
          });
      }else if(data == "unverified"){
           $state.go('auth.unverified',{ 'email': email });
      }else{
         return $scope.err = 'Email Registered Already - Please Try again';//  FlashMessages.sendError("Either email or password is incorrect");
      }
     });
  };

    $scope.loginFB = function () {
      $meteor.loginWithFacebook(function(err){
        if(!err) $state.go('core.home');
      });
    };

    $scope.signout = function () {
      $meteor.logout(function (err){
        if(!err) $state.go('auth.signin');
      });
    };
  }
]);
