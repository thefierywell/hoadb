/*==============================================================================
 * (C) Copyright 2015,2016 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: 
 *----------------------------------------------------------------------------
 * Modification History
 * 2015-03-06 JJK 	Initial version 
 * 2015-03-26 JJK	Solved initial DetailPage checkbox display problem by
 * 					moving format after the pagecontainer change (instead of
 * 					before it.  Let the page initialize first, then fill it.
 * 2015-04-09 JJK   Added Regular Expressions and functions for validating
 * 					email addresses and replacing non-printable characters
 * 2015-08-03 JJK	Modified to put the data parameters on the "a" element
 * 					and only response to clicks to the anchor
 * 2015-09-08 JJK   Added GetSalesReport to show sales to HOA properties
 * 2015-09-25 JJK	Added adminLevel to HoaRec to control updates
 * 2015-09-30 JJK	Added Search button
 * 2015-10-01 JJK	Added Create New Owner functionality
 * 					add check to make sure current owner is set on new owners
 * 					and removed from others
 * 2016-02-09 JJK	Switching from JQuery Mobile to Twitter Bootstrap
 * 2016-02-21 JJK   Test new Git
 * 2016-02-26 JJK   Added search by Lot No and adjusted displays for mobile
 * 2016-04-03 JJK	Working on input fields
 * 2016-04-05 JJK   Adding Admin function for adding yearly dues assessments
 * 					Adding Liens
 * 2016-04-09 JJK   Adding Dues Statement calculation display logic
 * 2016-04-14 JJK   Adding Dues Report (working on csv and pdf downloads)
 * 2016-04-20 JJK   Completed test Dues Statement PDF
 * 2016-04-22 JJK	Finishing up reports (added formatDate and csvFilter)
 * 2016-04-30 JJK   Implemented initial payment button functionality if
 *  				only current year dues are owed
 *============================================================================*/

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

//var validEmailAddrRegExStr = "^((\"([ !#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]|\\\\[ !\"#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\\\\\]^_`a-z{|}~])*\"|([!#$%&'*+\\-/0-9=?A-Z^_`a-z{|}~]|\\\\[ !\"#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\\\\\]^_`a-z{|}~])+)(\\.(\"([ !#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]|\\\\[ !\"#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\\\\\]^_`a-z{|}~])*\"|([!#$%&'*+\\-/0-9=?A-Z^_`a-z{|}~]|\\\\[ !\"#$%&'()*+,\\-./0-9:;<=>?@A-Z[\\\\\\]^_`a-z{|}~])+))*)@([a-zA-Z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?)*\\.(?![0-9]*\\.?$)[a-zA-Z0-9]{2,}\\.?)$";
//var regex = new RegExp(validEmailAddrRegExStr,"g"); 
/*
if (regex.test(inStr)) {
	resultStr = '<b style="color:green;">VALID</b>';
} else {
	resultStr = '<b style="color:red;">INVALID</b>';
}
*/

//Non-Printable characters - Hex 01 to 1F, and 7F
var nonPrintableCharsStr = "[\x01-\x1F\x7F]";
//"g" global so it does more than 1 substitution
var regexNonPrintableChars = new RegExp(nonPrintableCharsStr,"g");

function cleanStr(inStr) {
	return inStr.replace(regexNonPrintableChars,'');
}

var commaHexStr = "[\x2C]";
var regexCommaHexStr = new RegExp(commaHexStr,"g");
function csvFilter(inVal) {
	return inVal.toString().replace(regexCommaHexStr,'');
}

//var.replace(/[^0-9]+\\.?[0-9]*/g, '');
/*
parseFloat()
//Non-Printable characters - Hex 01 to 1F, and 7F
var nonPrintableCharsStr = "[\x01-\x2D \x2F \x3A-\x7F]";
//"g" global so it does more than 1 substitution
var regexNonPrintableChars = new RegExp(nonPrintableCharsStr,"g");
function cleanStr(inStr) {
	return inStr.replace(regexNonPrintableChars,'');
}
*/



function formatDate(inDate) {
	var tempDate = inDate;
	if (tempDate == null) {
		tempDate = new Date();
	}
	var tempMonth = tempDate.getMonth() + 1;
	if (tempDate.getMonth() < 9) {
		tempMonth = '0' + (tempDate.getMonth() + 1);
	}
	var tempDay = tempDate.getDate();
	if (tempDate.getDate() < 10) {
		tempDay = '0' + tempDate.getDate();
	}
	return tempDate.getFullYear()+'-'+tempMonth+'-'+tempDay;
}


function waitCursor() {
    $('*').css('cursor', 'progress');
    $(".ajaxError").html("");
}

/*
commented out because it messed up the cursor in other functions - put it individually around JSON services
$(document).ajaxComplete(function(event, request, settings) {
    $('*').css('cursor', 'default');
});
*/

$(document).ajaxError(function(e, xhr, settings, exception) {
	console.log("ajax exception = "+exception);
	console.log("ajax exception xhr.responseText = "+xhr.responseText);
    $(".ajaxError").html("An Error has occurred (see console log)");
});

function setBoolText(inBool) {
	var outBoolStr = "NO";
	if (inBool) {
		outBoolStr = "YES";
	}
	return outBoolStr;
}
function setCheckbox(checkVal){
	var checkedStr = '';
	if (checkVal == 1) {
		checkedStr = 'checked=true';
	}
	return '<input type="checkbox" '+checkedStr+' disabled="disabled">';
}
function setCheckboxEdit(checkVal,idName){
	var checkedStr = '';
	if (checkVal == 1) {
		checkedStr = 'checked=true';
	}
	return '<input id="'+idName+'" type="checkbox" '+checkedStr+'>';
}
function setInputText(idName,textVal,textSize){
//	return '<div class="form-group"><input id="'+idName+'" type="text" class="form-control resetval" value="'+textVal+'" size="'+textSize+'" maxlength="'+textSize+'"></div>';
	return '<input id="'+idName+'" type="text" class="form-control input-sm resetval" value="'+textVal+'" size="'+textSize+'" maxlength="'+textSize+'">';
}
function setInputDate(idName,textVal,textSize){
	//return '<input id="'+idName+'" type="text" class="Date form-control" value="'+textVal+'" size="'+textSize+'" maxlength="'+textSize+'" placeholder="YYYY-MM-DD">';
	return '<input id="'+idName+'" type="text" class="form-control input-sm Date" value="'+textVal+'" size="'+textSize+'" maxlength="'+textSize+'" placeholder="YYYY-MM-DD">';
}
function setSelectOption(optVal,displayVal,selected,bg) {
	var outOpt = '';
	if (selected) {
		outOpt = '<option class="'+bg+'" value="'+optVal+'" selected>'+displayVal+'</option>';
	} else {
		outOpt = '<option class="'+bg+'" value="'+optVal+'">'+displayVal+'</option>';
	}
	return outOpt;
}

