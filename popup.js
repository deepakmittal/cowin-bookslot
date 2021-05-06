
STATES = [{"state_id":1,"state_name":"Andaman and Nicobar Islands"},{"state_id":2,"state_name":"Andhra Pradesh"},{"state_id":3,"state_name":"Arunachal Pradesh"},{"state_id":4,"state_name":"Assam"},{"state_id":5,"state_name":"Bihar"},{"state_id":6,"state_name":"Chandigarh"},{"state_id":7,"state_name":"Chhattisgarh"},{"state_id":8,"state_name":"Dadra and Nagar Haveli"},{"state_id":37,"state_name":"Daman and Diu"},{"state_id":9,"state_name":"Delhi"},{"state_id":10,"state_name":"Goa"},{"state_id":11,"state_name":"Gujarat"},{"state_id":12,"state_name":"Haryana"},{"state_id":13,"state_name":"Himachal Pradesh"},{"state_id":14,"state_name":"Jammu and Kashmir"},{"state_id":15,"state_name":"Jharkhand"},{"state_id":16,"state_name":"Karnataka"},{"state_id":17,"state_name":"Kerala"},{"state_id":18,"state_name":"Ladakh"},{"state_id":19,"state_name":"Lakshadweep"},{"state_id":20,"state_name":"Madhya Pradesh"},{"state_id":21,"state_name":"Maharashtra"},{"state_id":22,"state_name":"Manipur"},{"state_id":23,"state_name":"Meghalaya"},{"state_id":24,"state_name":"Mizoram"},{"state_id":25,"state_name":"Nagaland"},{"state_id":26,"state_name":"Odisha"},{"state_id":27,"state_name":"Puducherry"},{"state_id":28,"state_name":"Punjab"},{"state_id":29,"state_name":"Rajasthan"},{"state_id":30,"state_name":"Sikkim"},{"state_id":31,"state_name":"Tamil Nadu"},{"state_id":32,"state_name":"Telangana"},{"state_id":33,"state_name":"Tripura"},{"state_id":34,"state_name":"Uttar Pradesh"},{"state_id":35,"state_name":"Uttarakhand"},{"state_id":36,"state_name":"West Bengal"}];
DISTRICT_ID = 149;
STATE_ID = 9;
USER_TOKEN = "";

var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    console.log("message recieved" + msg);
});

		
		document.addEventListener('DOMContentLoaded', function() {
			//getSessionStorage();

			
			var list1 = document.getElementById('firstList');
			list1.options[0] = new Option('--Select--', '');
			for(var i in STATES){
				list1.options[i] = new Option(STATES[i]["state_name"], STATES[i]["state_id"]);
			}
			populate();
			list1.onchange = function() {
				    STATE_ID = list1.options[list1.selectedIndex].value;
       				getDistrict();
     		}
     		var list2 = document.getElementById("secondList");
     		list2.onchange = function() {
       				DISTRICT_ID = list2.options[list2.selectedIndex].value;
       				save();
     		}
     		var button =document.getElementById('start');
     		button.onclick = function() {
       				start();
       				return false;
     		}
     		
		
		}, false);

  function getSessionStorage() {
  	console.log("session:");
  	var script = 'JSON.parse(JSON.stringify(window.sessionStorage))';

    chrome.tabs.executeScript({
      code: script
    }, function(results){
  		 USER_TOKEN = (results[0] && results[0]["userToken"]) ? results[0]["userToken"].replaceAll('"','') : USER_TOKEN;
    });
  
  }


function populate(){
	console.log("populating");
	chrome.storage.sync.get(["districtId","stateId"], function(items){
		console.log(items);
	    DISTRICT_ID = items["districtId"] ? items["districtId"] : DISTRICT_ID;
	    STATE_ID = items["stateId"] ? items["stateId"] : STATE_ID;
	    document.getElementById("firstList").value = parseInt(STATE_ID);
	    console.log("got districtId:" + STATE_ID);
	    getDistrict();
	});
}
function save(){
var list1= document.getElementById("firstList");
var list2= document.getElementById("secondList");	
chrome.storage.sync.set({ "districtId": DISTRICT_ID }, function(){
		console.log("saved district");
});
chrome.storage.sync.set({ "stateId": STATE_ID }, function(){
	console.log("saved state:" + STATE_ID);
});

chrome.storage.sync.get(/* String or Array */["yourBody"], function(items){
    //  items = [ { "yourBody": "myBody" } ]
});
}

STATUS_QUEUE = [];
function status(msg){
	STATUS_QUEUE.push(msg);
}
function statusDisplay(){
	var msg = STATUS_QUEUE.shift();
	if(msg){
		document.getElementById("status").innerHTML = msg;
	}
}
function start(){
	console.log("starting:");
  	var script = 'start('+ DISTRICT_ID +')';

    chrome.tabs.executeScript({
      code: script
    }, function(results){
    });
    save();
	document.getElementById("start").style.display = 'none';
	return false;
}
function getDistrict(){
				var list1 = document.getElementById('firstList');
				var list2 = document.getElementById("secondList");
				var list1SelectedValue = list1.options[list1.selectedIndex].value;
				list2.options.length=0;
				var xmlhttp;
	          xmlhttp=new XMLHttpRequest();
	          xmlhttp.onreadystatechange=function()
	          {
	            if (xmlhttp.readyState==4)
	            {
	              if(xmlhttp.status==200)
	              {
	                var data=(JSON.parse(xmlhttp.responseText));
	                console.log(data);
	                for(var i in data["districts"]){
	                	var district = data["districts"][i];
	                	list2.options[i] = new Option(district["district_name"], district["district_id"]);
	                }
	                console.log("SETTING:"+ DISTRICT_ID);
	                list2.value = DISTRICT_ID;
	              }
	            }
	          }
	          xmlhttp.open("GET","https://cdn-api.co-vin.in/api/v2/admin/location/districts/" +list1SelectedValue,true);
	          xmlhttp.send();
}


      BENEFICIARIES = [];
      
      firstCheck = true;  
      beneficiariesFirstCheck = false;
