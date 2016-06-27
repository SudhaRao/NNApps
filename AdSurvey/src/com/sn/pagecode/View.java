package com.sn.pagecode;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.naming.InitialContext;
import javax.sql.DataSource;


@ManagedBean(name="pc_view")
@SessionScoped
public class View {
	private String selectedStore = null;
	private String bookingNum = "";
	private String department = "";
	private static List <ViewItemsInfoBean> dealItemList = null;
	

	protected static ViewItemsInfoBean viewItemsInfoBean;
	
	public ViewItemsInfoBean getViewItemsInfoBean() {
		return viewItemsInfoBean;
	}

	public void setViewItemsInfoBean(ViewItemsInfoBean viewItemsInfoBean) {
		this.viewItemsInfoBean = viewItemsInfoBean;
	}
	
	
	public List<ViewItemsInfoBean> getDealItemList() {
		return dealItemList;
	}

	public void setDealItemList(List<ViewItemsInfoBean> dealItemList) {
		this.dealItemList = dealItemList;
	}

	public String enterPage() {
		FacesContext fc = FacesContext.getCurrentInstance();
		getParameters(fc);
		System.out.println("enterPage View selectedStore = " + selectedStore);
		try {
			getAllDealItemsList();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return "adSurveyView";
	}
	
	// get value from "f:param"
	public void getParameters(FacesContext fc) {
		Map<String,String> params = fc.getExternalContext().getRequestParameterMap();
		selectedStore = params.get("selectedStoreParam");
		System.out.println("selectedStore from View = " + selectedStore);
		bookingNum = params.get("bookingNumParam");
		System.out.println("bookingNum from View = " + bookingNum);
		department = params.get("departmentParam");
		System.out.println("department from View = " + department);
		
		return;
		
	}
	
	
	/*Need to get the query and implement----for later*/
	/*public void getDealItemsListByDept(FacesContext fc) {
		Map<String,String> params = fc.getExternalContext().getRequestParameterMap();
		selectedStore = params.get("selectedStoreParam");
		System.out.println("selectedStore from View = " + selectedStore);
		bookingNum = params.get("bookingNumParam");
		System.out.println("bookingNum from View = " + bookingNum);
		department = params.get("departmentParam");
		System.out.println("department from View = " + department);
		
		return;
		
	}*/
	
	
	private static Connection getConnection() throws Exception {
		InitialContext ic = new InitialContext();
		String jndiValue = "jdbc/wagtest";
		DataSource ds = (DataSource) ic.lookup(jndiValue);
		Connection conn = ds.getConnection();
		System.out.println("Found DataSource = " + jndiValue);
		
		return conn;
	}
	
	
	
	
	
	private static List<ViewItemsInfoBean> getAllDealItemsList() throws Exception {		
		
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		
		dealItemList = new ArrayList <ViewItemsInfoBean> ();
		
		
		String sql = " SELECT ITEM_NBR, ITEM_UPC_CD, ITEM_DESC, DEAL_ID, AD_POSITION_DESC, AD_SRP_QTY, AD_SRP_MULT_QTY, CASE_PACK_QTY, CASE_UPC_CD, CATALOG_PRC_AMT,"+
         " CPN_MULT_QTY, CPN_VAL_QTY, NET_CS_PRC_AMT, OFF_INV_AMT, OTHER_ALLOW_AMT, OTHER_ALLOW_DESC, RPA_AMT, UNIT_PRC_AMT, UNIT_SCAN_AMT, GROSS_PROFIT_AMT,"+
         " BUYABLE_FLG, INV_AVAILABLE_QTY, MAX_ORDER_QTY, MIN_ORDER_QTY, SRP_MULTIPLE_QTY, UNIT_SIZE, UOM_CD, UNIT_SRP_MSR,  CREATE_USER_ID, CREATE_TMSP,"+
         " UPDATE_USER_ID,  UPDATE_TMSP,  AUDIT_SOURCE_ID FROM  NASHNET.DEAL_ITEM WHERE deal_id in (Select deal_id from NASHNET.DEAL ) ";
         //+ " where BOOKING_NBR='65617' AND DEAL_DEPT_CD = '1002' AND MKTG_GROUP_NAME='LOIndAll' ) ";
     
		System.out.println("Deal sql = " + sql);
		
		try{
			conn = getConnection();	
			System.out.println("Connection = " + conn);
		
			if(conn != null) {
				ps = conn.prepareStatement(sql);
				rs = ps.executeQuery();
				
				System.out.println("Result Set = " + rs.next());
				
				while(rs.next()) {
					
					
					viewItemsInfoBean = new ViewItemsInfoBean();					
					viewItemsInfoBean.setDealId(rs.getString("DEAL_ID"));	
					viewItemsInfoBean.setItemNbr(rs.getString("ITEM_NBR"));
					viewItemsInfoBean.setItemDesc(rs.getString("ITEM_DESC"));
					
					
					System.out.println("Deal ID : "+ viewItemsInfoBean.getDealId());
					System.out.println("Item Number : "+ viewItemsInfoBean.getItemNbr());
					System.out.println("Item Desc : "+ viewItemsInfoBean.getItemDesc());
					
					//store all data into a List
					dealItemList.add(viewItemsInfoBean);
				
			    }
			}
		} catch (SQLException e) {
			
			if (rs != null) {
				rs.close();
			}
			if (ps != null) {
				ps.close();
			}if(conn != null){
				conn.close();
			}
			
			e.printStackTrace();
			throw new Exception ("Exception Message = " + e.getMessage() +  " when trying to process sql: " + sql);
		}
		return dealItemList;
		
	}

	public String getSelectedStore() {
		return selectedStore;
	}

	public void setSelectedStore(String selectedStore) {
		this.selectedStore = selectedStore;
	}

	public String getBookingNum() {
		return bookingNum;
	}

	public void setBookingNum(String bookingNum) {
		this.bookingNum = bookingNum;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

}