$(document).ready(function(){
	//$("#DisplayWidth").text("width = "+$(window).width());

	// Auto-close the collapse menu after clicking a non-dropdown menu item (in the bootstrap nav header)
	$(document).on('click','.navbar-collapse.in',function(e) {
	    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
	        $(this).collapse('hide');
	    }
	});

    // Using addClear plug-in function to add a clear button on input text fields
	$(".resetval").addClear();

    $(".Date").datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });

    // When the javascript initializes do a one time get of the logo image data (for PDF writes)
	$.get("getLogoImgData.php",function(logoImgDataResults){
		pdfLogoImgData = logoImgDataResults;
	});

    
    // Respond to any change in values and call service
    $("#SearchInput").change(function() {
        waitCursor();
        $("#PropertyListDisplay tbody").html("");
    	// Get the list
    	$.getJSON("getHoaPropertiesList.php","parcelId="+cleanStr($("#parcelId").val())+
											"&lotNo="+cleanStr($("#lotNo").val())+
											//"&checkNo="+cleanStr($("#checkNo").val())+
    										"&address="+cleanStr($("#address").val())+
    										"&ownerName="+cleanStr($("#ownerName").val())+
    										"&phoneNo="+cleanStr($("#phoneNo").val())+
    										"&altAddress="+cleanStr($("#altAddress").val()),function(hoaPropertyRecList){
    	    $('*').css('cursor', 'default');
    		displayPropertyList(hoaPropertyRecList);
    	});
        event.stopPropagation();
    });

    // Respond to the Search button click (because I can't figure out how to combine it with input change)
    $(document).on("click","#SearchButton",function(){
        waitCursor();
        $("#PropertyListDisplay tbody").html("");
    	// Get the list
    	$.getJSON("getHoaPropertiesList.php","parcelId="+cleanStr($("#parcelId").val())+
    										"&lotNo="+cleanStr($("#lotNo").val())+
    										//"&checkNo="+cleanStr($("#checkNo").val())+
    										"&address="+cleanStr($("#address").val())+
    										"&ownerName="+cleanStr($("#ownerName").val())+
    										"&phoneNo="+cleanStr($("#phoneNo").val())+
    										"&altAddress="+cleanStr($("#altAddress").val()),function(hoaPropertyRecList){
    	    $('*').css('cursor', 'default');
    		displayPropertyList(hoaPropertyRecList);
    	});
        event.stopPropagation();
    });

    
    // Respond to clicking on a property by reading details and display on detail tab
    $(document).on("click","#PropertyListDisplay tr td a",function(){
        waitCursor();
        $("#PropertyDetail tbody").html("");
    	$("#PropertyOwners tbody").html("");
        $("#PropertyAssessments tbody").html("");
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-parcelId"),function(hoaRec){
        	formatPropertyDetailResults(hoaRec);
    	    $('*').css('cursor', 'default');
	        $('#navbar a[href="#DetailPage"]').tab('show');
        });
    });

    // Response to Detail link clicks
	// *** 8/3/2015 fix so it only reacts to the clicks on the property one
    $(document).on("click","#PropertyDetail tr td a",function(){
        waitCursor();
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId"),function(hoaRec){
            formatPropertyDetailEdit(hoaRec);
    	    $('*').css('cursor', 'default');
            $("#EditPage").modal();
        });
    });	

    $(document).on("click","#PropertyOwners tr td a",function(){
        waitCursor();
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId")+"&ownerId="+$this.attr("data-OwnerId"),function(hoaRec){
    		createNew = false;
            formatOwnerDetailEdit(hoaRec,createNew);
    	    $('*').css('cursor', 'default');
            $("#EditPage").modal();
        });
    });	

    $(document).on("click","#DuesStatementButton",function(){
        waitCursor();
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId")+"&ownerId="+$this.attr("data-OwnerId"),function(hoaRec){
        	//console.log("Format Dues Statement, parcel = "+$this.attr("data-ParcelId"));
            formatDuesStatementResults(hoaRec);
    	    $('*').css('cursor', 'default');
            $("#DuesStatementPage").modal();
        });
    });	
    
	$(document).on("click","#DownloadDuesStatementPDF",function(){
	    var $this = $(this);
		pdf.save(formatDate()+"-"+$this.attr("data-pdfName")+".pdf");
	});	
    
    $(document).on("click","#NewOwnerButton",function(){
        waitCursor();
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId")+"&ownerId="+$this.attr("data-OwnerId"),function(hoaRec){
    		createNew = true;
            formatOwnerDetailEdit(hoaRec,createNew);
    	    $('*').css('cursor', 'default');
            $("#EditPage").modal();
        });
    });	
	
    $(document).on("click","#PropertyAssessments tr td a",function(){
        waitCursor();
        var $this = $(this);
        $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId")+"&fy="+$this.attr("data-FY"),function(hoaRec){
            formatAssessmentDetailEdit(hoaRec);
    	    $('*').css('cursor', 'default');
            $("#EditPage").modal();
        });
    });	
    

	// Functions for EditPage - respond to requests for update
	$(document).on("click","#SavePropertyEdit",function(){
        waitCursor();
    	
        var $this = $(this);
        var $parcelId = $this.attr("data-parcelId");
        var $memberBoolean = $("#MemberCheckbox").is(":checked");
        var $vacantBoolean = $("#VacantCheckbox").is(":checked");
        var $rentalBoolean = $("#RentalCheckbox").is(":checked");
        var $managedBoolean = $("#ManagedCheckbox").is(":checked");
        var $foreclosureBoolean = $("#ForeclosureCheckbox").is(":checked");
        var $bankruptcyBoolean = $("#BankruptcyCheckbox").is(":checked");
        var $liensBoolean = $("#LiensCheckbox").is(":checked");

        //$.getJSON("updHoaDbData.php","parcelId="+$this.attr("data-parcelId"),function(hoaRec){
        $.get("updHoaProperty.php","parcelId="+$parcelId+
        						 "&memberBoolean="+$memberBoolean+
        						 "&vacantBoolean="+$vacantBoolean+
        						 "&rentalBoolean="+$rentalBoolean+
        						 "&managedBoolean="+$managedBoolean+
        						 "&foreclosureBoolean="+$foreclosureBoolean+
        						 "&bankruptcyBoolean="+$bankruptcyBoolean+
        						 "&liensBoolean="+$liensBoolean+
        						 "&propertyComments="+cleanStr($("#PropertyComments").val()),function(results){
        	
        	// Re-read the updated data for the Detail page display
            $.getJSON("getHoaDbData.php","parcelId="+$parcelId,function(hoaRec){
                formatPropertyDetailResults(hoaRec);
   	    	    $('*').css('cursor', 'default');
                $("#EditPage").modal("hide");
   	         	$('#navbar a[href="#DetailPage"]').tab('show');
            });
        }); // End of $.get("updHoaDbData.php","parcelId="+$parcelId+
    });	// End of $(document).on("click","#SavePropertyEdit",function(){

    $(document).on("click","#SaveOwnerEdit",function(){
        waitCursor();
        var $this = $(this);
        var $parcelId = $this.attr("data-parcelId");
        var $ownerId = $this.attr("data-OwnerId");

        //var $currentOwnerBoolean = $("#CurrentOwnerCheckbox").is(":checked");
        var $alternateMailingBoolean = $("#AlternateMailingCheckbox").is(":checked");

        $.get("updHoaOwner.php","parcelId="+$parcelId+
        						 "&ownerId="+$ownerId+
        						 //"&currentOwnerBoolean="+$currentOwnerBoolean+
        						 "&ownerName1="+cleanStr($("#OwnerName1").val())+
        						 "&ownerName2="+cleanStr($("#OwnerName2").val())+
        						 "&datePurchased="+cleanStr($("#DatePurchased").val())+
        						 "&mailingName="+cleanStr($("#MailingName").val())+
           						 "&alternateMailingBoolean="+$alternateMailingBoolean+
           						 "&addrLine1="+cleanStr($("#AddrLine1").val())+
        						 "&addrLine2="+cleanStr($("#AddrLine2").val())+
        						 "&altCity="+cleanStr($("#AltCity").val())+
        						 "&altState="+cleanStr($("#AltState").val())+
        						 "&altZip="+cleanStr($("#AltZip").val())+
        						 "&ownerPhone="+cleanStr($("#OwnerPhone").val())+
        						 "&ownerComments="+cleanStr($("#OwnerComments").val()),function(results){

        	// Re-read the updated data for the Detail page display
            $.getJSON("getHoaDbData.php","parcelId="+$parcelId,function(hoaRec){
                formatPropertyDetailResults(hoaRec);
   	    	    $('*').css('cursor', 'default');
                $("#EditPage").modal("hide");
   	         	$('#navbar a[href="#DetailPage"]').tab('show');
            });
        }); // End of $.get("updHoaDbData.php","parcelId="+$parcelId+
    });	// End of $(document).on("click","#SaveOwnerEdit",function(){

    $(document).on("click","#SaveAssessmentEdit",function(){
        waitCursor();
        var $this = $(this);
        var $parcelId = $this.attr("data-parcelId");
        //var $ownerId = $this.attr("data-OwnerId");
        var $fy = $this.attr("data-FY");
        var $paidBoolean = $("#PaidCheckbox").is(":checked");
        var $lienBoolean = $("#LienCheckbox").is(":checked");
        var $stopInterestCalcBoolean = $("#StopInterestCalcCheckbox").is(":checked");

        $.get("updHoaAssessment.php","parcelId="+$parcelId+
				 					 "&fy="+$fy+
				 					 "&ownerId="+cleanStr($("#OwnerID").val())+
				 					 "&duesAmount="+cleanStr($("#DuesAmount").val())+
				 					 "&dateDue="+cleanStr($("#DateDue").val())+
				 					 "&paidBoolean="+$paidBoolean+
				 					 "&datePaid="+cleanStr($("#DatePaid").val())+
				 					 "&paymentMethod="+cleanStr($("#PaymentMethod").val())+
				 					 "&assessmentsComments="+cleanStr($("#AssessmentsComments").val())+
				 					 "&lienBoolean="+$lienBoolean+
				 					 "&lienRefNo="+cleanStr($("#LienRefNo").val())+
				 					 "&dateFiled="+cleanStr($("#DateFiled").val())+
				 					 "&disposition="+cleanStr($("#Disposition").val())+
				 					 "&filingFee="+cleanStr($("#FilingFee").val())+
				 					 "&releaseFee="+cleanStr($("#ReleaseFee").val())+
				 					 "&dateReleased="+cleanStr($("#DateReleased").val())+
				 					 "&lienDatePaid="+cleanStr($("#LienDatePaid").val())+
				 					 "&amountPaid="+cleanStr($("#AmountPaid").val())+
				 					 "&stopInterestCalcBoolean="+$stopInterestCalcBoolean+
				 					 "&filingFeeInterest="+cleanStr($("#FilingFeeInterest").val())+
				 					 "&assessmentInterest="+cleanStr($("#AssessmentInterest").val())+
				 					 "&lienComment="+cleanStr($("#LienComment").val()),function(results){

        	// Re-read the updated data for the Detail page display
            $.getJSON("getHoaDbData.php","parcelId="+$parcelId,function(hoaRec){
                formatPropertyDetailResults(hoaRec);
   	    	    $('*').css('cursor', 'default');
                $("#EditPage").modal("hide");
   	         	$('#navbar a[href="#DetailPage"]').tab('show');
            });
        }); // End of $.get("updHoaDbData.php","parcelId="+$parcelId+

    });	// End of $(document).on("click","#SaveAssessmentEdit",function(){


    // Report requests
	$(document).on("click",".reportRequest",function(){
        waitCursor();
    	var $this = $(this);
    	var reportName = $this.attr('id');
        //var onscreenDisplay = $('#onscreenDisplay').is(':checked');
        //var csvDownload = $('#csvDownload').is(':checked');
        //var pdfDownload = $('#pdfDownload').is(':checked');
        //var reportYear = $('#ReportYear').val();
            
        $("#ReportHeader").html("");
		$("#ReportListDisplay tbody").html("");
		$("#ReportRecCnt").html("");
		$("#ReportDownloadLinks").html("");
		
    	$.getJSON("getHoaReportData.php","reportName="+reportName,function(reportList){
    	    formatReportList(reportName,$this.attr('data-reportTitle'),reportList);
    	    $('*').css('cursor', 'default');
    	});
        event.stopPropagation();
    });

	$(document).on("click","#DownloadReportCSV",function(){
	    var $this = $(this);
		var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
		var pom = document.createElement('a');
		var url = URL.createObjectURL(blob);
		pom.href = url;
		pom.setAttribute('download', $this.attr("data-reportName")+".csv");
		pom.click();
	});	

	$(document).on("click","#DownloadReportPDF",function(){
	    var $this = $(this);
		pdf.save($this.attr("data-reportName")+".pdf");
	});	

	$(document).on("click",".SalesNewOwnerProcess",function(){
	    waitCursor();
	    var $this = $(this);
	    $.getJSON("getHoaDbData.php","parcelId="+$this.attr("data-ParcelId")+"&saleDate="+$this.attr("data-SaleDate"),function(hoaRec){
	    	formatOwnerDetailEdit(hoaRec,true);
	    	$('*').css('cursor', 'default');
	    	$("#EditPage").modal();
	    });
	});

	$(document).on("click",".SalesNewOwnerIgnore",function(){
	    waitCursor();
	    var $this = $(this);
	    var $parcelId = $this.attr("data-ParcelId");
	    var $saleDate = $this.attr("data-SaleDate");

	    $.get("updHoaSales.php","PARID="+$parcelId+"&SALEDT="+$saleDate,function(results){
	    	// Re-read the update data and re-display sales list
	    	
	    	var reportName = "SalesNewOwnerReport";
	        var onscreenDisplay = $('#onscreenDisplay').is(':checked');
	        var csvDownload = $('#csvDownload').is(':checked');
	        var pdfDownload = $('#pdfDownload').is(':checked');
	        var reportYear = $('#ReportYear').val();

			$("#ReportListDisplay tbody").html("");
			$("#ReportRecCnt").html("");
			$("#ReportDownloadLinks").html("");
			
	    	$.getJSON("getHoaReportData.php","reportName="+reportName+
	    										"&reportYear="+reportYear,function(reportList){
	    	    formatReportList(reportName,reportList,onscreenDisplay,csvDownload,pdfDownload);
	    	    $('*').css('cursor', 'default');
	    	});
	    });
        event.stopPropagation();
	});
	

	// Meeting minutes experiment
	/*
	$('#summernote').summernote();

	$.get("getFile.php","",function(response){
		$('#summernote').code(response);
	});
	*/
	
	//$('.summernote').summernote({
	/*
	$('#summernote').summernote({
		  height: 300,                 // set editor height

		  minHeight: null,             // set minimum height of editor
		  maxHeight: null,             // set maximum height of editor

		  focus: true,                 // set focus to editable area after initializing summernote
	});
	*/
	
	/*
	Get the HTML contents of the first summernote in the set of matched elements.

	var sHTML = $('.summernote').code();
	Get the HTML content of the second summernote with jQuery eq.

	var sHTML = $('.summernote').eq(1).code();
	A string of HTML to set as the content of each matched element.

	$('.summernote').code(sHTML);
	*/

    $(document).on("click",".AdminButton",function(){
        waitCursor();
	    var $this = $(this);

        // Validate add assessments (check access permissions, timing, year, and amount)
        // get confirmation message back
        var FY = cleanStr($("#FiscalYear").val());
        var duesAmt = cleanStr($("#DuesAmt").val());
        
    	$.getJSON("adminValidate.php","action="+$this.attr('id')+
    										"&FY="+FY+
    										"&duesAmt="+duesAmt,function(adminRec){
    	    $("#ConfirmationMessage").html(adminRec.message);
    	    
    	    var confirmationButton = $("#ConfirmationButton");
    	    confirmationButton.empty();
    	    var buttonForm = $('<form>').prop('class',"form-inline").attr('role',"form");
    	    // If the action was Valid, append an action button
    	    if (adminRec.result == "Valid") {
        	    buttonForm.append($('<button>').prop('id',"AdminExecute").prop('class',"btn btn-danger").attr('type',"button").attr('data-dismiss',"modal").html('Continue')
	    								.attr('data-action',$this.attr('id')).attr('data-FY',FY).attr('data-duesAmt',duesAmt));
    	    }
    	    buttonForm.append($('<button>').prop('class',"btn btn-default").attr('type',"button").attr('data-dismiss',"modal").html('Close'));
    	    confirmationButton.append(buttonForm);
    	    
    	    $('*').css('cursor', 'default');
            $("#ConfirmationModal").modal();
    	});
        event.stopPropagation();
    });

    // Respond to the Continue click for an Admin Execute function 
    $(document).on("click","#AdminExecute",function(){
        var $this = $(this);
        waitCursor();
        
        var action = $this.attr("data-action");
        // dues and add


    	$.getJSON("adminExecute.php","action="+action+
    										"&FY="+$this.attr("data-FY")+
    										"&duesAmt="+$this.attr("data-duesAmt"),function(adminRec){
    	    $('*').css('cursor', 'default');
    	    $("#ResultMessage").html(adminRec.message);
    	    
    	    if (action == 'DuesStatements') {
    	        // Portrait, millimeters, A4 format
    	    	//var doc = new jsPDF('p', 'mm', 'a4');
    	    	var doc = new jsPDF('p', 'in', 'letter');
    	    	doc.setProperties({
    	    	    title: 'Test JJK Doc',
    	    	    subject: 'This is the subject',
    	    	    author: 'John Kauflin',
    	    	    keywords: 'generated, javascript, web 2.0, ajax',
    	    	    creator: 'MEEE'
    	    	});
    			doc.setFontSize(20);
    			doc.text(1, 1, "John K loves jsPDF");

    			var logoImgData = '';
    	    	$.get("getLogoImgData.php",function(logoImgData){
        		    var progress = $('<div>').prop('class',"progress");

        		    var recTotal = adminRec.hoaPropertyRecList.length;
            	    //console.log("adminRec.hoaPropertyRecList = "+adminRec.hoaPropertyRecList.length);
            	    var percentDone = 0;
            	    
            		$.each(adminRec.hoaPropertyRecList, function(index, hoaPropertyRec) {
            			/*
            		    tr +=    '<td><a data-parcelId="'+hoaPropertyRec.parcelId+'" href="#">'+hoaPropertyRec.parcelId+'</a></td>';
            		    tr +=    '<td class="hidden-xs hidden-sm">'+hoaPropertyRec.lotNo+'</td>';
            		    tr +=    '<td>'+hoaPropertyRec.parcelLocation+'</td>';
            			tr +=    '<td class="hidden-xs">'+hoaPropertyRec.ownerName+'</td>';
            		    tr +=    '<td class="visible-lg">'+hoaPropertyRec.ownerPhone+'</td>';
            		    */
            			
            			doc.addPage('letter','p');
            			doc.addImage(logoImgData, 'JPEG', 0.5, 0.5, 1.5, 1.5);
            			
            			doc.setFontSize(12);
            			doc.text(0.5, 10.5, "Page = "+index);
            			doc.setFontSize(16);
            			doc.text(0.5, 10.8, "Parcel Id = "+hoaPropertyRec.parcelId);
            			
            			
            			/*
                	    percentDone = Math.round(index/recTotal);
                	    var progressBar = $('<div>').prop('class',"progress-bar").attr('role',"progressbar").attr('aria-valuenow',percentDone).attr('aria-valuemin',"0").attr('aria-valuemax',recTotal)
                	    		.css('width',percentDone).html(percentDone+"%");
                	    progress.html(progressBar+" of "+recTotal);
                	  	$("#AdminProgress").html(progress);
                	  	*/
            		});

        			// Output as Data URI
        			doc.save('JJKTestDuesStatements.pdf');
    	    		
    	    	});
        		
    	    } // End of if ($action == 'DuesStatements') {
    	    
    	});
        event.stopPropagation();
    });


	/*
    // Portrait, millimeters, A4 format
	var doc = new jsPDF('p', 'mm', 'a4');
	doc.setProperties({
	    title: 'Test JJK Doc',
	    subject: 'This is the subject',
	    author: 'John Kauflin',
	    keywords: 'generated, javascript, web 2.0, ajax',
	    creator: 'MEEE'
	});
	doc.setFontSize(40);
	doc.text(35, 25, "John K loves jsPDF");
	doc.addPage('a4','p');
	doc.text(35, 25, "John K loves 2nd Page");

	// Output as Data URI
	doc.save('JJKTest.pdf');

	var pdfStr = doc.output('bloburi'); 
	//var pdfStr = doc.output('datauristring');
	//console.log("pdfStr = "+pdfStr);
	//$('.preview-pane').attr('src', string);

		$("#docFileDisplay").empty();
  		var iframeHeight = $(window).height()-220;
		var iframeHtml = '<iframe id="docFileFrame" src="'+pdfStr+'" width="100%" height="'+iframeHeight.toString()+'" frameborder="0" allowtransparency="true"></iframe>';  				
  		$("#docFileDisplay").html(iframeHtml);
  		// Display the modal window with the iframe
    	$("#docModal").modal("show");    	
    	
	*/

    
    $(document).on("click",".docModal",function(){
    	var $this = $(this);
  		$("#docFilename").html($this.attr('data-filename'));
  		$("#docFileDisplay").empty();
  		var iframeHeight = $(window).height()-220;
		var iframeHtml = '<iframe id="docFileFrame" src="'+$this.attr("data-filePath")+'" width="100%" height="'+iframeHeight.toString()+'" frameborder="0" allowtransparency="true"></iframe>';  				
  		$("#docFileDisplay").html(iframeHtml);
  		// Display the modal window with the iframe
    	$("#docModal").modal("show");    	
	});	

    
}); // $(document).ready(function(){



