angular.module('AdminApp').controller('EnquiryController', ['$rootScope', '$scope','$sce','settings','$http','$window','$location','$templateCache','$stateParams','$state', function($rootScope, $scope, $sce,settings,$http,$window,$location,$templateCache,$stateParams,$state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
		$scope.gridOptions = {};
		  $('#pages').removeClass("active");
			$('#dealer').removeClass("active");
		   	   $('#make').removeClass("active");
		   	   $('#vehicle').removeClass("active");
		   $('#calculator').removeClass("active");
		   $('#leads').removeClass("active");
		   $('#enquiry').addClass("active");
	
	   
		function show_enquiry_data(data){
			$scope.gridOptions={
					  data:data,
					  enableFiltering: true,
					  onRegisterApi: function(gridApi){
					    $scope.gridApi = gridApi;
					  },
					  columnDefs:[
					    {field:"firstname",displayName:'Lead Name'},
						{field:"name",minWidth:150,displayName:'Dealer Name'},
						{field:"make_name",displayName:'Make'},
						{field:"model",displayName:'Model'},
						{field:"trim",displayName:'Trim'},
						{field:"msrp_price",displayName:'Actual Price'},
						{field:"requested_amount",displayName:'Requested Amount'},
						{field:"edown_payment",displayName:'Down Payment'},
						{field:"estimated_trade",displayName:'Estimated Trade'},
						{field:"int_rate",displayName:'APR'},
						{field:"stax_rate",displayName:'Tax Rate'},
						{field:"enq_date",minWidth:150,displayName:'Enquiry Date'},
						{field: 'Action',minWidth:150, cellTemplate:'<button class="btn btn-primary enqbtn" ng-click="grid.appScope.view_enquiry(row.entity)">View</button><button class="btn btn-danger enqbtn" ng-click="grid.appScope.delete_enquiry(row.entity.enquiry_id)">delete</button>',displayName:'Action' }
					  ]
					  /*<button class="btn btn-primary uigridbtn" ng-click="grid.appScope.show_lead(row.entity)">View</button>*/
				  };
		}
		
		$scope.delete_enquiry=function(eid){
			$scope.enqid=eid;
			$('#deletemodal').modal('show');
		}
		
		$scope.delete_enq=function(){
			$http.post("Admin/Lead_Controller/delete_enquiry?eid="+$scope.enqid).success(function(data){
				 $('#deletemodal').modal('hide');
	         });
		}
		get_enquiry_list();
		function get_enquiry_list(){
			 $http.post("Admin/Lead_Controller/get_enquiry_list").success(function(data){
	            console.log(data);
				show_enquiry_data(data);
	         });
		}
		
		$scope.view_enquiry=function(data){
			$scope.enq=data;
			$('#enquiryModal').modal('show');
			
		}

		 $scope.search_enquiries=function(search_text){
			 $http.post("Admin/Lead_Controller/search_enquiries?search_text="+search_text).success(function(data){
	            console.log(data);
				show_enquiry_data(data);
	         });
		 }
		
		
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);


