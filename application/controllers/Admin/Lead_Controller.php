 <?php
error_reporting(0);
class Lead_Controller extends CI_Controller {


    public function __construct()
  {
    parent::__construct();
	$this->load->model('Admin/LeadModel');
     
   }
   
   public function index()
	{

		
    }
    
    public function get_lead(){ 
   
   $data=$this->LeadModel->get_lead();
		echo json_encode($data);
    
    }
    
    public function get_detaillead(){
    
    $info=json_decode($this->input->get('data'));
        
     $data=$this->LeadModel->get_detaillead($info);
    echo json_encode($data);
    }
	
    public function search(){
    
     $info=json_decode($this->input->get('data'));
         $data=$this->LeadModel->search($info);
     echo json_encode($data);
    
    }
    public function get_single_lead_data(){
	  $userid=$this->input->get('user_id');
	  $data=$this->LeadModel->get_single_lead_data($userid);
		echo json_encode($data);
	}
	
	public function get_enquiry_list(){
		$data=$this->LeadModel->get_enquiry_list();
       echo json_encode($data);
	}
	
   public function search_enquiries(){
	   $search_text=$this->input->get('search_text');
	  $data=$this->LeadModel->search_enquiries($search_text);
		echo json_encode($data);
   }
   
    public function delete_enquiry(){
	   $eid=$this->input->get('eid');
	  $this->LeadModel->delete_enquiry($eid);
		
   }
    
   
    
}