function displayPropertyList(hoaPropertyRecList) {
	var tr = '<tr><td>No records found - try different search parameters</td></tr>';
	$.each(hoaPropertyRecList, function(index, hoaPropertyRec) {
		if (index == 0) {
    		tr = '';
    	    tr +=    '<tr>';
        	tr +=      '<th>Row</th>';
        	tr +=      '<th>Parcel Id</th>';
	    	tr +=  	   '<th class="hidden-xs hidden-sm">Lot No</th>';
        	tr +=      '<th>Location</th>';
        	tr +=      '<th class="hidden-xs">Owner Name</th>';
            tr +=      '<th class="visible-lg">Owner Phone</th>';
    	    tr +=    '</tr>';
		}
	    tr +=  '<tr>';
	    tr +=    '<td>'+(index+1)+'</td>';
	    tr +=    '<td><a data-parcelId="'+hoaPropertyRec.parcelId+'" href="#">'+hoaPropertyRec.parcelId+'</a></td>';
	    tr +=    '<td class="hidden-xs hidden-sm">'+hoaPropertyRec.lotNo+'</td>';
	    tr +=    '<td>'+hoaPropertyRec.parcelLocation+'</td>';
		tr +=    '<td class="hidden-xs">'+hoaPropertyRec.ownerName+'</td>';
	    tr +=    '<td class="visible-lg">'+hoaPropertyRec.ownerPhone+'</td>';
	    tr +=  '</tr>';
	});

    $("#PropertyListDisplay tbody").html(tr);
}

