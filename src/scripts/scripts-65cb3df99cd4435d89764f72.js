
          let campaignName = "";
          let onsiteAction = "Light Box Popup";
          let selectedOption = "Onsite Action";
          let timeOnPage = "3";
          let triggerType = "Time On Page";
          let scrollAmountToShow = "";
          let startDate = new Date("");
          let endDate = new Date(""); 
          function getCookie(name) {
            const value = "; " + document.cookie;
            const parts = value.split("; " + name + "=");
            return parts.length === 2 ? parts.pop().split(";").shift() : null;
        }
        
        const userIpCookie = getCookie('userCookie');
        let userIp, regionName, trafficSourceName;
        
        try {
            userIp = JSON.parse(userIpCookie);
            regionName = userIp.region_name;
            trafficSourceName = userIp.trafficSource;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        
        const regionType = regionName === "";
        const trafficSourceType = trafficSourceName === "";
        
        console.log('------>userInfo', regionName, trafficSourceName , regionType , trafficSourceType);
        console.log('---->you selected ', "", "");

          if (
            selectedOption === "Onsite Action" &&
            onsiteAction === "Light Box Popup" 
          ) {
            if (triggerType === "Time On Page") {
              const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");

              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "50%";
              popup.style.left = "50%";
              popup.style.transform = "translate(-50%, -50%)";
              popup.style.width = "300px";
              popup.style.height = "200px";
              popup.style.border = "1px solid gray";
              popup.style.backgroundColor = "#fff";
              popup.style.backgroundSize = "cover";
              popup.style.padding ="20px";
              popup.style.textAlign ="center";

              // Content.style.padding ="10px";
              Content.style.fontStyle ="normal";
              Content.style.fontSize ="20px";
              Content.style.color="white"

              heading.style.padding ="10px";
              popup.style.backgroundImage = "url(https://images.pexels.com/photos/5872364/pexels-photo-5872364.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "50 % ";
              Content.textContent = " Don't miss out. Why not treat yourself and receive 50% off your order";
  
              const closeButton = document.createElement("button");
              closeButton.innerHTML = "X";
              closeButton.style.position = "absolute";
              closeButton.style.top = "10px";
              closeButton.style.right = "10px";
              closeButton.style.cursor = "pointer";
    
              closeButton.addEventListener("click", () => {
                document.body.style.opacity = 1; // Restore opacity
                document.body.removeChild(popup);
              });
    
              popup.appendChild(heading);
              popup.appendChild(Content);
              popup.appendChild(closeButton);
              document.body.appendChild(popup);
              // document.body.style.opacity = 0.5;
              setTimeout(() => {
                closeButton.click();
              }, Number(timeOnPage) * 1000);
            }
          }
    
          if (triggerType === "Exit intent") {
            let popUpShown = false;
    
            const createPopup = () => {
              popup = document.createElement("div"); // Assign value to the popup variable
              const headingElement = document.createElement("h2");
              const contentElement = document.createElement("p");
    
              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "50%";
              popup.style.left = "50%";
              popup.style.transform = "translate(-50%, -50%)";
              popup.style.width = "300px";
              popup.style.height = "200px";
              popup.style.border = "1px solid gray";
              popup.style.backgroundColor = "#fff";
              popup.style.backgroundSize = "cover";
              popup.style.padding ="20px";
              popup.style.textAlign ="center";

              // contentElement.style.padding ="10px";
              contentElement.style.fontStyle ="normal";
              contentElement.style.fontSize ="20px";
              contentElement.style.color="white"

              headingElement.style.padding ="10px";

              popup.style.backgroundImage = "url(https://images.pexels.com/photos/5872364/pexels-photo-5872364.jpeg?auto=compress&cs=tinysrgb&w=600)";
              headingElement.textContent = "50 % ";
              contentElement.textContent = " Don't miss out. Why not treat yourself and receive 50% off your order";
  
              const closeButton = document.createElement("button");
              closeButton.innerHTML = "X";
              closeButton.style.position = "absolute";
              closeButton.style.top = "10px";
              closeButton.style.right = "10px";
              closeButton.style.cursor = "pointer";
    
              closeButton.addEventListener("click", () => {
                document.body.style.opacity = 1;
                document.body.removeChild(popup);
                popUpShown = false;
              });
    
              popup.appendChild(headingElement);
              popup.appendChild(contentElement);
              popup.appendChild(closeButton);
              document.body.appendChild(popup);
              // document.body.style.opacity = 0.5;
              popUpShown = true;
            };
            document.addEventListener("mouseout", function (evt) {
              if (evt.toElement == null && evt.relatedTarget == null) {
                createPopup(); // Call createPopup when mouse leaves the window
              }
            });
          }

          if (triggerType === "Date And Time") {

            const currentDate = new Date(); // Get the current date
            const currentSecond = currentDate.getSeconds(); // Get the current seconds                 
            console.log("startDate", startDate, "endDate", endDate, "currentDate", currentDate);
          
            if (
              selectedOption === "Onsite Action" &&
              onsiteAction === "Light Box Popup" &&
              currentDate >= startDate &&
              currentDate <= endDate
            ) {
              const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");
    
              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "50%";
              popup.style.left = "50%";
              popup.style.transform = "translate(-50%, -50%)";
              popup.style.width = "300px";
              popup.style.height = "200px";
              popup.style.border = "1px solid gray";
              popup.style.backgroundColor = "#fff";
              popup.style.backgroundSize = "cover";
              popup.style.padding = "20px";
              popup.style.textAlign = "center";
              Content.style.fontStyle ="normal";
              Content.style.fontSize ="20px";
              Content.style.color="white"
              heading.style.padding = "10px";
    
              popup.style.backgroundImage ="url(https://images.pexels.com/photos/5872364/pexels-photo-5872364.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "50 % ";
              Content.textContent =" Don't miss out. Why not treat yourself and receive 50% off your order";
    
              const closeButton = document.createElement("button");
              closeButton.innerHTML = "X";
              closeButton.style.position = "absolute";
              closeButton.style.top = "10px";
              closeButton.style.right = "10px";
              closeButton.style.cursor = "pointer";
    
              closeButton.addEventListener("click", () => {
                document.body.style.opacity = 1; // Restore opacity
                document.body.removeChild(popup);
              });
    
              popup.appendChild(heading);
              popup.appendChild(Content);
              popup.appendChild(closeButton);
              popup.appendChild(document.createElement("br")); // Line break for layout
              document.body.appendChild(popup);
            }
          }

          if (triggerType === "scroll") {
            let popUpShown = false;
      
            window.addEventListener("scroll", () => {
              const scrollableHeight =
                document.documentElement.scrollHeight - window.innerHeight;
              const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
      
              if (!popUpShown && scrollPercentage >= scrollAmountToShow) {
                const popup = document.createElement("div");
                const heading = document.createElement("h2");
                const Content = document.createElement("p");
      
                popup.style.position = "fixed";
                popup.style.overflow = "auto";
                popup.style.top = "50%";
                popup.style.left = "50%";
                popup.style.transform = "translate(-50%, -50%)";
                popup.style.width = "300px";
                popup.style.height = "200px";
                popup.style.border = "1px solid gray";
                popup.style.backgroundColor = "#fff";
                popup.style.backgroundSize = "cover";
                popup.style.padding = "20px";
                popup.style.textAlign = "center";
                Content.style.fontStyle ="normal";
                Content.style.fontSize ="20px";
                Content.style.color="white"
                heading.style.padding = "10px";
      
                popup.style.backgroundImage ="url(https://images.pexels.com/photos/5872364/pexels-photo-5872364.jpeg?auto=compress&cs=tinysrgb&w=600)";
                heading.textContent = "50 % ";
                Content.textContent =" Don't miss out. Why not treat yourself and receive 50% off your order";
      
                const closeButton = document.createElement("button");
                closeButton.innerHTML = "X";
                closeButton.style.position = "absolute";
                closeButton.style.top = "10px";
                closeButton.style.right = "10px";
                closeButton.style.cursor = "pointer";
      
                closeButton.addEventListener("click", () => {
                  document.body.style.opacity = 1; // Restore opacity
                  document.body.removeChild(popup);
                });
      
                popup.appendChild(heading);
                popup.appendChild(Content);
                popup.appendChild(closeButton);
      
                popup.appendChild(document.createElement("br")); // Line break for layout
      
                document.body.appendChild(popup);
                popUpShown = true;
              }
            });
          }
      