(function () {
        var userId = "6811dcf5d53928413f7b29ac"
        const elements = [{"id":"heading-3","type":"heading","content":"nnnnnnnnnnn","style":{"color":"#333333","fontSize":"24px","fontFamily":"Heading 2"},"_id":"67ff50d50d6146ceac71f85e"},{"id":"input-1","type":"input","placeholder":"Enter email here","style":{"width":"100%","padding":"10px","borderRadius":"4px","border":"1px solid #ddd","marginTop":"10px"},"_id":"67ff4bd10d6146ceac71f482"},{"id":"button-1","type":"button","content":"CONTINUE","style":{"width":"100%","padding":"12px","backgroundColor":"#ffffff","color":"#000000","border":"none","borderRadius":"2px","marginTop":"10px","cursor":"pointer"},"_id":"67ff4bd10d6146ceac71f483"},{"id":"input-4","type":"input","placeholder":"Enter text...","style":{"width":"100%","padding":"10px","borderRadius":"4px","border":"1px solid #ddd"},"_id":"67ff665949ded7c87dd7b57d"},{"id":"heading-5","type":"heading","content":"tttttttttttttttttttttttttt","style":{"color":"#333333","fontSize":"24px","fontFamily":"Arial"},"_id":"67ff665949ded7c87dd7b57e"}];

        

        function getCookie(name) {
            const nameEQ = name + '=';
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
            }
            return null;
        }

        function getParams(param) {
            const urlParams = new URLSearchParams(window.location.search);
            const value = urlParams.get(param);
            return value ? value : null;
        }
        
        function get_url_domain(url) {
            let a = document.createElement('a');
            a.href = url;
            return a.hostname;
        }
        
        function getUrlVars() {
            var vars = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                vars[key] = decodeURIComponent(value);
            });
            return vars;
        }

        function setCookie(name, value, daysToExpire) {
            const date = new Date();
            date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
            const expires = 'expires=' + date.toUTCString();
            const secure = location.protocol === 'https:' ? '; secure' : '';
            const sameSite = '; SameSite=Lax';
            document.cookie = name + '=' + encodeURIComponent(value) + '; ' + expires + sameSite + secure + '; path=/';
        }

        function getTrafficDetails() {
            var qvars = getUrlVars()
            let source = "Other";
            const originalRef = document.referrer == '' ? '' : get_url_domain(document.referrer)
            let this_domain = document.location.host

            if (originalRef == '') {
                source = "Direct";
            } else if (originalRef.match(/google/i) !== null) {
                source = "Google";
            } else if (originalRef.match(/yahoo/i) !== null) {
                source = "Yahoo";
            } else if (originalRef.match(/bing/i) !== null) {
                source = "Bing";
            } else if (originalRef.match(/instagram/i) !== null) {
                source = "Instagram";
            } else if (originalRef.match(/facebook/i) !== null || originalRef.match(/fb.com$/i) !== null) {
                source = "Facebook";
            } else if (originalRef.match(/twitter/i) !== null || originalRef.match(/t.co$/i) !== null) {
                source = "Twitter";
            } else if (originalRef.match(/snapchat/i) !== null) {
                source = "Snapchat";
            } else if (originalRef.match(/youtube/i) !== null) {
                source = "YouTube";
            } else if (originalRef.match(/pinterest/i) !== null) {
                source = "Pinterest";
            } else if (originalRef.match(/linkedin/i) !== null) {
                source = "LinkedIn";
            } else if (originalRef.match(/tumblr/i) !== null) {
                source = "Tumblr";
            } else if (originalRef.match(/duckduckgo/i) !== null) {
                source = "Duckduckgo";
            } else if (this_domain == originalRef) {
                source = "Internal";
            }

            let trafficSource = 'Other'
            if (
                Object.keys(qvars).indexOf('gclid') != -1 ||
                Object.keys(qvars).indexOf('msclkid') != -1 ||
                (getCookie('fbclid') != undefined && getCookie('_fbc') != undefined) ||
                (Object.keys(qvars).indexOf('fbclid') != -1 && getCookie('_fbc') != undefined)
            ) {
                trafficSource = 'Paid'
            } else if (['Google', 'Bing', 'Yahoo', 'Duckduckgo'].indexOf(source) > -1) {
                trafficSource = 'Organic'
            } else if (['Facebook', 'Twitter', 'Instagram', 'Snapchat', 'YouTube', 'Pinterest', 'LinkedIn', 'Tumblr'].indexOf(source) > -1) {
                trafficSource = 'Social'
            } else if (['Internal', 'Direct'].indexOf(source) > -1) {
                trafficSource = 'Direct'
            } else if (source && ['Internal'].indexOf(source) == -1) {
                trafficSource = 'Referral'
            }


            let firstTrafficSource = getCookie('first_traffic_source')
            if (!firstTrafficSource) {
                setCookie('first_traffic_source', trafficSource, 365)
                firstTrafficSource = trafficSource
            }


            const trafficData = {
                trafficSource, firstTrafficSource
            }

            if (trafficSource === 'Organic') {
                trafficData['organicSourceStr'] = source
                trafficData['organicSource'] = document.referrer
            } else {
                trafficData['organicSourceStr'] = null
                trafficData['organicSource'] = null
            }

            return trafficData

        }
        
        const trafficData = getTrafficDetails()

        function getGaClientId() {
            try {
                const gaCookie = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('_ga='));
                if (gaCookie) {
                    return gaCookie.split('.').slice(-2).join('.');
                }
            } catch (error) {
                console.error('Error getting GA client ID:', error);
            }
            return null;
            }
            
            
            
    
        const main = () => {
            let popUpShown = false;
            var showPopUp = () => {
                const container = document.createElement('div');
                container.id = 'custom-widget-container';
                container.setAttribute('data-popup', 'true');
                container.style.position = 'fixed';
                container.style.top = '50%';
                container.style.left = '50%';
                container.style.transform = 'translate(-50%, -50%)';
                container.style.zIndex = '9999';
                container.style.maxWidth = '400px';
                container.style.width = '90%';
                container.style.margin = '20px auto';
                container.style.padding = '20px';
                container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                container.style.borderRadius = '8px';
                container.style.fontFamily = 'Arial, sans-serif';
                container.style.backgroundColor = '#8fbcff';
    
                const applyStyles = (el, styles) => {
                    for (let key in styles) {
                        el.style[key] = styles[key];
                    }
                };
    
                // Create close button
                const closeButton = document.createElement('button');
                closeButton.textContent = '×';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '10px';
                closeButton.style.right = '10px';
                closeButton.style.border = 'none';
                closeButton.style.background = 'transparent';
                closeButton.style.fontSize = '20px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.color = '#333';
    
                closeButton.addEventListener('click', () => {
                    container.remove();
                    popUpShown = false;
                });
    
                container.appendChild(closeButton);
    
                elements.forEach(item => {
                    let el;
                    switch (item.type) {
                        case 'heading':
                            el = document.createElement('h2');
                            el.textContent = item.content;
                            break;
                        case 'image':
                            el = document.createElement('img');
                            el.src = item.src;
                            el.alt = item.alt || '';
                            break;
                        case 'input':
                            el = document.createElement('input');
                            el.placeholder = item.placeholder || '';
                            break;
                        case 'button':
                            el = document.createElement('button');
                            el.textContent = item.content;
                            break;
                        case 'text':
                            el = document.createElement('p');
                            el.textContent = item.content;
                            break;
                        default:
                            return;
                    }
    
                    el.id = item.id;
                    applyStyles(el, item.style || {});
                    container.appendChild(el);
                });
    
                document.body.appendChild(container);
                popUpShown = true;
            }
    
            
        if (popUpShown) return;
        showPopUp()
        };
    
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    })();