function formatPropertyDetailResults(hoaRec){
    var tr = '';
    var checkedStr = '';

    // Get the admin level to see if user is allowed to edit data
	if (hoaRec.adminLevel > 1) {
	    tr += '<tr><th>Parcel Id:</th><td><a data-ParcelId="'+hoaRec.Parcel_ID+'" href="#">'+hoaRec.Parcel_ID+'</a></td></tr>';
	} else {
	    tr += '<tr><th>Parcel Id:</th><td>'+hoaRec.Parcel_ID+'</a></td></tr>';
	}
    tr += '<tr><th>Lot No:</th><td>'+hoaRec.LotNo+'</td></tr>';
    //tr += '<tr><th class="hidden-xs hidden-sm">Sub Division: </th><td class="hidden-xs hidden-sm">'+hoaRec.SubDivParcel+'</td></tr>';
    tr += '<tr><th>Location: </th><td>'+hoaRec.Parcel_Location+'</td></tr>';
    tr += '<tr><th class="hidden-xs hidden-sm">Street No: </th><td class="hidden-xs hidden-sm">'+hoaRec.Property_Street_No+'</td></tr>';
    tr += '<tr><th class="hidden-xs hidden-sm">Street Name: </th><td class="hidden-xs hidden-sm">'+hoaRec.Property_Street_Name+'</td></tr>';
    tr += '<tr><th class="hidden-xs">City: </th><td class="hidden-xs">'+hoaRec.Property_City+'</td></tr>';
    tr += '<tr><th class="hidden-xs">State: </th><td class="hidden-xs">'+hoaRec.Property_State+'</td></tr>';
    tr += '<tr><th class="hidden-xs">Zip Code: </th><td class="hidden-xs">'+hoaRec.Property_Zip+'</td></tr>';
    tr += '<tr><th>Total Due: </th><td>$'+hoaRec.TotalDue+'</td></tr>';
    tr += '<tr><th>Comments: </th><td>'+hoaRec.Comments+'</td></tr>';
    
    tr += '<tr><th class="hidden-xs hidden-sm">Member: </th><td class="hidden-xs hidden-sm">'+setCheckbox(hoaRec.Member)+'</td></tr>';
    tr += '<tr><th>Vacant: </th><td>'+setCheckbox(hoaRec.Vacant)+'</td></tr>';
    tr += '<tr><th>Rental: </th><td>'+setCheckbox(hoaRec.Rental)+'</td></tr>';
    tr += '<tr><th>Managed: </th><td>'+setCheckbox(hoaRec.Managed)+'</td></tr>';
    tr += '<tr><th>Foreclosure: </th><td>'+setCheckbox(hoaRec.Foreclosure)+'</td></tr>';
    tr += '<tr><th>Bankruptcy: </th><td>'+setCheckbox(hoaRec.Bankruptcy)+'</td></tr>';
    tr += '<tr><th>ToBe Released: </th><td>'+setCheckbox(hoaRec.Liens_2B_Released)+'</td></tr>';

    $("#PropertyDetail tbody").html(tr);
    
    var own1 = '';
    var currOwnerID = '';
    tr = '';
	$.each(hoaRec.ownersList, function(index, rec) {
		if (index == 0) {
    	    tr = tr +   '<tr>';
        	tr = tr +     '<th>OwnId</th>';
        	tr = tr +     '<th>Owner</th>';
        	tr = tr +     '<th>Phone</th>';
        	tr = tr +     '<th class="hidden-xs">Date Purchased</th>';
        	tr = tr +     '<th class="hidden-xs">Alt Address</th>';
        	tr = tr +     '<th class="hidden-xs">Comments</th>';
    	    tr = tr +   '</tr>';
    	    ownName1 = rec.Owner_Name1;
    	    currOwnerID = rec.OwnerID;
		}
	    tr = tr + '<tr>';
	    //tr = tr +   '<td data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+rec.OwnerID+'"><a href="#EditPage">'+rec.OwnerID+'</a></td>';
	    tr = tr +   '<td>'+rec.OwnerID+'</td>';
	    /*
	    if (rec.CurrentOwner) {
	    	own1 = rec.Owner_Name1;
		    tr = tr +   '<td data-OwnerId="'+rec.OwnerID+'"><a href="#EditPage">'+rec.OwnerID+'</a></td>';
	    } else {
		    tr = tr +   '<td>'+rec.OwnerID+'</td>';
	    }
	    */
    	if (hoaRec.adminLevel > 1) {
    	    tr = tr +   '<td><a data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+rec.OwnerID+'" href="#">'+rec.Owner_Name1+' '+rec.Owner_Name2+'</a></td>';
    	} else {
    	    tr = tr +   '<td>'+rec.Owner_Name1+' '+rec.Owner_Name2+'</a></td>';
    	}
	    tr = tr +   '<td>'+rec.Owner_Phone+'</td>';
		tr = tr +   '<td class="hidden-xs">'+rec.DatePurchased.substring(0,10)+'</td>';
		tr = tr +   '<td class="hidden-xs">'+rec.Alt_Address_Line1+'</td>';
		tr = tr +   '<td class="hidden-xs">'+rec.Comments+'</td>';
	    tr = tr + '</tr>';
	});
	$("#PropertyOwners tbody").html(tr);

	var TaxYear = '';
	var LienButton = '';
	var ButtonType = '';
    tr = '';
	$.each(hoaRec.assessmentsList, function(index, rec) {
		LienButton = '';
		ButtonType = '';
		
		if (index == 0) {
    	    tr = tr +   '<tr>';
        	tr = tr +     '<th>OwnId</th>';
        	tr = tr +     '<th>FY</th>';
        	tr = tr +     '<th>Dues Amt</th>';
        	tr = tr +     '<th>Lien</th>';
        	tr = tr +     '<th>Paid</th>';
        	tr = tr +     '<th class="hidden-xs">Date Paid</th>';
        	tr = tr +     '<th class="hidden-xs hidden-sm">Date Due</th>';
        	tr = tr +     '<th class="hidden-xs">Payment</th>';
        	tr = tr +     '<th class="hidden-xs">Comments</th>';
    	    tr = tr +   '</tr>';
    	    TaxYear = rec.DateDue.substring(0,4);
		}
		
	    tr = tr + '<tr>';
	    tr = tr +   '<td>'+rec.OwnerID+'</td>';
    	if (hoaRec.adminLevel > 1) {
    	    tr = tr +   '<td><a data-ParcelId="'+hoaRec.Parcel_ID+'" data-FY="'+rec.FY+'" href="#">'+rec.FY+'</a></td>';
    	} else {
    	    tr = tr +   '<td>'+rec.FY+'</a></td>';
    	}

    	// Check to add the Lien button
    	if (rec.Lien) {
    		if (rec.Disposition == 'Open') {
        		ButtonType = 'btn-danger';
    		} else if (rec.Disposition == 'Paid') {
        		ButtonType = 'btn-success';
    		} else {
        		ButtonType = 'btn-default';
    		}
    	    LienButton = '<a data-ParcelId="'+hoaRec.Parcel_ID+'" data-FY="'+rec.FY+'" href="#" class="btn '+ButtonType+' btn-xs" role="button">Lien</a>';
    	} else {
    		// If NOT PAID and past the due date, add a Create Lien button to go to edit
        	if (!rec.Paid && rec.DuesDue) {
        	    LienButton = '<a data-ParcelId="'+hoaRec.Parcel_ID+'" data-FY="'+rec.FY+'" href="#" class="btn btn-warning btn-xs" role="button">Create Lien</a>';
        	}
    	}
		//tr = tr +   '<td>'+rec.DuesAmt+' '+LienButton+'</td>';
		tr = tr +   '<td>'+rec.DuesAmt+'</td>';
		tr = tr +   '<td>'+LienButton+'</td>';

	    tr = tr +   '<td>'+setCheckbox(rec.Paid)+'</td>';
	    tr = tr +   '<td class="hidden-xs">'+rec.DatePaid.substring(0,10)+'</td>';
		tr = tr +   '<td class="hidden-xs hidden-sm">'+rec.DateDue.substring(0,10)+'</td>';
	    tr = tr +   '<td class="hidden-xs">'+rec.PaymentMethod+'</td>';
	    tr = tr +   '<td class="hidden-xs">'+rec.Comments+'</td>';
	    tr = tr + '</tr>';
	});
    $("#PropertyAssessments tbody").html(tr);
    
    var mcTreasURI = 'http://mctreas.org/master.cfm?parid='+hoaRec.Parcel_ID+'&taxyr='+TaxYear+'&own1='+ownName1;
    $("#MCTreasLink").html('<a href="'+encodeURI(mcTreasURI)+'" class="btn btn-primary" role="button" target="_blank">County<br>Treasurer</a>');    

    var mcAuditorURI = 'http://www.mcrealestate.org/search/CommonSearch.aspx?mode=PARID';
    $("#MCAuditorLink").html('<a href="'+encodeURI(mcAuditorURI)+'" class="btn btn-primary" role="button" target="_blank">County<br>Property</a>');    

    $("#DuesStatement").html('<a id="DuesStatementButton" data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+currOwnerID+'" href="#" class="btn btn-success" role="button">Dues Statement</a>');

    if (hoaRec.adminLevel > 1) {
	    $("#NewOwner").html('<a id="NewOwnerButton" data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+currOwnerID+'" href="#" class="btn btn-warning" role="button">New Owner</a>');
	    //$("#AddAssessment").html('<a id="AddAssessmentButton" href="#" class="btn btn-default" role="button">Add Assessment</a>');
	}

} // End of function formatDetailResults(hoaRec){


function formatPropertyDetailEdit(hoaRec){
    var tr = '';
    var checkedStr = '';

    // action or type of update
    $("#EditPageHeader").text("Edit Property");
    
	tr += '<div class="form-group">';
    tr += '<tr><th>Parcel Id:</th><td>'+hoaRec.Parcel_ID+'</td></tr>';
    tr += '<tr><th>Lot No:</th><td>'+hoaRec.LotNo+'</td></tr>';
    tr += '<tr><th>Sub Division: </th><td>'+hoaRec.SubDivParcel+'</td></tr>';
    tr += '<tr><th>Location: </th><td>'+hoaRec.Parcel_Location+'</td></tr>';
    tr += '<tr><th>Street No: </th><td>'+hoaRec.Property_Street_No+'</td></tr>';
    tr += '<tr><th>Street Name: </th><td>'+hoaRec.Property_Street_Name+'</td></tr>';
    tr += '<tr><th>City: </th><td>'+hoaRec.Property_City+'</td></tr>';
    tr += '<tr><th>State: </th><td>'+hoaRec.Property_State+'</td></tr>';
    tr += '<tr><th>Zip Code: </th><td>'+hoaRec.Property_Zip+'</td></tr>';
    //tr += '<tr><th>Member: </th><td>'+setCheckboxEdit(hoaRec.Member,'MemberCheckbox')+'</td></tr>';
    tr += '<tr><th>Member: </th><td>'+setCheckbox(hoaRec.Member,'MemberCheckbox')+'</td></tr>';
    tr += '<tr><th>Vacant: </th><td>'+setCheckboxEdit(hoaRec.Vacant,'VacantCheckbox')+'</td></tr>';
    tr += '<tr><th>Rental: </th><td>'+setCheckboxEdit(hoaRec.Rental,'RentalCheckbox')+'</td></tr>';
    tr += '<tr><th>Managed: </th><td>'+setCheckboxEdit(hoaRec.Managed,'ManagedCheckbox')+'</td></tr>';
    tr += '<tr><th>Foreclosure: </th><td>'+setCheckboxEdit(hoaRec.Foreclosure,'ForeclosureCheckbox')+'</td></tr>';
    tr += '<tr><th>Bankruptcy: </th><td>'+setCheckboxEdit(hoaRec.Bankruptcy,'BankruptcyCheckbox')+'</td></tr>';
    tr += '<tr><th>ToBe Released: </th><td>'+setCheckboxEdit(hoaRec.Liens_2B_Released,'LiensCheckbox')+'</td></tr>';
    tr += '<tr><th>Comments: </th><td>'+setInputText("PropertyComments",hoaRec.Comments,"80")+'</td></tr>';
	tr += '</div>'
	$("#EditTable tbody").html(tr);

	$("#EditTable2 tbody").html('');

	tr = '<form class="form-inline" role="form">'+
		 '<a id="SavePropertyEdit" data-ParcelId="'+hoaRec.Parcel_ID+'" href="#" class="btn btn-primary" role="button">Save</a>'+
		          		'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
		          		'</form>';
    $("#EditPageButton").html(tr);

} // End of function formatPropertyDetailEdit(hoaRec){

function formatOwnerDetailEdit(hoaRec,createNew){
    var tr = '';
    var tr2 = '';
    var checkedStr = '';
    var buttonStr = '';
    var ownerId = '';

    // action or type of update
	if (createNew) {
	    $("#EditPageHeader").text("New Owner");
	} else {
	    $("#EditPageHeader").text("Edit Owner");
	}

	rec = hoaRec.ownersList[0];
	salesRec = null;
	if (hoaRec.salesList[0] != null) {
		salesRec = hoaRec.salesList[0];
	}

	ownerId = rec.OwnerID;
	tr = '';
	tr += '<div class="form-group">';
	if (createNew) {
	    tr += '<tr><th>Owner Id:</th><td>CREATE NEW OWNER</td></tr>';
	} else {
	    tr += '<tr><th>Owner Id:</th><td>'+rec.OwnerID+'</td></tr>';
	}
    tr += '<tr><th>Location:</th><td>'+hoaRec.Parcel_Location+'</td></tr>';

    tr += '<tr><th>Current Owner: </th><td>'+setCheckbox(rec.CurrentOwner,'CurrentOwnerCheckbox')+'</td></tr>';
    tr += '<tr><th>Owner Name1:</th><td>'+ setInputText("OwnerName1",rec.Owner_Name1,"50")+'</td></tr>';
    tr += '<tr><th>Owner Name2:</th><td>'+ setInputText("OwnerName2",rec.Owner_Name2,"50")+'</td></tr>';
    tr += '<tr><th>Date Purchased:</th><td>'+ setInputDate("DatePurchased",rec.DatePurchased,"10")+'</td></tr>';
    tr += '<tr><th>Mailing Name:</th><td>'+ setInputText("MailingName",rec.Mailing_Name,"50")+'</td></tr>';
    tr += '<tr><th>Alternate Mailing: </th><td>'+setCheckboxEdit(rec.AlternateMailing,'AlternateMailingCheckbox')+'</td></tr>';
    tr += '<tr><th>Address Line1:</th><td>'+ setInputText("AddrLine1",rec.Alt_Address_Line1,"50")+'</td></tr>';
    tr += '<tr><th>Address Line2:</th><td>'+ setInputText("AddrLine2",rec.Alt_Address_Line2,"50")+'</td></tr>';
    tr += '<tr><th>City:</th><td>'+ setInputText("AltCity",rec.Alt_City,"40")+'</td></tr>';
    tr += '<tr><th>State:</th><td>'+ setInputText("AltState",rec.Alt_State,"20")+'</td></tr>';
    tr += '<tr><th>Zip:</th><td>'+ setInputText("AltZip",rec.Alt_Zip,"20")+'</td></tr>';
    tr += '<tr><th>Owner Phone:</th><td>'+ setInputText("OwnerPhone",rec.Owner_Phone,"30")+'</td></tr>';
    tr += '<tr><th>Comments: </th><td>'+setInputText("OwnerComments",rec.Comments,"12")+'</td></tr>';
    tr += '<tr><th>Last Changed:</th><td>'+rec.LastChangedTs+'</td></tr>';
    tr += '<tr><th>Changed by:</th><td>'+rec.LastChangedBy+'</td></tr>';
	tr += '</div>';
    
	$("#EditTable tbody").html(tr);
	
    if (salesRec != null) {
    	tr2 += '<div class="form-group">';
        tr2 += '<tr><td><h3>Sales Information</h3></td></tr>';
        tr2 += '<tr><th>Sales Owner Name: </th><td>'+salesRec.OWNERNAME1+'</td></tr>';
        tr2 += '<tr><th>Sale Date: </th><td>'+salesRec.SALEDT+'</td></tr>';
        tr2 += '<tr><th>Sales Mailing Name1: </th><td>'+salesRec.MAILINGNAME1+'</td></tr>';
        tr2 += '<tr><th>Sales Mailing Name2: </th><td>'+salesRec.MAILINGNAME2+'</td></tr>';
        tr2 += '<tr><th>Sales Address1: </th><td>'+salesRec.PADDR1+'</td></tr>';
        tr2 += '<tr><th>Sales Address2: </th><td>'+salesRec.PADDR2+'</td></tr>';
        tr2 += '<tr><th>Sales Address3: </th><td>'+salesRec.PADDR3+'</td></tr>';
    	tr2 += '</div>';
    }
	
	$("#EditTable2 tbody").html(tr2);

	tr = '<form class="form-inline" role="form">';
	if (createNew) {
//	    tr += '<tr><th></th><td>'+
		tr += '<a id="SaveOwnerEdit" data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="NEW" href="#" class="btn btn-primary" role="button">Create New</a>';
//	  	  '</td></tr>';
	} else {
//	    tr += '<tr><th></th><td>'+
		tr += '<a id="SaveOwnerEdit" data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+ownerId+'" href="#" class="btn btn-primary" role="button">Save</a>';
//	  	  '</td></tr>';
	}
	tr += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button></form>';
	$("#EditPageButton").html(tr);

    $(".Date").datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });

} // End of function formatOwnerDetailEdit(hoaRec){

