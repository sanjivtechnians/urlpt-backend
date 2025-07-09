
            let campaignName = "sattu";
            let onsiteAction = "Full Screen Welcome Mat";
            let selectedOption = "Onsite Action";
            let timeOnPage = "10";
            let scrollAmountToShow = "";
            let triggerType = "Time On Page";


            if (
              selectedOption === "Onsite Action" &&
              onsiteAction === "Full Screen Welcome Mat"
            ) {
              if (triggerType === "Time On Page"){
                const popup = document.createElement("div");
                const headingElement = document.createElement("h2");
                const contentElement = document.createElement("p");
                const emailInput = document.createElement("input");
                const subscribeButton = document.createElement("button");
                
                popup.style.position = "fixed";
                popup.style.top = "0";
                popup.style.left = "0";
                popup.style.width = "100vw"; // Set width to full viewport width
                popup.style.height = "100vh";
                popup.style.border = "2px solid #000";
                popup.style.backgroundColor = "#fff";
                popup.style.backgroundSize = "cover"; 
                popup.style.display = "flex";
                popup.style.justifyContent = "center";
                popup.style.alignItems = "center";
                popup.style.flexDirection = "column";
                contentElement.style.width = "85%";
                popup.style.backgroundImage = "url(https://images.pexels.com/photos/7130473/pexels-photo-7130473.jpeg?auto=compress&cs=tinysrgb&w=600)";
                headingElement.textContent = "Welcome to Simply Natural!";
                contentElement.textContent = "Subscribe to our newsletter and we'll send you a coupon for 20% off your first purchase.";

                emailInput.type = "email";
                emailInput.placeholder = "Enter your email";
                emailInput.style.width = "25%";
                emailInput.style.padding = "5px";
                emailInput.style.margin = "20px 0";
      
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
                  document.body.style.opacity = 1;
                  document.body.removeChild(popup);
                  document.body.removeChild(backgroundLock)
                  popUpShown = false;
                });
      
                popup.appendChild(headingElement);
                popup.appendChild(contentElement);
                popup.appendChild(closeButton);
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
                popup.appendChild(subscribeButton);
      
                document.body.appendChild(popup);
                setTimeout(() => {
                        closeButton.click();
                    }, Number(timeOnPage) * 1000);
      
                // document.body.style.opacity = 0.5;
                // popUpShown = true;
              }
            
            
            }
      
            if (triggerType === "Exit intent") {
              let popUpShown = false;
      
              const createPopup = () => {
                popup = document.createElement("div"); // Assign value to the popup variable
                const headingElement = document.createElement("h2");
                const contentElement = document.createElement("p");
                const emailInput = document.createElement("input");
                const subscribeButton = document.createElement("button");
                
    
                popup.style.position = "fixed";
                popup.style.top = "0";
                popup.style.left = "0";
                popup.style.width = "100vw"; // Set width to full viewport width
                popup.style.height = "100vh";
                popup.style.border = "2px solid #000";
                popup.style.backgroundColor = "#fff";
                popup.style.backgroundSize = "cover"; 
                popup.style.display = "flex";
                popup.style.justifyContent = "center";
                popup.style.alignItems = "center";
                popup.style.flexDirection = "column";
                contentElement.style.width = "85%";
                popup.style.backgroundImage = "url(https://images.pexels.com/photos/7130473/pexels-photo-7130473.jpeg?auto=compress&cs=tinysrgb&w=600)";
                headingElement.textContent = "Welcome to Simply Natural!";
                contentElement.textContent = "Subscribe to our newsletter and we'll send you a coupon for 20% off your first purchase.";

                emailInput.type = "email";
                emailInput.placeholder = "Enter your email";
                emailInput.style.width = "25%";
                emailInput.style.padding = "5px";
                emailInput.style.margin = "20px 0";

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
                  document.body.style.opacity = 1;
                  document.body.removeChild(popup);
                  document.body.removeChild(backgroundLock)
                  popUpShown = false;
                });
    
                popup.appendChild(headingElement);
                popup.appendChild(contentElement);
                popup.appendChild(closeButton);
                popup.appendChild(emailInput);
                popup.appendChild(document.createElement("br")); // Line break for layout
                popup.appendChild(subscribeButton);
                document.body.appendChild(popup);
     
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
                  const headingElement = document.createElement("h2");
                  const contentElement = document.createElement("p");
                  const emailInput = document.createElement("input");
                  const subscribeButton = document.createElement("button");
                        
                  popup.style.position = "fixed";
                  popup.style.top = "0";
                  popup.style.left = "0";
                  popup.style.width = "100vw"; // Set width to full viewport width
                  popup.style.height = "100vh";
                  popup.style.border = "2px solid #000";
                  popup.style.backgroundColor = "#fff";
                  popup.style.backgroundSize = "cover"; 
                  popup.style.display = "flex";
                  popup.style.justifyContent = "center";
                  popup.style.alignItems = "center";
                  popup.style.flexDirection = "column";
                  contentElement.style.width = "85%";
                  popup.style.backgroundImage = "url(https://images.pexels.com/photos/7130473/pexels-photo-7130473.jpeg?auto=compress&cs=tinysrgb&w=600)";
                  headingElement.textContent = "Welcome to Simply Natural!";
                  contentElement.textContent = "Subscribe to our newsletter and we'll send you a coupon for 20% off your first purchase.";

                  emailInput.type = "email";
                  emailInput.placeholder = "Enter your email";
                  emailInput.style.width = "25%";
                  emailInput.style.padding = "5px";
                  emailInput.style.margin = "20px 0";

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
                    document.body.style.opacity = 1;
                    document.body.removeChild(popup);
                    document.body.removeChild(backgroundLock)
                    popUpShown = false;
                  });
      
                  popup.appendChild(headingElement);
                  popup.appendChild(contentElement);
                  popup.appendChild(closeButton);
                  popup.appendChild(emailInput);
                  popup.appendChild(document.createElement("br")); // Line break for layout
                  popup.appendChild(subscribeButton);
                  document.body.appendChild(popup);
                  popUpShown = true;
                }
              });
            }
        
