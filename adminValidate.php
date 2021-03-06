<?php
/*==============================================================================
 * (C) Copyright 2016 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: Functions to validate Admin operations (i.e. check permissions
 * 				parameters, timing, etc.)
 *----------------------------------------------------------------------------
 * Modification History
 * 2016-04-05 JJK 	Added check for AddAssessments 
 *============================================================================*/

include 'commonUtil.php';
// Include table record classes and db connection parameters
include 'hoaDbCommon.php';

$currTimestampStr = date("Y-m-d H:i:s");
//JJK test, date = 2015-04-22 19:45:09

$adminRec = new AdminRec();
$adminRec->result = "Not Valid";
$adminRec->message = "";

$action = getParamVal("action");
$FY = getParamVal("FY");
$duesAmt = strToUSD(getParamVal("duesAmt"));

$adminLevel = getAdminLevel();

if ($action == "AddAssessments") {
	if ($adminLevel < 2) {
		$adminRec->message = "You do not have permissions to Add Assessments.";
		$adminRec->result = "Not Valid";
	} else {
		$adminRec->message = "Are you sure you want to add assessment for Fiscal Year " . $FY . ' with Dues Amount of $' . $duesAmt .'?';
		$adminRec->result = "Valid";
	}
} else if ($action == "DuesNotices") {
	if ($adminLevel < 2) {
		$adminRec->message = "You do not have permissions to generate Dues Notices.";
		$adminRec->result = "Not Valid";
	} else {
		$adminRec->message = "Continue with creation of Yearly Dues Notices?";
		$adminRec->result = "Valid";
	}	
} else if ($action == "DuesRank") {
		$adminRec->message = "Continue with Unpaid Dues Ranking?";
		$adminRec->result = "Valid";
} else if ($action == "DuesEmails") {
	if ($adminLevel < 2) {
		$adminRec->message = "You do not have permissions to email Dues Notices.";
		$adminRec->result = "Not Valid";
	} else {
		$adminRec->message = "Continue with email of Yearly Dues Notices?";
		$adminRec->result = "Valid";
	}
}
/*
	$conn = getConn();
	$hoaSalesReportRec = getHoaSalesRecList($conn,$notProcessedBoolean);

	*** if you need data from the database to validation admin action
	
	// Close db connection
	$conn->close();
	*/

	echo json_encode($adminRec);
?>