function formatAssessmentDetailEdit(hoaRec){
    var tr = '';
    var checkedStr = '';
    var buttonStr = '';
    //var ownerId = '';
    var fy = '';

    // action or type of update
    $("#EditPageHeader").text("Edit Assessment");

    //console.log("hoaRec.ownersList.length = "+hoaRec.ownersList.length);
    
    rec = hoaRec.assessmentsList[0];
	//ownerId = rec.OwnerID;
	
	fy = rec.FY;
	tr = '';
	tr += '<div class="form-group">';
    tr += '<tr><th>Fiscal Year: </th><td>'+rec.FY+'</td></tr>';
    tr += '<tr><th>Parcel Id: </th><td>'+rec.Parcel_ID+'</td></tr>';

    var ownerSelect = '<select class="form-control" id="OwnerID">'
	$.each(hoaRec.ownersList, function(index, rec) {
    	ownerSelect += setSelectOption(rec.OwnerID,rec.OwnerID+" - "+rec.Owner_Name1+" "+rec.Owner_Name2,(index == 0),"");
	});
	ownerSelect += '</select>';                    		
    tr += '<tr><th>Owner: </th><td>'+ownerSelect+'</td></tr>';
    //tr += '<tr><th>Owner Id: </th><td>'+rec.OwnerID+'</td></tr>';
    
    tr += '<tr><th>Dues Amount: </th><td>'+setInputText("DuesAmount",rec.DuesAmt,"10")+'</td></tr>';
    tr += '<tr><th>Date Due: </th><td>'+setInputDate("DateDue",rec.DateDue,"10")+'</td></tr>';
    tr += '<tr><th>Paid: </th><td>'+setCheckboxEdit(rec.Paid,'PaidCheckbox')+'</td></tr>';
    tr += '<tr><th>Date Paid: </th><td>'+setInputDate("DatePaid",rec.DatePaid,"10")+'</td></tr>';
    tr += '<tr><th>Payment Method: </th><td>'+setInputText("PaymentMethod",rec.PaymentMethod,"20")+'</td></tr>';
    tr += '<tr><th>Comments: </th><td>'+setInputText("AssessmentsComments",rec.Comments,"10")+'</td></tr>';
    tr += '<tr><th>Last Changed: </th><td>'+rec.LastChangedTs+'</td></tr>';
    tr += '<tr><th>Changed by: </th><td>'+rec.LastChangedBy+'</td></tr>';
	tr += '</div>';
	$("#EditTable tbody").html(tr);

	tr = '';
	tr += '<div class="form-group">';
    tr += '<tr><th>Lien: </th><td>'+setCheckboxEdit(rec.Lien,'LienCheckbox')+'</td></tr>';
    tr += '<tr><th>LienRefNo: </th><td>'+setInputText("LienRefNo",rec.LienRefNo,"10")+'</td></tr>';
    tr += '<tr><th>DateFiled: </th><td>'+setInputDate("DateFiled",rec.DateFiled,"10")+'</td></tr>';

    var selectOption = '<select class="form-control" id="Disposition">'
        					+setSelectOption("","",("" == rec.Disposition),"")
        					+setSelectOption("Open","Open",("Open" == rec.Disposition),"bg-danger")
        					+setSelectOption("Paid","Paid",("Paid" == rec.Disposition),"bg-success")
        					+setSelectOption("Released","Released",("Released" == rec.Disposition),"bg-info")
        					+setSelectOption("Closed","Closed",("Closed" == rec.Disposition),"bg-warning")
        					+'</select>';                    		
    tr += '<tr><th>Disposition: </th><td>'+selectOption+'</td></tr>';
    //tr += '<tr><th>Disposition: </th><td>'+setInputText("Disposition",rec.Disposition,"10")+'</td></tr>';
    
    tr += '<tr><th>FilingFee: </th><td>'+setInputText("FilingFee",rec.FilingFee,"10")+'</td></tr>';
    tr += '<tr><th>ReleaseFee: </th><td>'+setInputText("ReleaseFee",rec.ReleaseFee,"10")+'</td></tr>';
    tr += '<tr><th>DateReleased: </th><td>'+setInputDate("DateReleased",rec.DateReleased,"10")+'</td></tr>';
    tr += '<tr><th>LienDatePaid: </th><td>'+setInputDate("LienDatePaid",rec.LienDatePaid,"10")+'</td></tr>';
    tr += '<tr><th>AmountPaid: </th><td>'+setInputText("AmountPaid",rec.AmountPaid,"10")+'</td></tr>';
    tr += '<tr><th>StopInterestCalc: </th><td>'+setCheckboxEdit(rec.StopInterestCalc,'StopInterestCalcCheckbox')+'</td></tr>';
    tr += '<tr><th>FilingFeeInterest: </th><td>'+setInputText("FilingFeeInterest",rec.FilingFeeInterest,"10")+'</td></tr>';
    tr += '<tr><th>AssessmentInterest: </th><td>'+setInputText("AssessmentInterest",rec.AssessmentInterest,"10")+'</td></tr>';
    tr += '<tr><th>LienComment: </th><td>'+setInputText("LienComment",rec.LienComment,"10")+'</td></tr>';
	tr += '</div>';
	$("#EditTable2 tbody").html(tr);

	/*
	var editTable2 = $("#EditTable2 tbody");
	editTable2.empty();
	editTable2.append($('<div>').prop('class',"form-group")
			.append($('<tr>')
					.append($('<th>').html('Lien: ')).append($('<td>').html(setCheckboxEdit(rec.Lien,'Lien')))
					.append($('<th>').html('Lien Ref No: ')).append($('<td>').html(setInputText("LienRefNo",rec.LienRefNo,"10")))
					.append($('<th>').html('Date Filed: ')).append($('<td>').html(setInputDate("DateFiled",rec.DateFiled,"10")))
					.append($('<th>').html('Disposition: ')).append($('<td>').html(setInputText("Disposition",rec.Disposition,"10")))
					.append($('<th>').html('Filing Fee: ')).append($('<td>').html(setInputText("FilingFee",rec.FilingFee,"10")))
					.append($('<th>').html('Release Fee: ')).append($('<td>').html(setInputText("ReleaseFee",rec.ReleaseFee,"10")))
					.append($('<th>').html('Date Released: ')).append($('<td>').html(setInputDate("DateReleased",rec.DateReleased,"10")))
					.append($('<th>').html('Lien Date Paid: ')).append($('<td>').html(setInputDate("LienDatePaid",rec.LienDatePaid,"10")))
					.append($('<th>').html('Amount Paid: ')).append($('<td>').html(setInputText("AmountPaid",rec.AmountPaid,"10")))
					.append($('<th>').html('Stop Interest Calc: ')).append($('<td>').html(setCheckboxEdit(rec.StopInterestCalc,'StopInterestCalc')))
					.append($('<th>').html('Filing Fee Interest: ')).append($('<td>').html(setInputText("FilingFeeInterest",rec.FilingFeeInterest,"10")))
					.append($('<th>').html('Assessment Interest: ')).append($('<td>').html(setInputText("AssessmentInterest",rec.AssessmentInterest,"10")))
					.append($('<th>').html('Lien Comment: ')).append($('<td>').html(setInputText("LienComment",rec.LienComment,"10")))
			)
	);
	*/
//	Lien,LienRefNo,DateFiled,Disposition,FilingFee,ReleaseFee,DateReleased,LienDatePaid,AmountPaid,StopInterestCalc,FilingFeeInterest,AssessmentInterest,LienComment,
	
//	  '<a id="SaveAssessmentEdit" data-ParcelId="'+hoaRec.Parcel_ID+'" data-OwnerId="'+ownerId+'" data-FY="'+fy+'" href="#" class="btn btn-primary" role="button">Save</a>' +
	tr = '<form class="form-inline" role="form">'+
	  '<a id="SaveAssessmentEdit" data-ParcelId="'+hoaRec.Parcel_ID+'" data-FY="'+fy+'" href="#" class="btn btn-primary" role="button">Save</a>' +
	          		'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
	          		'</form>';
	$("#EditPageButton").html(tr);

    $(".Date").datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });    
	
} // End of function formatAssessmentDetailEdit(hoaRec){


