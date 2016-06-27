package com.sn.pagecode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class ViewItemsInfoBean  implements Serializable {


	private static final long serialVersionUID = 1L;


	private String adPositionDesc;
	private int adSrpMultQty;
	private String adSrpQty;
	private String auditSourceId;
	private String buyableFlg;
	private int casePackQty;
	private String caseUpcCd;
	private BigDecimal catalogPrcAmt;
	private int cpnMultQty;
	private int cpnValQty;
	private Timestamp createTmsp;
	private String createUserId;
	private String dealId;
	private BigDecimal grossProfitAmt;
	private int invAvailableQty;
	private String itemDesc;
	private String itemNbr;
	private String itemUpcCd;
	private int maxOrderQty;
	private int minOrderQty;
	private BigDecimal netCsPrcAmt;
	private BigDecimal offInvAmt;
	private BigDecimal otherAllowAmt;
	private String otherAllowDesc;
	private BigDecimal rpaAmt;
	private int srpMultipleQty;
	private BigDecimal unitPrcAmt;
	private BigDecimal unitScanAmt;
	private String unitSize;
	private int unitSrpMsr;
	private String uomCd;
	private Timestamp updateTmsp;
	private String updateUserId;

	public ViewItemsInfoBean() {
	}

	public String getAdPositionDesc() {
		return this.adPositionDesc;
	}

	public void setAdPositionDesc(String adPositionDesc) {
		this.adPositionDesc = adPositionDesc;
	}

	public int getAdSrpMultQty() {
		return this.adSrpMultQty;
	}

	public void setAdSrpMultQty(int adSrpMultQty) {
		this.adSrpMultQty = adSrpMultQty;
	}

	public String getAdSrpQty() {
		return this.adSrpQty;
	}

	public void setAdSrpQty(String adSrpQty) {
		this.adSrpQty = adSrpQty;
	}

	public String getAuditSourceId() {
		return this.auditSourceId;
	}

	public void setAuditSourceId(String auditSourceId) {
		this.auditSourceId = auditSourceId;
	}

	public String getBuyableFlg() {
		return this.buyableFlg;
	}

	public void setBuyableFlg(String buyableFlg) {
		this.buyableFlg = buyableFlg;
	}

	public int getCasePackQty() {
		return this.casePackQty;
	}

	public void setCasePackQty(int casePackQty) {
		this.casePackQty = casePackQty;
	}

	public String getCaseUpcCd() {
		return this.caseUpcCd;
	}

	public void setCaseUpcCd(String caseUpcCd) {
		this.caseUpcCd = caseUpcCd;
	}

	public BigDecimal getCatalogPrcAmt() {
		return this.catalogPrcAmt;
	}

	public void setCatalogPrcAmt(BigDecimal catalogPrcAmt) {
		this.catalogPrcAmt = catalogPrcAmt;
	}

	public int getCpnMultQty() {
		return this.cpnMultQty;
	}

	public void setCpnMultQty(int cpnMultQty) {
		this.cpnMultQty = cpnMultQty;
	}

	public int getCpnValQty() {
		return this.cpnValQty;
	}

	public void setCpnValQty(int cpnValQty) {
		this.cpnValQty = cpnValQty;
	}

	public Timestamp getCreateTmsp() {
		return this.createTmsp;
	}

	public void setCreateTmsp(Timestamp createTmsp) {
		this.createTmsp = createTmsp;
	}

	public String getCreateUserId() {
		return this.createUserId;
	}

	public void setCreateUserId(String createUserId) {
		this.createUserId = createUserId;
	}

	public String getDealId() {
		return this.dealId;
	}

	public void setDealId(String string) {
		this.dealId = string;
	}

	public BigDecimal getGrossProfitAmt() {
		return this.grossProfitAmt;
	}

	public void setGrossProfitAmt(BigDecimal grossProfitAmt) {
		this.grossProfitAmt = grossProfitAmt;
	}

	public int getInvAvailableQty() {
		return this.invAvailableQty;
	}

	public void setInvAvailableQty(int invAvailableQty) {
		this.invAvailableQty = invAvailableQty;
	}

	public String getItemDesc() {
		return this.itemDesc;
	}

	public void setItemDesc(String itemDesc) {
		this.itemDesc = itemDesc;
	}

	public String getItemNbr() {
		return this.itemNbr;
	}

	public void setItemNbr(String itemNbr) {
		this.itemNbr = itemNbr;
	}

	public String getItemUpcCd() {
		return this.itemUpcCd;
	}

	public void setItemUpcCd(String itemUpcCd) {
		this.itemUpcCd = itemUpcCd;
	}

	public int getMaxOrderQty() {
		return this.maxOrderQty;
	}

	public void setMaxOrderQty(int maxOrderQty) {
		this.maxOrderQty = maxOrderQty;
	}

	public int getMinOrderQty() {
		return this.minOrderQty;
	}

	public void setMinOrderQty(int minOrderQty) {
		this.minOrderQty = minOrderQty;
	}

	public BigDecimal getNetCsPrcAmt() {
		return this.netCsPrcAmt;
	}

	public void setNetCsPrcAmt(BigDecimal netCsPrcAmt) {
		this.netCsPrcAmt = netCsPrcAmt;
	}

	public BigDecimal getOffInvAmt() {
		return this.offInvAmt;
	}

	public void setOffInvAmt(BigDecimal offInvAmt) {
		this.offInvAmt = offInvAmt;
	}

	public BigDecimal getOtherAllowAmt() {
		return this.otherAllowAmt;
	}

	public void setOtherAllowAmt(BigDecimal otherAllowAmt) {
		this.otherAllowAmt = otherAllowAmt;
	}

	public String getOtherAllowDesc() {
		return this.otherAllowDesc;
	}

	public void setOtherAllowDesc(String otherAllowDesc) {
		this.otherAllowDesc = otherAllowDesc;
	}

	public BigDecimal getRpaAmt() {
		return this.rpaAmt;
	}

	public void setRpaAmt(BigDecimal rpaAmt) {
		this.rpaAmt = rpaAmt;
	}

	public int getSrpMultipleQty() {
		return this.srpMultipleQty;
	}

	public void setSrpMultipleQty(int srpMultipleQty) {
		this.srpMultipleQty = srpMultipleQty;
	}

	public BigDecimal getUnitPrcAmt() {
		return this.unitPrcAmt;
	}

	public void setUnitPrcAmt(BigDecimal unitPrcAmt) {
		this.unitPrcAmt = unitPrcAmt;
	}

	public BigDecimal getUnitScanAmt() {
		return this.unitScanAmt;
	}

	public void setUnitScanAmt(BigDecimal unitScanAmt) {
		this.unitScanAmt = unitScanAmt;
	}

	public String getUnitSize() {
		return this.unitSize;
	}

	public void setUnitSize(String unitSize) {
		this.unitSize = unitSize;
	}

	public int getUnitSrpMsr() {
		return this.unitSrpMsr;
	}

	public void setUnitSrpMsr(int unitSrpMsr) {
		this.unitSrpMsr = unitSrpMsr;
	}

	public String getUomCd() {
		return this.uomCd;
	}

	public void setUomCd(String uomCd) {
		this.uomCd = uomCd;
	}

	public Timestamp getUpdateTmsp() {
		return this.updateTmsp;
	}

	public void setUpdateTmsp(Timestamp updateTmsp) {
		this.updateTmsp = updateTmsp;
	}

	public String getUpdateUserId() {
		return this.updateUserId;
	}

	public void setUpdateUserId(String updateUserId) {
		this.updateUserId = updateUserId;
	}

}
