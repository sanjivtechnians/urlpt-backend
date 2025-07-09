
          let campaignName = "ttes";
          let onsiteAction = "Side Bar";
          let selectedOption = "Onsite Action";
          let timeOnPage = "77";
          let triggerType = "Time On Page";
          let scrollAmountToShow = "null";
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
        
        console.log('------>userInfo', regionName, trafficSourceName);
        console.log('---->you selected ', "", "");
                  
          if (
            selectedOption === "Onsite Action" &&
            onsiteAction === "Side Bar"  
          ) {
            if (triggerType === "Time On Page") {
              const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");
              const nameInput = document.createElement("input");
              const emailInput = document.createElement("input");
              const subscribeButton = document.createElement("button");

              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "30%";
              popup.style.right = "0%";
              popup.style.width = "300px";
              popup.style.height = "50%";
              popup.style.border = "1px solid gray";
              popup.style.backgroundSize = "300px 645px",
              popup.style.backgroundColor = "#fff";
              popup.style.textAlign ="center"

              Content.style.fontSize ="18px";

              heading.style.padding ="10px";
              popup.style.backgroundImage = "url(https://images.pexels.com/photos/3847486/pexels-photo-3847486.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "Gardening Monthly";
              Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
  
              nameInput.type = "text";
              nameInput.placeholder = "Enter your name here...";
              nameInput.style.width = "70%";
              nameInput.style.padding = "14px";
              nameInput.style.outline = "none";
              nameInput.style.border = "none";
              nameInput.style.borderRadius = "5px";
              // nameInput.style.marginLeft="24px";
  
            emailInput.type = "email";
            emailInput.placeholder = "Enter your email here...";
            emailInput.style.margin = "8px 0px";
            emailInput.style.width = "70%";
            emailInput.style.padding = "14px";
            emailInput.style.outline = "none";
            emailInput.style.border = "none";
            emailInput.style.borderRadius = "5px";
  
            subscribeButton.textContent = "Subscribe";
            subscribeButton.style.padding = "8px 0px";
            subscribeButton.style.cursor = "pointer";
            subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
            subscribeButton.style.color = "#fff";
            subscribeButton.style.border = "none";
            subscribeButton.style.borderRadius = "5px";
            subscribeButton.style.fontSize = "16px";
            // subscribeButton.style.margin = " 0px 26px";
            subscribeButton.style.width = "80%";
  
  
            subscribeButton.addEventListener("click", () => {
              const email = emailInput.value;
              console.log("Subscribed email:", email);
              // Close the popup and remove background lock
              document.body.removeChild(popup);
              document.body.removeChild(backgroundLock);
            });
  
    
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
                popup.appendChild(nameInput);
  
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
  
                popup.appendChild(subscribeButton);
  
                document.body.appendChild(popup);
    
              setTimeout(() => {
                closeButton.click();
              }, Number(timeOnPage) * 1000);
            }
          }
    
          if (triggerType === "Date And Time") {

            const currentDate = new Date(); // Get the current date
            const currentSecond = currentDate.getSeconds(); // Get the current seconds                 
            console.log("startDate", startDate, "endDate", endDate, "currentDate", currentDate);
          
            if (
              selectedOption === "Onsite Action" &&
              onsiteAction === "Side Bar" &&
              currentDate >= startDate &&
              currentDate <= endDate
            ) {

              const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");
              const nameInput = document.createElement("input");
              const emailInput = document.createElement("input");
              const subscribeButton = document.createElement("button");

              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "30%";
              popup.style.right = "0%";
              popup.style.width = "300px";
              popup.style.height = "50%";
              popup.style.border = "1px solid gray";
              popup.style.backgroundSize = "300px 645px",
              popup.style.backgroundColor = "#fff";
              popup.style.textAlign ="center"

              Content.style.fontSize ="18px";

              heading.style.padding ="10px";

              popup.style.backgroundImage = "url(https://images.pexels.com/photos/3847486/pexels-photo-3847486.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "Gardening Monthly";
              Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
  
              nameInput.type = "text";
              nameInput.placeholder = "Enter your name here...";
              nameInput.style.width = "70%";
              nameInput.style.padding = "14px";
              nameInput.style.outline = "none";
              nameInput.style.border = "none";
              nameInput.style.borderRadius = "5px";
              // nameInput.style.marginLeft="24px";
  
            emailInput.type = "email";
            emailInput.placeholder = "Enter your email here...";
            emailInput.style.margin = "8px 0px";
            emailInput.style.width = "70%";
            emailInput.style.padding = "14px";
            emailInput.style.outline = "none";
            emailInput.style.border = "none";
            emailInput.style.borderRadius = "5px";
  
            subscribeButton.textContent = "Subscribe";
            subscribeButton.style.padding = "8px 0px";
            subscribeButton.style.cursor = "pointer";
            subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
            subscribeButton.style.color = "#fff";
            subscribeButton.style.border = "none";
            subscribeButton.style.borderRadius = "5px";
            subscribeButton.style.fontSize = "16px";
            // subscribeButton.style.margin = " 0px 26px";
            subscribeButton.style.width = "80%";
  
  
            subscribeButton.addEventListener("click", () => {
              const email = emailInput.value;
              console.log("Subscribed email:", email);
              // Close the popup and remove background lock
              document.body.removeChild(popup);
              document.body.removeChild(backgroundLock);
            });
  
    
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
                popup.appendChild(nameInput);
  
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
  
                popup.appendChild(subscribeButton);
  
                document.body.appendChild(popup);



            }}
          if (triggerType === "Exit intent") {
            let popUpShown = false;
    
            const createPopup = () => {
              const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");
              const nameInput = document.createElement("input");
              const emailInput = document.createElement("input");
              const subscribeButton = document.createElement("button");

              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "30%";
              popup.style.right = "0%";
              popup.style.width = "300px";
              popup.style.height = "50%";
              popup.style.border = "1px solid gray";
              popup.style.backgroundSize = "300px 645px",
              popup.style.backgroundColor = "#fff";
              popup.style.textAlign ="center"

              Content.style.fontSize ="18px";

              heading.style.padding ="10px";

              popup.style.backgroundImage = "url(https://images.pexels.com/photos/3847486/pexels-photo-3847486.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "Gardening Monthly";
              Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
  
              nameInput.type = "text";
              nameInput.placeholder = "Enter your name here...";
              nameInput.style.width = "70%";
              nameInput.style.padding = "14px";
              nameInput.style.outline = "none";
              nameInput.style.border = "none";
              nameInput.style.borderRadius = "5px";
              // nameInput.style.marginLeft="24px";
  
            emailInput.type = "email";
            emailInput.placeholder = "Enter your email here...";
            emailInput.style.margin = "8px 0px";
            emailInput.style.width = "70%";
            emailInput.style.padding = "14px";
            emailInput.style.outline = "none";
            emailInput.style.border = "none";
            emailInput.style.borderRadius = "5px";
  
            subscribeButton.textContent = "Subscribe";
            subscribeButton.style.padding = "8px 0px";
            subscribeButton.style.cursor = "pointer";
            subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
            subscribeButton.style.color = "#fff";
            subscribeButton.style.border = "none";
            subscribeButton.style.borderRadius = "5px";
            subscribeButton.style.fontSize = "16px";
            // subscribeButton.style.margin = " 0px 26px";
            subscribeButton.style.width = "80%";
  
  
            subscribeButton.addEventListener("click", () => {
              const email = emailInput.value;
              console.log("Subscribed email:", email);
              // Close the popup and remove background lock
              document.body.removeChild(popup);
              document.body.removeChild(backgroundLock);
            });
  
    
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
                popup.appendChild(nameInput);
  
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
  
                popup.appendChild(subscribeButton);
  
                document.body.appendChild(popup);
              popUpShown = true;
            };
            document.addEventListener("mouseout", function (evt) {
              if (evt.toElement == null && evt.relatedTarget == null) {
                createPopup(); // Call createPopup when mouse leaves the window
              }
            });
          }
          if (triggerType === "scroll") {
            let popUpShown = false;
    
            window.addEventListener("scroll", () => {
              const scrollableHeight =
                document.documentElement.scrollHeight - window.innerHeight;
              const scrollPercentage =
                (window.scrollY / scrollableHeight) * 100;

              if (!popUpShown && scrollPercentage >= scrollAmountToShow) {
                const popup = document.createElement("div");
              const heading = document.createElement("h2");
              const Content = document.createElement("p");
              const nameInput = document.createElement("input");
              const emailInput = document.createElement("input");
              const subscribeButton = document.createElement("button");

              popup.style.position = "fixed";
              popup.style.overflow = "auto";
              popup.style.top = "30%";
              popup.style.right = "0%";
              popup.style.width = "300px";
              popup.style.height = "50%";
              popup.style.border = "1px solid gray";
              popup.style.backgroundSize = "300px 645px",
              popup.style.backgroundColor = "#fff";
              popup.style.textAlign ="center"

              Content.style.fontSize ="18px";

              heading.style.padding ="10px";

              popup.style.backgroundImage = "url(https://images.pexels.com/photos/3847486/pexels-photo-3847486.jpeg?auto=compress&cs=tinysrgb&w=600)";
              heading.textContent = "Gardening Monthly";
              Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
  
              nameInput.type = "text";
              nameInput.placeholder = "Enter your name here...";
              nameInput.style.width = "70%";
              nameInput.style.padding = "14px";
              nameInput.style.outline = "none";
              nameInput.style.border = "none";
              nameInput.style.borderRadius = "5px";
              // nameInput.style.marginLeft="24px";
  
            emailInput.type = "email";
            emailInput.placeholder = "Enter your email here...";
            emailInput.style.margin = "8px 0px";
            emailInput.style.width = "70%";
            emailInput.style.padding = "14px";
            emailInput.style.outline = "none";
            emailInput.style.border = "none";
            emailInput.style.borderRadius = "5px";
  
            subscribeButton.textContent = "Subscribe";
            subscribeButton.style.padding = "8px 0px";
            subscribeButton.style.cursor = "pointer";
            subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
            subscribeButton.style.color = "#fff";
            subscribeButton.style.border = "none";
            subscribeButton.style.borderRadius = "5px";
            subscribeButton.style.fontSize = "16px";
            // subscribeButton.style.margin = " 0px 26px";
            subscribeButton.style.width = "80%";
  
  
            subscribeButton.addEventListener("click", () => {
              const email = emailInput.value;
              console.log("Subscribed email:", email);
              // Close the popup and remove background lock
              document.body.removeChild(popup);
              document.body.removeChild(backgroundLock);
            });
  
    
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
                popup.appendChild(nameInput);
  
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
  
                popup.appendChild(subscribeButton);
  
                document.body.appendChild(popup);
                popUpShown = true;
              }
            });
          }
      