function formatDuesStatementResults(hoaRec) {
    var tr = '';
    var checkedStr = '';

	var duesStatementDownloadLinks = $("#DuesStatementDownloadLinks");
	duesStatementDownloadLinks.empty();

	ownerRec = hoaRec.ownersList[0];

	var currSysDate = new Date();
	pdfTitle = "Member Dues Statement";
	pdfTimestamp = currSysDate.toString().substr(0,24);
	
	pdfPageCnt = 0;
	pdfLineCnt = 0;

	pdfLineHeaderArray = [
			'Parcel Id',
			'Lot No',
			'Location',
			'Owner and Alt Address',
			'Phone'];
	pdfLineColIncrArray = [0.4,1.3,0.8,2.3,2.3];
	
	duesStatementPDFaddLine([hoaRec.Parcel_ID,hoaRec.LotNo,hoaRec.Parcel_Location,ownerRec.Mailing_Name,
	                         ownerRec.Owner_Phone],pdfLineHeaderArray); 

	if (hoaRec.ownersList[0].AlternateMailing) {
		duesStatementPDFaddLine(['','','',ownerRec.Alt_Address_Line1,''],null); 
		if (ownerRec.Alt_Address_Line2 != '') {
			duesStatementPDFaddLine(['','','',ownerRec.Alt_Address_Line2,''],null); 
		}
		duesStatementPDFaddLine(['','','',ownerRec.Alt_City+', '+ownerRec.Alt_State+' '+ownerRec.Alt_Zip,''],null); 
	}

	
    tr += '<tr><th>Parcel Id:</th><td>'+hoaRec.Parcel_ID+'</a></td></tr>';
    tr += '<tr><th>Lot No:</th><td>'+hoaRec.LotNo+'</td></tr>';
    //tr += '<tr><th>Sub Division: </th><td>'+hoaRec.SubDivParcel+'</td></tr>';
    tr += '<tr><th>Location: </th><td>'+hoaRec.Parcel_Location+'</td></tr>';
    tr += '<tr><th>City State Zip: </th><td>'+hoaRec.Property_City+', '+hoaRec.Property_State+' '+hoaRec.Property_Zip+'</td></tr>';
    tr += '<tr><th>Owner Name:</th><td>'+ownerRec.Owner_Name1+' '+ownerRec.Owner_Name2+'</td></tr>';
    tr += '<tr><th>Total Due: </th><td>$'+hoaRec.TotalDue+'</td></tr>';
    $("#DuesStatementPropertyTable tbody").html(tr);

    // If enabled, payment button and instructions will have values, else they will be blank if online payment is not allowed
	$("#PayDues").html(hoaRec.paymentButton);
	$("#PayDuesInstructions").html(hoaRec.paymentInstructions);

    duesStatementDownloadLinks.append(
			$('<a>').prop('id','DownloadDuesStatementPDF')
	    			.attr('href','#')
		    		.attr('class',"btn btn-danger downloadBtn")
		    		.attr('data-pdfName','DuesStatement')
		    		.html('PDF'));

	pdfLineColIncrArray = [0.4,4,0.5];

	duesStatementPDFaddLine([''],null);
	
    tr = '';
	$.each(hoaRec.totalDuesCalcList, function(index, rec) {
	    tr = tr + '<tr>';
    	tr = tr +   '<td>'+rec.calcDesc+'</td>';
	    tr = tr +   '<td>$</td>';
	    tr = tr +   '<td align="right">'+rec.calcValue+'</td>';
	    tr = tr + '</tr>';
	    duesStatementPDFaddLine([rec.calcDesc,'$',rec.calcValue],null);
	});
    tr = tr + '<tr>';
	tr = tr +   '<td><b>Total Due:</b></td>';
    tr = tr +   '<td><b>$</b></td>';
    tr = tr +   '<td align="right"><b>'+hoaRec.TotalDue+'</b></td>';
    tr = tr + '</tr>';
    duesStatementPDFaddLine(['Total Due:','$',hoaRec.TotalDue],null);
	$("#DuesStatementCalculationTable tbody").html(tr);

	duesStatementPDFaddLine([''],null);

	var TaxYear = '';
    tr = '';
	$.each(hoaRec.assessmentsList, function(index, rec) {
		pdfLineHeaderArray = null;
		if (index == 0) {
    	    tr = tr +   '<tr>';
    	    tr = tr +     '<th>Year</th>';
    	    tr = tr +     '<th>Dues Amt</th>';
    	    tr = tr +     '<th>Date Due</th>';
    	    tr = tr +     '<th>Paid</th>';
    	    tr = tr +     '<th>Date Paid</th>';
    	    tr = tr +   '</tr>';
    	    TaxYear = rec.DateDue.substring(0,4);
    	    
    		pdfLineHeaderArray = [
    			          			'Year',
    			          			'Dues Amt',
    			          			'Date Due',
    			          			'Paid',
    			          			'Date Paid'];
    		pdfLineColIncrArray = [0.4,1.3,0.8,2.3,2.3];
		}
		
	    tr = tr + '<tr>';
    	tr = tr +   '<td>'+rec.FY+'</a></td>';
	    tr = tr +   '<td>'+rec.DuesAmt+'</td>';
	    tr = tr +   '<td>'+rec.DateDue.substring(0,10)+'</td>';
	    tr = tr +   '<td>'+setCheckbox(rec.Paid)+'</td>';
	    tr = tr +   '<td>'+rec.DatePaid.substring(0,10)+'</td>';
	    tr = tr + '</tr>';
	    duesStatementPDFaddLine([rec.FY,rec.DuesAmt,rec.DateDue.substring(0,10),setBoolText(rec.Paid),rec.DatePaid.substring(0,10)],pdfLineHeaderArray);
	});

	$("#DuesStatementAssessmentsTable tbody").html(tr);
	
} // End of function formatDuesStatementResults(hoaRec){

