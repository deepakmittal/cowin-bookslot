      DISTRICT_ID = 188;  // south delhi: 149

      BENEFICIARIES = [];
      
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
                              bookAppointment(centerId,sessionId,slot);
                              alert(avail + " vaccine available at "+name+ " on " + date + " (checked at " + new Date() + ")");
                          }
                          if(age == 18){

                              console.log(avail + " vaccine available at "+name+ " on " + date + " (checked at " + new Date() + ")");
                          }

                      } 
                      
               }
               if(firstCheck && found){
                    alert("No slot is available in your area for next 6 days.\n\nYou will get an alert as soon as any slot is available and if you are still logged in your slot will be booked automatically.\nBooking will be done for all beneficiaries who don't have appointment booked yet.");
                    firstCheck = false;
               }
               console.log(found? "Vaccine slot detected" : "No vaccine slot is available") ;
          }
        }
      var firstCheck = true;  
      getBeneficiaries(); 
      setTimeout(function(){checkCoWinAvailability();}, 30000);
      
      if(BENEFICIARIES.length == 0){
          console.log("No beneficiaries found. " + " (checked at " + new Date() + ")");
          return;
      }
      var date = (new Date()).toLocaleDateString('en-GB', {
                     day: 'numeric', month: 'numeric', year: 'numeric'
                 }).replaceAll('/', '-');
      xmlhttp.open("GET","https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id="+DISTRICT_ID+"&date="+date,true);
      xmlhttp.setRequestHeader("authorization", "Bearer "+ (sessionStorage["userToken"].replaceAll('"','')) );
      xmlhttp.send();
      };

      beneficiariesFirstCheck = true;
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
                    }
                    BENEFICIARIES = beneficiaries;
                }
              }else if(xmlhttp.status==401)
              {
                var data=(xmlhttp.responseText);
                console.log(data);
                console.log("Session times out. You will still get the availability alert. To autobook please refresh.");
                if(beneficiariesFirstCheck)
                  alert("Session times out. You will still get the availability alert. To autobook please login again.");
                  beneficiariesFirstCheck= false;
                }
              }
            }
          }
          xmlhttp.open("GET","https://cdn-api.co-vin.in/api/v2/appointment/beneficiaries",true);
          xmlhttp.setRequestHeader("authorization", "Bearer "+ (sessionStorage["userToken"].replaceAll('"','')) );
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
                alert("Missed booking" + " (checked at " + new Date() + ")");
              }
            }
          }
          var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
          xmlhttp.open("POST", "https://cdn-api.co-vin.in/api/v2/appointment/schedule");
          xmlhttp.setRequestHeader("Content-Type", "application/json");
          xmlhttp.setRequestHeader("authorization", "Bearer "+ (sessionStorage["userToken"].replaceAll('"','')) );
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
      checkCoWinAvailability();
