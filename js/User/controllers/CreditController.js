angular.module('UserApp').controller('CreditController', ['$rootScope','$scope','$sce','settings','$http','$localStorage','$window','$location','$templateCache','$stateParams','$state', function($rootScope, $scope, $sce,settings,$http,$localStorage,$window,$location,$templateCache,$stateParams,$state) {
    $scope.$on('$viewContentLoaded', function() {	
        // initialize core components
        App.initAjax();
		$window.scrollTo(0, 0);
		
		console.log($localStorage.credit);
		if($localStorage.credit){
		  $scope.edit=true;
		}
		
		console.log($localStorage.eid);
		$scope.redirect=function(page){
		  $state.go(page);
		} 
	    $scope.terms_array=[
				{ name:'12 Months',value:'12'},
				{ name:'24 Months',value:'24'},
				{ name:'36 Months',value:'36'},
				{ name:'48 Months',value:'48'},
				{ name:'60 Months',value:'60'},
				{ name:'72 Months',value:'72'},
				{ name:'84 Months',value:'84'}

		];
		
		
	   if($localStorage.select_trim.front_img!=''){
		  $scope.vehicle_img=$localStorage.select_trim.front_img;
		}else if($localStorage.select_trim.front_fuel_img!=''){
		   $scope.vehicle_fuel_img=$localStorage.select_trim.front_fuel_img;
		}else if($localStorage.select_trim.imgs){
			var res =$localStorage.select_trim.imgs.split(",");
			$scope.vehicle_img=res[0];
		}else if($localStorage.select_trim.fuel_images!=''){
		   var res =$localStorage.select_trim.fuel_images.split(",");
			$scope.vehicle_fuel_img=res[0];
		
		}
		
		
		$scope.selected_dealer=$localStorage.dealer[0];
		
		
		if($stateParams.review!=undefined){
			console.log('s');
		    $http.post('User/Login_Controller/checksession').success(function(data){
				 
				 $scope.userid=data['user_id'];
				 $scope.calculator=$localStorage.credit_data;
			});
		  	
		}else{
			
			console.log($localStorage.calculated_data);
			
			var calculator={
			    down_payment:Math.round($localStorage.calculated_data.sel_down_payment),
			    terms:$localStorage.calculated_data.sel_terms,
				estimated_trade_in:$localStorage.calculated_data.sel_est_trade,
				interest_rate:$localStorage.calculated_data.sel_interest_rate,
				tax_rate:$localStorage.calculated_data.sel_tax_rate,
			}
			$scope.calculator=calculator;
			console.log($scope.calculator);
			$scope.ttax= parseInt($localStorage.calculated_data.msrp_price) * parseInt($localStorage.calculated_data.sel_tax_rate) /100;
			$scope.calculator.amount_reqested = parseInt($localStorage.calculated_data.msrp_price) - parseInt($scope.calculator.estimated_trade_in) - parseInt($scope.calculator.down_payment);
	      	get_selected_vehicle();
			  
		     
		}
		
		get_selected_vehicle();
		function get_selected_vehicle(){
		    $http.post('User/Finance_Controller/get_selected_vehicle?vehicle_id='+$localStorage.vehicle).success(function(data){
                $scope.vehicle=data[0];
				if($scope.vehicle.imgs!=undefined){
					var i=$scope.vehicle.imgs;
					var imgs=i.split(',');
					$scope.vehicle_imge=imgs[0];
				}
				
				  if($scope.vehicle.offer_end!=undefined){
					var d = new Date();
				    var res=dateCompare( d , $scope.vehicle.offer_end);
					  
				     if(res){
					   if($scope.vehicle.special_price!=''){
					        $scope.vehicle.vehicle_price=$scope.vehicle.special_price;
					   }else{
					        $scope.vehicle.vehicle_price=$scope.vehicle.msrp_price;
					   }
					 }else{
					   $scope.vehicle.vehicle_price=$scope.vehicle.msrp_price;
					 }
				  }else{
					 $scope.vehicle.vehicle_price=$scope.vehicle.msrp_price;
				 } 
				
			});
		}
		$scope.remove_zero=function(){
		
			 $scope.calculator.estimated_trade_in='';
		}
		
		$scope.update_amount_requested=function(){
			 $scope.amterr='';
				var e=$scope.calculator.estimated_trade_in;
			   var d=$scope.calculator.down_payment;
				if(e==''){
				  e=0;
				}
				if(d==0){
				 d=0;
				}
			
			 $scope.calculator.amount_reqested = Math.round(parseInt($scope.vehicle.vehicle_price) - parseInt(e) - parseInt(d) );
		}
		
		function dateCompare(date1, date2){
			return new Date(date2) > new Date(date1);
		}
		
		
		
		$scope.show_popup=function(){
		  $scope.get_personal_info();
		}	
	
		$scope.get_personal_info=function(){
			var error=0
			if($scope.calculator.amount_reqested<0){
			 $scope.amterr='invalid requested amount';
				error=1;
			}
			
			if(error==0){
			   console.log($scope.calculator);
				if($scope.calculator.estimated_trade_in==''){
				  $scope.calculator.estimated_trade_in=0;
				} 

				if($scope.calculator.down_payment==''){
				  $scope.calculator.down_payment=0;
				} 

				var t=$('.sel__box > span.selected').text();
				if(t){
				  var term=t.split(' ');
				  $scope.calculator.terms=term[0];
				}

				$scope.calculator.vehicle_id=$localStorage.vehicle;
				$scope.calculator.dealer_id=$localStorage.dealer[0]['dealer_id'];
				$localStorage.credit_data=$scope.calculator;
				
				$http.post('User/Login_Controller/checksession').success(function(data){
			       if(data['user_id']!='' && data['user_id']!=undefined && data['user_id']!=null){
					   
					    var edata={
						  requested_amount:$scope.calculator.amount_reqested,
						  dealer_id:$localStorage.dealer[0]['dealer_id'],
						  vehicle_id:$localStorage.vehicle,
						  estimated_trade:$scope.calculator.estimated_trade_in,
						  down_payment:$scope.calculator.down_payment,
						  terms:$scope.calculator.terms,
						  int_rate:$scope.calculator.interest_rate,
				          stax_rate:$scope.calculator.tax_rate,
					     }
						 
					 
					     $http.post('User/Finance_Controller/add_enquiry_data?edata='+JSON.stringify(edata)+'&userid='+data['user_id']).success(function(data){ 
						   $localStorage.eid=data;
						   console.log($localStorage.eid);
						  $state.go('application');
						 });
				   }else{
					    $state.go('application');
				   }
				 
			    });
				
				
			}
			

		}
		
	
	
	 $scope.edit_cal_data=function(){
		 
		 var error=0
			if($scope.calculator.amount_reqested<0){
			 $scope.amterr='invalid requested amount';
				error=1;
			}
			
			if(error==0){
		    var edata={
				  requested_amount:$scope.calculator.amount_reqested,
				  estimated_trade:$scope.calculator.estimated_trade_in,
				  down_payment:$scope.calculator.down_payment,
				  terms:$scope.calculator.terms,
				  int_rate:$scope.calculator.interest_rate,
				  stax_rate:$scope.calculator.tax_rate,
			  }
			
			$scope.calculator.vehicle_id=$localStorage.vehicle;
			$scope.calculator.dealer_id=$localStorage.dealer[0]['dealer_id'];
			$localStorage.credit_data=$scope.calculator;
			console.log($localStorage.en_id);
		$http.post('User/Home_Controller/edit_edata?edata='+JSON.stringify(edata)+'&userid='+$scope.userid+'&eid='+$localStorage.eid).success(function(data){
			console.log($localStorage.en_id);
			console.log(data);
			 $localStorage.credit=false;
			 $state.go('review');	
		});
			}
		 
	 }
	
	
	   get_disclosures();
		 
		 function get_disclosures(){
		    $http.post('User/Finance_Controller/get_disclosures').success(function(data){
		    
				$scope.finance_disclosure=data[14]['disc_content'];
				$scope.downpay_disclosure=data[1]['disc_content'];
				$scope.tradein_disclosure=data[2]['disc_content'];
				$scope.term_disclosure=data[4]['disc_content'];
				
		    });
		 }
		
		
		
		
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);

'use strict';
/* Directives */
angular.module('UserApp.directives', [])
    .directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() == $(firstPassword).val());
                });
            });
        }
    }
}]);