//Function to add a line to the report PDF
function duesStatementPDFaddLine(pdfLineArray,pdfLineHeaderArray) {
	pdfLineCnt++;
	var pdfHeader = false;
	var X = 0.0;
	
	if (pdfLineCnt == 1) {
    	pdf = new jsPDF('p', 'in', 'letter');
    	pdf.setProperties({
    	    title: 'Test JJK Doc',
    	    subject: 'This is the subject',
    	    author: 'John Kauflin',
    	    keywords: 'generated, javascript, web 2.0, ajax',
    	    creator: 'MEEE'
    	});
    	pdfHeader = true;
		pdfLineY = pdfLineYStart;
	}

	if (pdfLineY > 7.8) {
		pdf.addPage('letter','p');
		pdfLineY = pdfLineYStart;
    	pdfHeader = true;
	}

	if (pdfHeader) {
		pdfPageCnt++;

		// X (horizontal), Y (vertical)
		pdf.setFontSize(16);
		pdf.text(2, 0.6, "Gander Road Homeowners Association");
		pdf.setFontSize(14);
		pdf.text(3, 0.9, pdfTitle);
		pdf.setFontSize(10);
		pdf.text(3.8, 1.1, pdfTimestamp);

		pdf.addImage(pdfLogoImgData, 'JPEG', 0.3, 0.3, 0.8, 0.8);
    	pdf.setFontSize(10);

    	pdfLineYStart = 2;
	}

	if (pdfLineHeaderArray != null) {
		X = 0.0;
		for (i = 0; i < pdfLineArray.length; i++) {
			X += pdfLineColIncrArray[i];
			pdf.text(X,pdfLineY,''+pdfLineHeaderArray[i]);
		}
		pdfLineY += pdfLineIncrement / 2.0;
		
		X = pdfLineColIncrArray[0];
		pdf.setLineWidth(0.02);
		pdf.line(X,pdfLineY,8.1,pdfLineY);
		pdfLineY += pdfLineIncrement;
	}
	
	X = 0.0;
	for (i = 0; i < pdfLineArray.length; i++) {
		X += pdfLineColIncrArray[i];
		pdf.text(X,pdfLineY,''+pdfLineArray[i]);
	}
	pdfLineY += pdfLineIncrement;
	
} // End of function reportPDFaddLine(pdfLineArray) {


