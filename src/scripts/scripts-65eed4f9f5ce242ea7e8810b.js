
       let campaignName = "testing";
       let onsiteAction = "Inline Form";
       let selectedOption = "Onsite Action";
       let timeOnPage = "20";
       let triggerType = "Exit intent";
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
    
    console.log('------>userInfo', regionName, trafficSourceName);
    console.log('---->you selected ', "", "");
               
       if (
         selectedOption === "Onsite Action" &&
         onsiteAction === "Inline Form"
       ) {
         if (triggerType === "Time On Page") {
          const popup = document.createElement("div");
            const headingContentDiv = document.createElement("div");
            const formDiv = document.createElement("div");
            const heading = document.createElement("h2");
            const Content = document.createElement("p");
            const nameInput = document.createElement("input");
            const emailInput = document.createElement("input");
            const subscribeButton = document.createElement("button");

            popup.style.position = "fixed";
            popup.style.overflow = "auto";
            popup.style.top = "26%";
            popup.style.right = "0%";
            popup.style.width = "100%";
            popup.style.height = "24%";
            popup.style.border = "2px solid #000";
            popup.style.backgroundColor = "#fff";
            (popup.style.backgroundSize = "300px 645px"),
              (popup.style.border = "1px solid gray");
            popup.style.backgroundColor = "#fff";
            popup.style.display = "flex";
            popup.style.alignItems = "center";

           popup.style.backgroundImage = "url(https://images.pexels.com/photos/7078712/pexels-photo-7078712.jpeg?auto=compress&cs=tinysrgb&w=600)";
           heading.textContent = "If you like this blog, you'll LOVE our free ebook!";
           heading.style.paddingLeft = "24px";
          heading.style.marginTop = "10px";
          heading.style.width = "max-content";
          heading.style.fontSize = "28px";

           Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
           Content.style.paddingLeft = "50px";
           Content.style.fontStyle = "normal";
           Content.style.fontSize = "24px";
           Content.style.color = "white";
           Content.style.width = "78%";


        nameInput.type = "text";
            nameInput.placeholder = "Enter your name here...";
            nameInput.style.width = "70%";
            nameInput.style.padding = "10px";
            nameInput.style.outline = "none";
            nameInput.style.border = "none";
            nameInput.style.borderRadius = "5px";

            emailInput.type = "email";
            emailInput.placeholder = "Enter your email here...";
            emailInput.style.margin = "8px 0";
            emailInput.style.width = "70%";
            emailInput.style.padding = "10px";
            emailInput.style.outline = "none";
            emailInput.style.border = "none";
            emailInput.style.borderRadius = "5px";

            subscribeButton.textContent = "Subscribe";
            subscribeButton.style.width = "72%";
            subscribeButton.style.padding = "10px";
            subscribeButton.style.cursor = "pointer";
            subscribeButton.style.backgroundColor = "#007bff";
                   subscribeButton.style.color = "#fff";
            subscribeButton.style.border = "none";
            subscribeButton.style.borderRadius = "5px";
            subscribeButton.style.fontSize = "16px";
            subscribeButton.style.margin = "0px 10px 0px 10px";

            subscribeButton.addEventListener("click", () => {
              const email = emailInput.value;
              console.log("Subscribed email:", email);
          
              document.body.removeChild(popup);
              document.body.removeChild(backgroundLock);
            });

            formDiv.style.display = "flex";
            formDiv.style.flexDirection = "column";
            formDiv.style.alignItems = "center";
            // formDiv.style.marginTop = "20px";
            formDiv.style.width = "70%";

            // headingContentDiv.style.width = "80%";
            headingContentDiv.appendChild(heading);
            headingContentDiv.appendChild(Content);

            formDiv.appendChild(nameInput);
            formDiv.appendChild(emailInput);
            formDiv.appendChild(subscribeButton);

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

            popup.appendChild(closeButton);
            popup.appendChild(headingContentDiv);
            popup.appendChild(formDiv);
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
          onsiteAction === "Inline Form" &&
          currentDate >= startDate &&
          currentDate <= endDate
           ){
            const popup = document.createElement("div");
            const headingContentDiv = document.createElement("div");
            const formDiv = document.createElement("div");
            const heading = document.createElement("h2");
            const Content = document.createElement("p");
            const nameInput = document.createElement("input");
            const emailInput = document.createElement("input");
            const subscribeButton = document.createElement("button");

            popup.style.position = "fixed";
            popup.style.overflow = "auto";
            popup.style.top = "26%";
            popup.style.right = "0%";
            popup.style.width = "100%";
            popup.style.height = "24%";
            popup.style.border = "2px solid #000";
            popup.style.backgroundColor = "#fff";
            (popup.style.backgroundSize = "300px 645px"),
              (popup.style.border = "1px solid gray");
            popup.style.backgroundColor = "#fff";
            popup.style.display = "flex";
            popup.style.alignItems = "center";

             popup.style.backgroundImage = "url(https://images.pexels.com/photos/7078712/pexels-photo-7078712.jpeg?auto=compress&cs=tinysrgb&w=600)";
             heading.textContent = "If you like this blog, you'll LOVE our free ebook!";
             heading.style.paddingLeft = "24px";
            heading.style.marginTop = "10px";
            heading.style.width = "max-content";
            heading.style.fontSize = "28px";

             Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
             Content.style.paddingLeft = "50px";
             Content.style.fontStyle = "normal";
             Content.style.fontSize = "24px";
             Content.style.color = "white";
             Content.style.width = "78%";
 
             nameInput.type = "text";
             nameInput.placeholder = "Enter your name here...";
             nameInput.style.width = "70%";
             nameInput.style.padding = "10px";
             nameInput.style.outline = "none";
             nameInput.style.border = "none";
             nameInput.style.borderRadius = "5px";
 
             emailInput.type = "email";
             emailInput.placeholder = "Enter your email here...";
             emailInput.style.margin = "8px 0";
             emailInput.style.width = "70%";
             emailInput.style.padding = "10px";
             emailInput.style.outline = "none";
             emailInput.style.border = "none";
             emailInput.style.borderRadius = "5px";
 
             subscribeButton.textContent = "Subscribe";
             subscribeButton.style.width = "72%";
             subscribeButton.style.padding = "10px";
             subscribeButton.style.cursor = "pointer";
             subscribeButton.style.backgroundColor = "#007bff";
                    subscribeButton.style.color = "#fff";
             subscribeButton.style.border = "none";
             subscribeButton.style.borderRadius = "5px";
             subscribeButton.style.fontSize = "16px";
             subscribeButton.style.margin = "0px 10px 0px 10px";
 
             subscribeButton.addEventListener("click", () => {
               const email = emailInput.value;
               console.log("Subscribed email:", email);
           
               document.body.removeChild(popup);
               document.body.removeChild(backgroundLock);
             });
 
             formDiv.style.display = "flex";
             formDiv.style.flexDirection = "column";
             formDiv.style.alignItems = "center";
             // formDiv.style.marginTop = "20px";
             formDiv.style.width = "70%";
 
             // headingContentDiv.style.width = "80%";
             headingContentDiv.appendChild(heading);
             headingContentDiv.appendChild(Content);
 
             formDiv.appendChild(nameInput);
             formDiv.appendChild(emailInput);
             formDiv.appendChild(subscribeButton);
 
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
 
             popup.appendChild(closeButton);
             popup.appendChild(headingContentDiv);
             popup.appendChild(formDiv);
             document.body.appendChild(popup);
           }

        }
 
       if (triggerType === "Exit intent") {
         let popUpShown = false;
 
         const createPopup = () => {
          const popup = document.createElement("div");
          const headingContentDiv = document.createElement("div");
          const formDiv = document.createElement("div");
          const heading = document.createElement("h2");
          const Content = document.createElement("p");
          const nameInput = document.createElement("input");
          const emailInput = document.createElement("input");
          const subscribeButton = document.createElement("button");

          popup.style.position = "fixed";
          popup.style.overflow = "auto";
          popup.style.top = "26%";
          popup.style.right = "0%";
          popup.style.width = "100%";
          popup.style.height = "24%";
          popup.style.border = "2px solid #000";
          popup.style.backgroundColor = "#fff";
          (popup.style.backgroundSize = "300px 645px"),
            (popup.style.border = "1px solid gray");
          popup.style.backgroundColor = "#fff";
          popup.style.display = "flex";
          popup.style.alignItems = "center";

           popup.style.backgroundImage = "url(https://images.pexels.com/photos/7078712/pexels-photo-7078712.jpeg?auto=compress&cs=tinysrgb&w=600)";
           heading.textContent = "If you like this blog, you'll LOVE our free ebook!";
           heading.style.paddingLeft = "24px";
          heading.style.marginTop = "10px";
          heading.style.width = "max-content";
          heading.style.fontSize = "28px";

           Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
           Content.style.paddingLeft = "50px";
           Content.style.fontStyle = "normal";
           Content.style.fontSize = "24px";
           Content.style.color = "white";
           Content.style.width = "78%";

           nameInput.type = "text";
           nameInput.placeholder = "Enter your name here...";
           nameInput.style.width = "70%";
           nameInput.style.padding = "10px";
           nameInput.style.outline = "none";
           nameInput.style.border = "none";
           nameInput.style.borderRadius = "5px";

           emailInput.type = "email";
           emailInput.placeholder = "Enter your email here...";
           emailInput.style.margin = "8px 0";
           emailInput.style.width = "70%";
           emailInput.style.padding = "10px";
           emailInput.style.outline = "none";
           emailInput.style.border = "none";
           emailInput.style.borderRadius = "5px";

           subscribeButton.textContent = "Subscribe";
           subscribeButton.style.width = "72%";
           subscribeButton.style.padding = "10px";
           subscribeButton.style.cursor = "pointer";
           subscribeButton.style.backgroundColor = "#007bff";
                  subscribeButton.style.color = "#fff";
           subscribeButton.style.border = "none";
           subscribeButton.style.borderRadius = "5px";
           subscribeButton.style.fontSize = "16px";
           subscribeButton.style.margin = "0px 10px 0px 10px";

           subscribeButton.addEventListener("click", () => {
             const email = emailInput.value;
             console.log("Subscribed email:", email);
         
             document.body.removeChild(popup);
             document.body.removeChild(backgroundLock);
           });

           formDiv.style.display = "flex";
           formDiv.style.flexDirection = "column";
           formDiv.style.alignItems = "center";
           // formDiv.style.marginTop = "20px";
           formDiv.style.width = "70%";

           // headingContentDiv.style.width = "80%";
           headingContentDiv.appendChild(heading);
           headingContentDiv.appendChild(Content);

           formDiv.appendChild(nameInput);
           formDiv.appendChild(emailInput);
           formDiv.appendChild(subscribeButton);

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

           popup.appendChild(closeButton);
           popup.appendChild(headingContentDiv);
           popup.appendChild(formDiv);
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
            const headingContentDiv = document.createElement("div");
            const formDiv = document.createElement("div");
            const heading = document.createElement("h2");
            const Content = document.createElement("p");
            const nameInput = document.createElement("input");
            const emailInput = document.createElement("input");
            const subscribeButton = document.createElement("button");

            popup.style.position = "fixed";
            popup.style.overflow = "auto";
            popup.style.top = "26%";
            popup.style.right = "0%";
            popup.style.width = "100%";
            popup.style.height = "24%";
            popup.style.border = "2px solid #000";
            popup.style.backgroundColor = "#fff";
            (popup.style.backgroundSize = "300px 645px"),
              (popup.style.border = "1px solid gray");
            popup.style.backgroundColor = "#fff";
            popup.style.display = "flex";
            popup.style.alignItems = "center";

             popup.style.backgroundImage = "url(https://images.pexels.com/photos/7078712/pexels-photo-7078712.jpeg?auto=compress&cs=tinysrgb&w=600)";
             heading.textContent = "If you like this blog, you'll LOVE our free ebook!";
             heading.style.paddingLeft = "24px";
            heading.style.marginTop = "10px";
            heading.style.width = "max-content";
            heading.style.fontSize = "28px";

             Content.textContent = "Subscribe to our newsletter for tips, coupons, and more.";
             Content.style.paddingLeft = "50px";
             Content.style.fontStyle = "normal";
             Content.style.fontSize = "24px";
             Content.style.color = "white";
             Content.style.width = "78%";
 
             nameInput.type = "text";
             nameInput.placeholder = "Enter your name here...";
             nameInput.style.width = "70%";
             nameInput.style.padding = "10px";
             nameInput.style.outline = "none";
             nameInput.style.border = "none";
             nameInput.style.borderRadius = "5px";
 
             emailInput.type = "email";
             emailInput.placeholder = "Enter your email here...";
             emailInput.style.margin = "8px 0";
             emailInput.style.width = "70%";
             emailInput.style.padding = "10px";
             emailInput.style.outline = "none";
             emailInput.style.border = "none";
             emailInput.style.borderRadius = "5px";
 
             subscribeButton.textContent = "Subscribe";
             subscribeButton.style.width = "72%";
             subscribeButton.style.padding = "10px";
             subscribeButton.style.cursor = "pointer";
             subscribeButton.style.backgroundColor = "#007bff";
                    subscribeButton.style.color = "#fff";
             subscribeButton.style.border = "none";
             subscribeButton.style.borderRadius = "5px";
             subscribeButton.style.fontSize = "16px";
             subscribeButton.style.margin = "0px 10px 0px 10px";
 
             subscribeButton.addEventListener("click", () => {
               const email = emailInput.value;
               console.log("Subscribed email:", email);
           
               document.body.removeChild(popup);
               document.body.removeChild(backgroundLock);
             });
 
             formDiv.style.display = "flex";
             formDiv.style.flexDirection = "column";
             formDiv.style.alignItems = "center";
             // formDiv.style.marginTop = "20px";
             formDiv.style.width = "70%";
 
             // headingContentDiv.style.width = "80%";
             headingContentDiv.appendChild(heading);
             headingContentDiv.appendChild(Content);
 
             formDiv.appendChild(nameInput);
             formDiv.appendChild(emailInput);
             formDiv.appendChild(subscribeButton);
 
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
 
             popup.appendChild(closeButton);
             popup.appendChild(headingContentDiv);
             popup.appendChild(formDiv);
             document.body.appendChild(popup);
             popUpShown = true;
           }
         });
       }
   