<?php
/*==============================================================================
 * (C) Copyright 2015 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: 
 *----------------------------------------------------------------------------
 * Modification History
 * 2015-03-06 JJK 	Initial version to get data 
 * 2015-03-24 JJK	Included credentials files 
 *============================================================================*/

// Include db connection credentials
include 'hoaDbCred.php';
//$host = '127.0.0.1';
//$username = "root";
//$password = "";
//$dbname = "<name of the mysql database>";

class HoaRec
{
  	public $Parcel_ID;
  	public $LotNo;
  	public $SubDivParcel;
  	public $Parcel_Location;
  	public $Property_Street_No;
  	public $Property_Street_Name;
  	public $Property_City;
  	public $Property_State;
  	public $Property_Zip;
  	public $Member;
  	public $Vacant;
  	public $Rental;
  	public $Managed;
  	public $Foreclosure;
  	public $Bankruptcy;
  	public $Liens_2B_Released;
  	public $Comments;
	
	public $ownersList;
	public $assessmentsList;
}

class HoaOwnerRec
{
	public $OwnerID;
  	public $Parcel_ID;
  	public $CurrentOwner;
 	public $Owner_Name1;
  	public $Owner_Name2;
  	public $DatePurchased;
  	public $Mailing_Name;
  	public $AlternateMailing;
  	public $Alt_Address_Line1;
  	public $Alt_Address_Line2;
  	public $Alt_City;
  	public $Alt_State;
  	public $Alt_Zip;
  	public $Owner_Phone;
  	public $Comments;
  	public $EntryTimestamp;
  	public $UpdateTimestamp;
}

class HoaAssessmentRec
{
  	public $OwnerID;
  	public $Parcel_ID;
  	public $FY;
  	public $DuesAmt;
  	public $DateDue;
  	public $Paid;
  	public $DatePaid;
  	public $PaymentMethod;
  	public $Comments;
}

class HoaPropertyRec
{
	public $parcelId;
	public $lotNo;
	public $subDivParcel;
	public $parcelLocation;
	public $ownerName;
	public $ownerPhone;
}

// Set 0 or 1 according to the boolean value of a string
function paramBoolVal($paramName) {
	$retBoolean = 0;
	if (strtolower(getParamVal($paramName)) == 'true') {
		$retBoolean = 1;
	}
	return $retBoolean;
}

function getParamVal($paramName) {
	$paramVal = "";
	if (isset($_REQUEST[$paramName])) {
		$paramVal = trim(urldecode($_REQUEST[$paramName]));
		// more input string cleanup ???  invalid characters?
	}
	return $paramVal;
}


function testMail($inStr) {
	$to = "somebody@example.com, somebodyelse@example.com";
	$subject = "HTML email";
	
	$message = '<html><head><title>HTML email</title></head><body>' . $inStr . '</body></html>';
	
	// Always set content-type when sending HTML email
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	
	// More headers
	$headers .= 'From: <webmaster@example.com>' . "\r\n";
	//$headers .= 'Cc: myboss@example.com' . "\r\n";
	
	mail($to,$subject,$message,$headers);
}



