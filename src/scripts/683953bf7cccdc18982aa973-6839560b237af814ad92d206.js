(function () {
            try {
                var popUpShown = false;
                var completelyClosed = false;

                if (localStorage.getItem('6839560b237af814ad92d206') === 'true' || 
                    (localStorage.getItem("6839560b237af814ad92d206_count") && 
                    parseInt(localStorage.getItem("6839560b237af814ad92d206_count")) >= "1")) {
                    return;
                }

                function createMiniButton() {
                    const isMobile = window.innerWidth < 600;
                    const miniBtnContainer = document.createElement('div');
                    miniBtnContainer.style.cssText = isMobile ? 
                        'position: fixed; bottom: 0; left: 0; width: 100%; display: flex; justify-content: space-between; align-items: center; background-color: #000000; color: #FFFFFF; box-shadow: 0 -2px 5px rgba(0,0,0,0.2); z-index: 99999998; padding: 0.75rem 1rem;' : 
                        'position: fixed; bottom: 20px; left: 20px; display: flex; align-items: center; background-color: #000000; color: #FFFFFF; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 99999998;';

                    const miniBtn = document.createElement('button');
                    miniBtn.textContent = 'This is the teaser';
                    miniBtn.style.cssText = isMobile ? 
                        'font-size: 1rem; font-weight: 700; padding: 0.5rem 1rem; border: none; background: transparent; color: inherit; cursor: pointer; flex: 1; text-align: left;' : 
                        'font-size: 1rem; font-weight: 700; padding: 0.5rem 1rem; border: none; background: transparent; color: inherit; cursor: pointer;';

                    const divider = document.createElement('span');
                    divider.style.cssText = isMobile ? 
                        'display: none;' : 
                        'width: 1px; height: 20px; background-color: rgba(255,255,255,0.3);';

                    const permanentCloseBtn = document.createElement('button');
                    permanentCloseBtn.innerHTML = '×';
                    permanentCloseBtn.style.cssText = isMobile ? 
                        'font-size: 1.5rem; font-weight: bold; padding: 0 0.75rem; border: none; background: transparent; color: inherit; cursor: pointer; display: flex; align-items: center;' : 
                        'font-size: 1.5rem; font-weight: bold; padding: 0 0.75rem; height: 100%; border: none; background: transparent; color: inherit; cursor: pointer; display: flex; align-items: center;';
                    permanentCloseBtn.title = 'Permanently close';

                    miniBtn.onclick = () => {
                        main();
                        miniBtnContainer.remove();
                    };

                    permanentCloseBtn.onclick = (e) => {
                        e.stopPropagation();
                        completelyClosePopup();
                        miniBtnContainer.remove();
                    };

                    miniBtnContainer.appendChild(miniBtn);
                    if (!isMobile) {
                        miniBtnContainer.appendChild(divider);
                    }
                    miniBtnContainer.appendChild(permanentCloseBtn);
                    document.body.appendChild(miniBtnContainer);
                }

                function completelyClosePopup() {
                    completelyClosed = true;
                    localStorage.setItem('6839560b237af814ad92d206', 'true');
                    const overlay = document.querySelector('div[data-popup="true"]');
                    if (overlay) overlay.remove();
                    document.body.style.overflow = '';
                }

                function main() {
                    if (popUpShown || completelyClosed) return;
                    popUpShown = true;

                    // Increment the show count
                    const currentCount = parseInt(localStorage.getItem("6839560b237af814ad92d206_count")) || 0;
                    localStorage.setItem("6839560b237af814ad92d206_count", (currentCount + 1).toString());

                    const isMobile = window.innerWidth < 600;
                    document.body.style.overflow = 'hidden';
                    const overlay = document.createElement('div');
                    overlay.setAttribute('data-popup', 'true');
                    overlay.style.cssText = 
                        'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 99999999; padding: 1rem; box-sizing: border-box;';

                    const container = document.createElement('div');
                    container.style.cssText = isMobile ? 
                        'position: relative; width: 100%; max-width: 90vw; border: 1px solid #D2D2D2; border-radius: 0.75rem; padding: 1.5rem 1rem 1rem; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; align-items: center; text-align: center; box-sizing: border-box; max-height: 90vh; overflow-y: auto;' : 
                        'position: fixed; bottom: 15px; left: 30px; width: 400.56px; max-width: 100%; border: 1px solid #D2D2D2; border-radius: 0.75rem; padding: 1.5rem 1rem 1rem; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; box-sizing: border-box;';

                    const closeBtn = document.createElement('button');
                    closeBtn.innerHTML = '✕';
                    closeBtn.style.cssText = 
                        'position: absolute; top: 0.5rem; right: 0.5rem; color: #A3A3A3; font-family: "Poppins", sans-serif; background-color: #fff; border-radius: 50%; padding: 0.25rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); cursor: pointer; opacity: 0.5; border: none; font-size: 1rem; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center;';

                    const welcomeText = document.createElement('div');
                    welcomeText.style.cssText = 
                        'background-color: #EDE9FE; border-radius: 0.5rem; padding: 0.25rem 0.75rem; font-size: 1.125rem; font-weight: 600; color: #610505; font-family: "Poppins", sans-serif; text-transform: uppercase; margin-bottom: 1rem;';
                    welcomeText.textContent = 'This is the first template';

                    const headline = document.createElement('div');
                    headline.style.cssText = isMobile ? 
                        'color: #000000; font-size: 1.5rem; font-weight: 700; font-family: "Poppins", sans-serif; margin-top: 0.5rem; margin-bottom: 1rem;' : 
                        'color: #000000; font-size: 1.5rem; font-weight: 700; font-family: "Poppins", sans-serif; margin-top: 0.5rem; margin-bottom: 1rem;';
                    headline.textContent = 'Still Interested?';

                    const contentWrapper = document.createElement('div');
                    contentWrapper.style.cssText = isMobile ? 
                        'display: flex; flex-direction: column; gap: 1rem; width: 100%; align-items: center;' : 
                        'display: flex; flex-direction: row; gap: 1.5rem; width: 100%;';

                    const productImage = document.createElement('img');
                    productImage.src = 'https://urlpt-assets.s3.ap-south-1.amazonaws.com/template-assets/left_sidebar_offer.png';
                    productImage.alt = 'Product Image';
                    productImage.style.cssText = isMobile ? 
                        'width: 140px; height: 140px; border-radius: 10px; border: 1px solid #D2D2D2; object-fit: cover; margin: 0 auto;' : 
                        'width: 150px; height: 150px; border-radius: 10px; border: 1px solid #D2D2D2; object-fit: cover;';

                    const productDetails = document.createElement('div');
                    productDetails.style.cssText = isMobile ? 
                        'flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; gap: 0.5rem;' : 
                        'flex: 1; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 0.75rem;';

                    const productName = document.createElement('div');
                    productName.style.cssText = isMobile ? 
                        'color: #848484; font-size: 1rem; font-weight: 400; font-family: "Poppins", sans-serif; text-align: center; margin-top: 0.5rem;' : 
                        'color: #848484; font-size: 1rem; font-weight: 400; font-family: "Poppins", sans-serif; text-align: left; margin-top: 0;';
                    productName.textContent = 'Smart Watch';

                    const priceContainer = document.createElement('div');
                    priceContainer.style.cssText = isMobile ? 
                        'display: flex; gap: 1rem; justify-content: center; margin: 0.25rem 0; align-items: center;' : 
                        'display: flex; gap: 1rem; justify-content: flex-start; margin: 0.25rem 0; align-items: center;';

                    const originalPrice = document.createElement('span');
                    originalPrice.style.cssText = 
                        'color: #7D7D7D; font-size: 1rem; font-weight: 700; font-family: "Poppins", sans-serif; text-decoration: line-through;';
                    originalPrice.textContent = '₹50,000';

                    const discountedPrice = document.createElement('span');
                    discountedPrice.style.cssText = 
                        'color: #000000; font-size: 1rem; font-weight: 700; font-family: "Poppins", sans-serif;';
                    discountedPrice.textContent = '₹35,000';

                    const ctaBtn = document.createElement('button');
                    ctaBtn.textContent = 'View Product';
                    ctaBtn.style.cssText = isMobile ? 
                        'background-color: #000000; color: #FFFFFF; font-size: 1rem; font-weight: 700; font-family: "Poppins", sans-serif; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; width: 100%; transition: background-color 0.2s; margin-top: 0.5rem;' : 
                        'background-color: #000000; color: #FFFFFF; font-size: 1rem; font-weight: 700; font-family: "Poppins", sans-serif; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; width: 100%; transition: background-color 0.2s; margin-top: 0;';
                    ctaBtn.onmouseover = () => {
                        ctaBtn.style.backgroundColor = '#1F2937';
                    };
                    ctaBtn.onmouseout = () => {
                        ctaBtn.style.backgroundColor = '#000000';
                    };

                    ctaBtn.addEventListener('click', () => {
                        window.open('undefined', '_blank');
                    });

                    closeBtn.onclick = () => {
                        document.body.style.overflow = '';
                        overlay.remove();
                        popUpShown = false;
                        createMiniButton();
                    };

                    priceContainer.appendChild(originalPrice);
                    priceContainer.appendChild(discountedPrice);
                    productDetails.appendChild(productName);
                    productDetails.appendChild(priceContainer);
                    productDetails.appendChild(ctaBtn);
                    contentWrapper.appendChild(productImage);
                    contentWrapper.appendChild(productDetails);
                    container.appendChild(closeBtn);
                    container.appendChild(welcomeText);
                    container.appendChild(headline);
                    container.appendChild(contentWrapper);
                    overlay.appendChild(container);
                    document.body.appendChild(overlay);
                }

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function () {
                        
            function checkTimeForPopup() {
                const startTime = new Date("2025-05-30T14:44").getTime();
                const endTime = new Date("2025-05-30T14:45").getTime();

                function showOrHidePopup() {
                    const currentTime = new Date().getTime();
                    
                    if (currentTime >= startTime && currentTime <= endTime) {
                        if (!popUpShown) {
                            main();
                        }
                    } else if (currentTime > endTime && popUpShown) {
                        const popup = document.querySelector('[data-popup="true"]');
                        if (popup) {
                            document.body.removeChild(popup);
                            popUpShown = false;
                        }
                    }
                }

                // Run check every second
                setInterval(showOrHidePopup, 1000);
            }

            checkTimeForPopup();

            
                    });
                } else {
                    
            function checkTimeForPopup() {
                const startTime = new Date("2025-05-30T14:44").getTime();
                const endTime = new Date("2025-05-30T14:45").getTime();

                function showOrHidePopup() {
                    const currentTime = new Date().getTime();
                    
                    if (currentTime >= startTime && currentTime <= endTime) {
                        if (!popUpShown) {
                            main();
                        }
                    } else if (currentTime > endTime && popUpShown) {
                        const popup = document.querySelector('[data-popup="true"]');
                        if (popup) {
                            document.body.removeChild(popup);
                            popUpShown = false;
                        }
                    }
                }

                // Run check every second
                setInterval(showOrHidePopup, 1000);
            }

            checkTimeForPopup();

            
                }
            } catch (error) {
                console.error('Popup initialization failed:', error);
            }
        })();