function checkCoWinAvailability()
      {
      var xmlhttp;
      if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
        }
      else
        {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
      xmlhttp.onreadystatechange=function()
        {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
          {
               var data=(JSON.parse(xmlhttp.responseText));
               console.log(data);
               var found = false;
               for(var i in data["centers"]){
                      var centerData = data["centers"][i];
                      var name =  centerData["name"];
                      var centerId = centerData["center_id"];
                      for(var j in centerData["sessions"]){
                          var session = centerData["sessions"][j];
                          var avail = session["available_capacity"];
                          var date  = session["date"];
                          var age = session["min_age_limit"];
                          var slot = session["slots"][0];
                          var sessionId = session["session_id"];
                          
                          if(age == 18 && avail > 5){
                              found = true;
                              console.log("trying to book ...");
                              status("trying to book ...");
                              bookAppointment(centerId,sessionId,slot);
                              alert(avail + " vaccines available at "+name+ " on " + date + " (checked at " + new Date() + ")");
                          }
                          if(age == 18){

                              console.log(avail + " vaccines available at "+name+ " on " + date + " (checked at " + new Date() + ")");
                              status(avail + " vaccines available at "+name+ " on " + date);
                          }

                      } 
                      
               }
               if(firstCheck && !found){
                    alert("No slot is available in your area for next 6 days.\n\nYou will get an alert as soon as any slot is available and if you are still logged in, your slot will be booked automatically.\nBooking will be done for all beneficiaries who don't have appointment booked yet.");
                    firstCheck = false;
               }
               console.log(found? "Vaccine slot detected" : "No vaccine slot is available") ;
          }
        }
      
      getBeneficiaries(); 
      
      if(BENEFICIARIES.length == 0){
          console.log("No beneficiaries found. " + " (checked at " + new Date() + ")");
          //return;
      }
      var date = (new Date()).toLocaleDateString('en-GB', {
                     day: 'numeric', month: 'numeric', year: 'numeric'
                 }).replaceAll('/', '-');
      console.log("Session");
      console.log(sessionStorage);
      xmlhttp.open("GET","https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+DISTRICT_ID+"&date="+date,true);
      var token = USER_TOKEN;
      xmlhttp.setRequestHeader("authorization", "Bearer "+ token );
      xmlhttp.send();
      };

      
      function getBeneficiaries(){
          var xmlhttp;
          xmlhttp=new XMLHttpRequest();
          xmlhttp.onreadystatechange=function()
          {
            if (xmlhttp.readyState==4)
            {
              if(xmlhttp.status==200)
              {
                var data=(JSON.parse(xmlhttp.responseText));
                console.log(data);
                var beneficiaries = [];
                for(var i in data["beneficiaries"]){
                    var bData = data["beneficiaries"][i];
                    if(bData["vaccination_status"] == "Not Vaccinated" && bData["dose1_date"]==""){
                      beneficiaries.push(bData["beneficiary_reference_id"]);
                      status(bData["name"]+ " added as beneficiary.");
                    }
                    BENEFICIARIES = beneficiaries;
                }
                beneficiariesFirstCheck= true;
              }else if(xmlhttp.status==401)
              {
                var data=(xmlhttp.responseText);
                console.log(data);
                console.log("Session timed out. You will still get the availability alert. To autobook please login again.");
                if(beneficiariesFirstCheck){
                  alert("Session timed out. You will still get the availability alert. To autobook please login.");
                  beneficiariesFirstCheck= false;
                }else{
                  //alert("Please login to cowin portal and click start again.");
                }	
              }
            }
          }
          xmlhttp.open("GET","https://cdn-api.co-vin.in/api/v2/appointment/beneficiaries",true);
          var token = USER_TOKEN;
          xmlhttp.setRequestHeader("authorization", "Bearer "+ token );
          xmlhttp.send();
      }
      function bookAppointment(centerId,sessionId,slot){
          var xmlhttp=new XMLHttpRequest();
          xmlhttp.onreadystatechange=function()
          {
            if (xmlhttp.readyState==4){
              if(xmlhttp.status==200)
              {
                var data=(JSON.parse(xmlhttp.responseText));
                console.log(data);
                console.log("Appointment Booked");
                Alert("Appointment Booked");
              }
              if(xmlhttp.status==409)
              {
                var data=(JSON.parse(xmlhttp.responseText));
                console.log(data);
                console.log("Missed booking" + " (checked at " + new Date() + ")");
                alert("Missed the slot. Now looking for other slots available." + " (checked at " + new Date() + ")");
              }
            }
          }
          var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
          xmlhttp.open("POST", "https://cdn-api.co-vin.in/api/v2/appointment/schedule");
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          var token = USER_TOKEN;
          xmlhttp.setRequestHeader("authorization", "Bearer "+ token );
          
          var obj = {
              "center_id" : centerId,
              "session_id" : sessionId,
              "beneficiaries": BENEFICIARIES,
              "slot" : slot,
              "dose" : 1
          };
          xmlhttp.send(JSON.stringify(obj));
      }
      
      function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
      }