//---------------------------------------------------------------------------------------------------------------
// Format reports
//---------------------------------------------------------------------------------------------------------------
function formatReportList(reportName,reportTitle,reportList){

	var currSysDate = new Date();
	var reportTitleFull = '';
	var reportYear = '';
	var reportListDisplay = $("#ReportListDisplay tbody");
	reportListDisplay.empty();
	$("#ReportRecCnt").html("");
	var reportDownloadLinks = $("#ReportDownloadLinks");
	reportDownloadLinks.empty();

	pdfPageCnt = 0;
	pdfLineCnt = 0;
	var csvLine = "";
	csvContent = "";
	paidCnt = 0;
	unpaidCnt = 0;
	
	rowId = 0;
	if (reportName == "SalesReport" || reportName == "SalesNewOwnerReport") {
		reportTitleFull = reportTitle;

		$.each(reportList, function(index, hoaSalesRec) {
			rowId = index + 1;
		    
			if (index == 0) {
				$('<tr>')
				.append($('<th>').html('Row'))
				.append($('<th>').html('Sale Date'))
				.append($('<th>').html('Parcel Location'))
				.append($('<th>').html('Old Owner Name'))
				.append($('<th>').html('New Owner Name'))
				.append($('<th>').html('Mailing Name1'))
				.append($('<th>').html('Mailing Name2'))
				.appendTo(reportListDisplay);		
			}

			var tr = $('<tr>');
			tr.append($('<td>').html(index+1))
	    	if (hoaSalesRec.adminLevel > 1 && reportName == "SalesNewOwnerReport") {
    			tr.append($('<td>')
    					.append($('<a>').attr('href',"#")
										.attr('class',"SalesNewOwnerProcess")
    									.attr('data-ParcelId',hoaSalesRec.PARID)
    									.attr('data-SaleDate',hoaSalesRec.SALEDT)
    									.attr('data-Action',"Process")
    									.prop('style','margin-right:7px;')
    									.html(hoaSalesRec.SALEDT))
    					.append($('<a>').attr('data-ParcelId',hoaSalesRec.PARID)
    									.attr('data-SaleDate',hoaSalesRec.SALEDT)
    									.attr('data-Action',"Ignore")
    									.attr('href',"#")
    									.attr('class',"btn btn-warning btn-xs SalesNewOwnerIgnore")
    									.attr('role',"button")
    									.html("Ignore")) );
	    	} else {
    			tr.append($('<td>').html(hoaSalesRec.SALEDT));
	    	}

			tr.append($('<td>').html(hoaSalesRec.PARCELLOCATION))
			.append($('<td>').html(hoaSalesRec.OLDOWN))
			.append($('<td>').html(hoaSalesRec.OWNERNAME1))
			.append($('<td>').html(hoaSalesRec.MAILINGNAME1))
			.append($('<td>').html(hoaSalesRec.MAILINGNAME2));

			tr.appendTo(reportListDisplay);		

		}); // $.each(reportList, function(index, hoaSalesRec) {
		// End of if (reportName == "SalesReport" || reportName == "SalesNewOwnerReport") {

	} else {
		
		var pdfLineArray = [];
    	// Loop through the list of properties / current owner
		$.each(reportList, function(index, hoaRec) {
			rowId = index + 1;
			
			if (hoaRec.assessmentsList[0].Paid) {
				paidCnt++;
			} else {
				unpaidCnt++;
			}
			
				if (index == 0) {
					$('<tr>')
					.append($('<th>').html('Row'))
					.append($('<th>').html('Parcel Id'))
					.append($('<th>').html('Lot No'))
					.append($('<th>').html('Location'))
					.append($('<th>').html('Owner and Alt Address'))
					.append($('<th>').html('Phone'))
					.append($('<th>').html('Dues Amt'))
					.append($('<th>').html('Paid'))
					.appendTo(reportListDisplay);		
					
					reportYear = hoaRec.assessmentsList[0].FY;
					reportTitleFull = reportTitle+" for Fiscal Year "+reportYear+" (Oct. 1, "+(reportYear-1)+" to Sept. 30, "+reportYear+")";
					pdfTitle = reportTitleFull;
					pdfTimestamp = currSysDate.toString().substr(0,24)+", Number of records = "+reportList.length;
					
					pdfLineHeaderArray = [
							'Row',
							'Parcel Id',
							'Lot No',
							'Location',
							'Owner and Alt Address',
							'Phone',
							'Dues Amt',
							'Paid'];
					pdfLineColIncrArray = [0.75,0.5,1.3,0.8,2.3,2.3,1.3,0.8];
					
					csvLine = csvFilter(index+1);
					csvLine += ',' + csvFilter("ParcelID");
					csvLine += ',' + csvFilter("LotNo");
					csvLine += ',' + csvFilter("ParcelLocation");
					csvLine += ',' + csvFilter("OwnerName1");
					csvLine += ',' + csvFilter("OwnerName2");
					csvLine += ',' + csvFilter("OwnerPhone");
					csvLine += ',' + csvFilter("MailingName");
					csvLine += ',' + csvFilter("AltAddressLine1");
					csvLine += ',' + csvFilter("AltAddressLine2");
					csvLine += ',' + csvFilter("AltCity");
					csvLine += ',' + csvFilter("AltState");
					csvLine += ',' + csvFilter("AltZip");
					csvLine += ',' + csvFilter("FiscalYear");
					csvLine += ',' + csvFilter("DuesAmt");
					csvLine += ',' + csvFilter("Paid");
			    	csvContent += csvLine + '\n';
				}

				//.append($('<td>').html(hoaRec.ownersList[0].Owner_Name1+" "+hoaRec.ownersList[0].Owner_Name2))

				var tr = $('<tr>');
				tr.append($('<td>').html(index+1))
				.append($('<td>').html(hoaRec.Parcel_ID))
				.append($('<td>').html(hoaRec.LotNo))
				.append($('<td>').html(hoaRec.Parcel_Location))
				.append($('<td>').html(hoaRec.ownersList[0].Mailing_Name))
				.append($('<td>').html(hoaRec.ownersList[0].Owner_Phone))
				.append($('<td>').html(hoaRec.assessmentsList[0].DuesAmt))
				.append($('<td>').html(setBoolText(hoaRec.assessmentsList[0].Paid)));
				tr.appendTo(reportListDisplay);		

				reportPDFaddLine([index+1,hoaRec.Parcel_ID,hoaRec.LotNo,hoaRec.Parcel_Location,hoaRec.ownersList[0].Mailing_Name,
				                  hoaRec.ownersList[0].Owner_Phone,hoaRec.assessmentsList[0].DuesAmt,setBoolText(hoaRec.assessmentsList[0].Paid)]); 
				
				if (hoaRec.ownersList[0].AlternateMailing) {
					var tr3 = $('<tr>');
					tr3.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(hoaRec.ownersList[0].Alt_Address_Line1))
					.append($('<td>').html(''))
					.append($('<td>').html(''));
					tr3.appendTo(reportListDisplay);		

					reportPDFaddLine(['','','','',hoaRec.ownersList[0].Alt_Address_Line1,'','','']);
					
					if (hoaRec.ownersList[0].Alt_Address_Line2 != '') {
						var tr4 = $('<tr>');
						tr4.append($('<td>').html(''))
						.append($('<td>').html(''))
						.append($('<td>').html(''))
						.append($('<td>').html(''))
						.append($('<td>').html(hoaRec.ownersList[0].Alt_Address_Line2))
						.append($('<td>').html(''))
						.append($('<td>').html(''));
						tr4.appendTo(reportListDisplay);		

						reportPDFaddLine(['','','','',hoaRec.ownersList[0].Alt_Address_Line2,'','','']);
					}
					
					var tr5 = $('<tr>');
					tr5.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(''))
					.append($('<td>').html(hoaRec.ownersList[0].Alt_City+', '+hoaRec.ownersList[0].Alt_State+' '+hoaRec.ownersList[0].Alt_Zip))
					.append($('<td>').html(''))
					.append($('<td>').html(''));
					tr5.appendTo(reportListDisplay);		
					
					reportPDFaddLine(['','','','',hoaRec.ownersList[0].Alt_City+', '+hoaRec.ownersList[0].Alt_State+' '+hoaRec.ownersList[0].Alt_Zip,'','','']);
				}

				
				csvLine = csvFilter(index+1);
				csvLine += ',' + csvFilter(hoaRec.Parcel_ID);
				csvLine += ',' + csvFilter(hoaRec.LotNo);
				csvLine += ',' + csvFilter(hoaRec.Parcel_Location);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Owner_Name1);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Owner_Name2);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Owner_Phone);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Mailing_Name);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Alt_Address_Line1);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Alt_Address_Line2);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Alt_City);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Alt_State);
				csvLine += ',' + csvFilter(hoaRec.ownersList[0].Alt_Zip);
				csvLine += ',' + csvFilter(reportYear);
				csvLine += ',' + csvFilter(hoaRec.assessmentsList[0].DuesAmt);
				csvLine += ',' + csvFilter(setBoolText(hoaRec.assessmentsList[0].Paid));
		    	csvContent += csvLine + '\n';
		    
		}); // $.each(reportList, function(index, hoaRec) {

		reportDownloadLinks.append(
				$('<a>').prop('id','DownloadReportCSV')
		    			.attr('href','#')
			    		.attr('class',"btn btn-warning")
			    		.attr('data-reportName',formatDate()+'-'+reportName)
			    		.html('CSV'));
	    
		// Include downloadBtn class to add space to left margin
		reportDownloadLinks.append(
				$('<a>').prop('id','DownloadReportPDF')
		    			.attr('href','#')
			    		.attr('class',"btn btn-danger downloadBtn")
			    		.attr('data-reportName',formatDate()+'-'+reportName)
			    		.html('PDF'));
		
	} // End of Properties / current owner reports

    $("#ReportHeader").html(reportTitleFull);
	$("#ReportRecCnt").html(currSysDate.toString().substr(0,24)+", Number of records = "+rowId);

	if (reportName == "PropertyOwnerReport") {
		$("#ReportRecCnt").append(" (Paid = " + paidCnt + ", Unpaid = " + unpaidCnt + ")");
	}

	if (reportName == "SalesNewOwnerReport") {
		$("#ReportRecCnt").append(", (Click on <b>Sale Date</b> to Create a New Owner, or <b>Ignore</b> to bypass)");
	}
		
} // function formatReportList(reportName,reportList){

// Global variable to hold CSV content for downloading
var csvContent;

//---------------------------------------------------------------------------------------------------------------------------
//Global variable to hold the PDF file created during report formatting (for downloading)
//---------------------------------------------------------------------------------------------------------------------------
var pdf;
var pdfLogoImgData = '';
var pdfTitle = "";
var pdfTimestamp = "";
var pdfTotals = "";
var pdfLineHeaderArray = [];
var pdfLineColIncrArray = [];
var pdfPageCnt = 0;
var pdfLineCnt = 0;
var pdfLineYStart = 1.4;
var pdfLineY = pdfLineYStart;
var pdfLineIncrement = 0.25;
var pdfColIncrement = 1.5;

// Function to add a line to the report PDF
function reportPDFaddLine(pdfLineArray) {
	pdfLineCnt++;
	var pdfHeader = false;
	var X = 0.0;
	
	if (pdfLineCnt == 1) {
    	pdf = new jsPDF('l', 'in', 'letter');
    	pdf.setProperties({
    	    title: 'Test JJK Doc',
    	    subject: 'This is the subject',
    	    author: 'John Kauflin',
    	    keywords: 'generated, javascript, web 2.0, ajax',
    	    creator: 'MEEE'
    	});
    	pdfHeader = true;
		pdfLineY = pdfLineYStart;
	}

	if (pdfLineY > 7.8) {
		pdf.addPage('letter','l');
		pdfLineY = pdfLineYStart;
    	pdfHeader = true;
	}

	if (pdfHeader) {
		pdfPageCnt++;
		pdf.setFontSize(9);
		pdf.text(10.2, 0.3, 'Page '+pdfPageCnt);
		pdf.setFontSize(15);
		pdf.text(3.6, 0.45, "Gander Road Homeowners Association");
		pdf.setFontSize(13);
		pdf.text(2.5, 0.75, pdfTitle);
		pdf.setFontSize(10);
		pdf.text(3.8, 1.1, pdfTimestamp);
		
		pdf.addImage(pdfLogoImgData, 'JPEG', 0.3, 0.3, 0.8, 0.8);
    	pdf.setFontSize(10);

    	pdfLineYStart = 1.4;
		X = 0.0;
		for (i = 0; i < pdfLineArray.length; i++) {
			X += pdfLineColIncrArray[i];
			pdf.text(X,pdfLineY,''+pdfLineHeaderArray[i]);
		}
		pdfLineY += pdfLineIncrement / 2.0;
		
		X = 0.65;
		pdf.setLineWidth(0.02);
		pdf.line(X,pdfLineY,10.5,pdfLineY);
		pdfLineY += pdfLineIncrement;
	}

	X = 0.0;
	for (i = 0; i < pdfLineArray.length; i++) {
		X += pdfLineColIncrArray[i];
		pdf.text(X,pdfLineY,''+pdfLineArray[i]);
	}
	pdfLineY += pdfLineIncrement;

} // End of function reportPDFaddLine(pdfLineArray) {