function getHoaRec($conn,$parcelId,$ownerId,$fy) {

	$hoaRec = new HoaRec();
	
	$stmt = $conn->prepare("SELECT * FROM hoa_properties WHERE Parcel_ID = ? ; ");
	$stmt->bind_param("s", $parcelId);
	$stmt->execute();
	$result = $stmt->get_result();
	
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$hoaRec->Parcel_ID = $row["Parcel_ID"];
			$hoaRec->LotNo = $row["LotNo"];
			$hoaRec->SubDivParcel = $row["SubDivParcel"];
			$hoaRec->Parcel_Location = $row["Parcel_Location"];
			$hoaRec->Property_Street_No = $row["Property_Street_No"];
			$hoaRec->Property_Street_Name = $row["Property_Street_Name"];
			$hoaRec->Property_City = $row["Property_City"];
			$hoaRec->Property_State = $row["Property_State"];
			$hoaRec->Property_Zip = $row["Property_Zip"];
			$hoaRec->Member = $row["Member"];
			$hoaRec->Vacant = $row["Vacant"];
			$hoaRec->Rental = $row["Rental"];
			$hoaRec->Managed = $row["Managed"];
			$hoaRec->Foreclosure = $row["Foreclosure"];
			$hoaRec->Bankruptcy = $row["Bankruptcy"];
			$hoaRec->Liens_2B_Released = $row["Liens_2B_Released"];
			$hoaRec->Comments = $row["Comments"];
	
			$hoaRec->ownersList = array();
			$hoaRec->assessmentsList = array();
		}
		$result->close();
		$stmt->close();
	
		if (empty($ownerId)) {
			$stmt = $conn->prepare("SELECT * FROM hoa_owners WHERE Parcel_ID = ? ORDER BY OwnerID DESC ; ");
			$stmt->bind_param("s", $parcelId);
		} else {
			$stmt = $conn->prepare("SELECT * FROM hoa_owners WHERE Parcel_ID = ? AND OwnerID = ? ORDER BY OwnerID DESC ; ");
			$stmt->bind_param("ss", $parcelId,$ownerId);
		}
		$stmt->execute();
		$result = $stmt->get_result();
	
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$hoaOwnerRec = new HoaOwnerRec();
				$hoaOwnerRec->OwnerID = $row["OwnerID"];
				$hoaOwnerRec->Parcel_ID = $row["Parcel_ID"];
				$hoaOwnerRec->CurrentOwner = $row["CurrentOwner"];
				$hoaOwnerRec->Owner_Name1 = $row["Owner_Name1"];
				$hoaOwnerRec->Owner_Name2 = $row["Owner_Name2"];
				$hoaOwnerRec->DatePurchased = $row["DatePurchased"];
				$hoaOwnerRec->Mailing_Name = $row["Mailing_Name"];
				$hoaOwnerRec->AlternateMailing = $row["AlternateMailing"];
				$hoaOwnerRec->Alt_Address_Line1 = $row["Alt_Address_Line1"];
				$hoaOwnerRec->Alt_Address_Line2 = $row["Alt_Address_Line2"];
				$hoaOwnerRec->Alt_City = $row["Alt_City"];
				$hoaOwnerRec->Alt_State = $row["Alt_State"];
				$hoaOwnerRec->Alt_Zip = $row["Alt_Zip"];
				$hoaOwnerRec->Owner_Phone = $row["Owner_Phone"];
				$hoaOwnerRec->Comments = $row["Comments"];
				$hoaOwnerRec->EntryTimestamp = $row["EntryTimestamp"];
				$hoaOwnerRec->UpdateTimestamp = $row["UpdateTimestamp"];
	
				array_push($hoaRec->ownersList,$hoaOwnerRec);
			}
		} // End of Owners
		$result->close();
		$stmt->close();
	
		if (empty($fy)) {
			$stmt = $conn->prepare("SELECT * FROM hoa_assessments WHERE Parcel_ID = ? ORDER BY FY DESC ; ");
			$stmt->bind_param("s", $parcelId);
		} else {
			$stmt = $conn->prepare("SELECT * FROM hoa_assessments WHERE Parcel_ID = ? AND FY = ? ORDER BY FY DESC ; ");
			$stmt->bind_param("ss", $parcelId,$fy);
		}
		$stmt->execute();
		$result = $stmt->get_result();
	
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$hoaAssessmentRec = new HoaAssessmentRec();
				$hoaAssessmentRec->OwnerID = $row["OwnerID"];
				$hoaAssessmentRec->Parcel_ID = $row["Parcel_ID"];
				$hoaAssessmentRec->FY = $row["FY"];
				$hoaAssessmentRec->DuesAmt = $row["DuesAmt"];
				$hoaAssessmentRec->DateDue = $row["DateDue"];
				$hoaAssessmentRec->Paid = $row["Paid"];
				$hoaAssessmentRec->DatePaid = $row["DatePaid"];
				$hoaAssessmentRec->PaymentMethod = $row["PaymentMethod"];
				$hoaAssessmentRec->Comments = $row["Comments"];
	
				array_push($hoaRec->assessmentsList,$hoaAssessmentRec);
			}
	
		} // End of Assessments
		$result->close();
		$stmt->close();
	
	} else {
		$result->close();
		$stmt->close();
	} // End of Properties
	
	return $hoaRec;
} // End of function getHoaRec($conn,$parcelId,$ownerId,$fy) {

?>