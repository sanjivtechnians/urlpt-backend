
            let campaignName = "hello";
            let onsiteAction = "Content Unlock";
            let selectedOption = "Onsite Action";
            let timeOnPage = "100";
            let scrollAmountToShow = "null";
            let triggerType = "Time On Page";
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
              onsiteAction === "Content Unlock"  
            ) {
              if (triggerType === "Time On Page") {
                // Create a div to cover the background content
                const backgroundLock = document.createElement("div");
                backgroundLock.style.position = "fixed";
                backgroundLock.style.top = "0";
                backgroundLock.style.left = "0";
                backgroundLock.style.width = "100%";
                backgroundLock.style.height = "100%";
                backgroundLock.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // semi-transparent black background
                backgroundLock.style.zIndex = "999"; // Place it above other content
                document.body.appendChild(backgroundLock);
      
                const popup = document.createElement("div");
                const heading = document.createElement("h2");
                const content = document.createElement("p");
                const nameInput = document.createElement("input");
      
                const emailInput = document.createElement("input");
                const subscribeButton = document.createElement("button");
      
                popup.style.position = "absolute";
                popup.style.top = "50%";
                popup.style.left = "50%";
                popup.style.transform = "translate(-50%, -50%)";
                popup.style.width = "40%";
                popup.style.height = "40%";
                popup.style.border = "1px solid gray";
                popup.style.backgroundColor = "#fff";
                popup.style.textAlign = "center"; // Center align content
                popup.style.zIndex = "1000"; // Place it above the background lock
                popup.style.overflow = "auto";
                heading.textContent = "PREMIUM CONTENT";
                content.textContent = "Complete this form to unlock our exclusive content for free";
                popup.style.backgroundImage = "url(https://images.pexels.com/photos/17483906/pexels-photo-17483906/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-the-concept-of-artificial-general-intelligence-agi-it-was-created-by-domhnall-malone-as-part-of-the-visua.png?auto=compress&cs=tinysrgb&w=600)";

        
                nameInput.type = "text";
                nameInput.style.width = "80%";
                nameInput.placeholder = "Enter your name here...";
                nameInput.style.outline = "none";
                nameInput.style.padding = "10px";
                nameInput.style.borderRadius = "5px";
                nameInput.style.border = "none";

                emailInput.placeholder = "Enter your email here...";
                emailInput.type = "email";
                emailInput.style.width = "80%";
                emailInput.style.margin = "8px 0";
                emailInput.style.outline = "none";
                emailInput.style.padding = "10px";
                emailInput.style.borderRadius = "5px";
                emailInput.style.border = "none";

        
                subscribeButton.textContent = "Subscribe";
                subscribeButton.style.padding = "8px 20px";
                subscribeButton.style.cursor = "pointer";
                subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
                subscribeButton.style.color = "#fff";
                subscribeButton.style.border = "none";
                subscribeButton.style.borderRadius = "5px";
        
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
                  document.body.removeChild(popup);
                  document.body.removeChild(backgroundLock); // Remove the background lock
                });
        
                popup.appendChild(heading);
                popup.appendChild(content);
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
                onsiteAction === "Content Unlock" &&
                currentDate >= startDate &&
                currentDate <= endDate
              ) {
                const backgroundLock = document.createElement("div");
                backgroundLock.style.position = "fixed";
                backgroundLock.style.top = "0";
                backgroundLock.style.left = "0";
                backgroundLock.style.width = "100%";
                backgroundLock.style.height = "100%";
                backgroundLock.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // semi-transparent black background
                backgroundLock.style.zIndex = "999"; // Place it above other content
                document.body.appendChild(backgroundLock);
      
                const popup = document.createElement("div");
                const heading = document.createElement("h2");
                const content = document.createElement("p");
                const nameInput = document.createElement("input");
      
                const emailInput = document.createElement("input");
                const subscribeButton = document.createElement("button");
      
                popup.style.position = "absolute";
                popup.style.top = "50%";
                popup.style.left = "50%";
                popup.style.transform = "translate(-50%, -50%)";
                popup.style.width = "40%";
                popup.style.height = "40%";
                popup.style.border = "1px solid gray";
                popup.style.backgroundColor = "#fff";
                popup.style.textAlign = "center"; // Center align content
                popup.style.zIndex = "1000"; // Place it above the background lock
                popup.style.overflow = "auto";
                heading.textContent = "PREMIUM CONTENT";
                content.textContent = "Complete this form to unlock our exclusive content for free";
                popup.style.backgroundImage = "url(https://images.pexels.com/photos/17483906/pexels-photo-17483906/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-the-concept-of-artificial-general-intelligence-agi-it-was-created-by-domhnall-malone-as-part-of-the-visua.png?auto=compress&cs=tinysrgb&w=600)";

        
                nameInput.type = "text";
                nameInput.style.width = "80%";
                nameInput.placeholder = "Enter your name here...";
                nameInput.style.outline = "none";
                nameInput.style.padding = "10px";
                nameInput.style.borderRadius = "5px";
                nameInput.style.border = "none";

                emailInput.placeholder = "Enter your email here...";
                emailInput.type = "email";
                emailInput.style.width = "80%";
                emailInput.style.margin = "8px 0";
                emailInput.style.outline = "none";
                emailInput.style.padding = "10px";
                emailInput.style.borderRadius = "5px";
                emailInput.style.border = "none";

        
                subscribeButton.textContent = "Subscribe";
                subscribeButton.style.padding = "8px 20px";
                subscribeButton.style.cursor = "pointer";
                subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
                subscribeButton.style.color = "#fff";
                subscribeButton.style.border = "none";
                subscribeButton.style.borderRadius = "5px";
        
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
                  document.body.removeChild(popup);
                  document.body.removeChild(backgroundLock); // Remove the background lock
                });
        
                popup.appendChild(heading);
                popup.appendChild(content);
                popup.appendChild(closeButton);
                popup.appendChild(nameInput);
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
                popup.appendChild(subscribeButton);
                document.body.appendChild(popup);

              }}
                  
             if (triggerType === "scroll") {
              let popUpShown = false;
      
              window.addEventListener("scroll", () => {
                const scrollableHeight =
                  document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = (window.scrollY / scrollableHeight) * 100;
      
                if (!popUpShown && scrollPercentage >= scrollAmountToShow) {
                  // Create a div to cover the background content
                  const backgroundLock = document.createElement("div");
                  backgroundLock.style.position = "fixed";
                  backgroundLock.style.top = "0";
                  backgroundLock.style.left = "0";
                  backgroundLock.style.width = "100%";
                  backgroundLock.style.height = "100%";
                  backgroundLock.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // semi-transparent black background
                  backgroundLock.style.zIndex = "999"; // Place it above other content
                  document.body.appendChild(backgroundLock);
        
                  const popup = document.createElement("div");
                  const heading = document.createElement("h2");
                  const content = document.createElement("p");
                  const nameInput = document.createElement("input");
        
                  const emailInput = document.createElement("input");
                  const subscribeButton = document.createElement("button");
        
                  popup.style.position = "fixed";
                  popup.style.top = "50%";
                  popup.style.left = "50%";
                  popup.style.transform = "translate(-50%, -50%)";
                  popup.style.width = "40%";
                  popup.style.height = "40%";
                  popup.style.border = "1px solid gray";
                  popup.style.backgroundColor = "#fff";
                  popup.style.textAlign = "center"; // Center align content
                  popup.style.zIndex = "1000"; // Place it above the background lock
                  popup.style.overflow = "auto";
                  heading.textContent = "PREMIUM CONTENT";
                  content.textContent = "Complete this form to unlock our exclusive content for free";
                  popup.style.backgroundImage = "url(https://images.pexels.com/photos/17483906/pexels-photo-17483906/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-the-concept-of-artificial-general-intelligence-agi-it-was-created-by-domhnall-malone-as-part-of-the-visua.png?auto=compress&cs=tinysrgb&w=600)";

      
                  nameInput.type = "text";
                  nameInput.style.width = "80%";
                  nameInput.placeholder = "Enter your name here...";
                  nameInput.style.outline = "none";
                  nameInput.style.padding = "10px";
                  nameInput.style.borderRadius = "5px";
                  nameInput.style.border = "none";
  
                  emailInput.placeholder = "Enter your email here...";
                  emailInput.type = "email";
                  emailInput.style.width = "80%";
                  emailInput.style.margin = "8px 0";
                  emailInput.style.outline = "none";
                  emailInput.style.padding = "10px";
                  emailInput.style.borderRadius = "5px";
                  emailInput.style.border = "none";

      
                  subscribeButton.textContent = "Subscribe";
                  subscribeButton.style.padding = "8px 20px";
                  subscribeButton.style.cursor = "pointer";
                  subscribeButton.style.backgroundColor = "#007bff"; // Blue color for the button
                  subscribeButton.style.color = "#fff";
                  subscribeButton.style.border = "none";
                  subscribeButton.style.borderRadius = "5px";
      
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
                    document.body.removeChild(popup);
                    document.body.removeChild(backgroundLock); // Remove the background lock
                  });
      
                  popup.appendChild(heading);
                  popup.appendChild(content);
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
        