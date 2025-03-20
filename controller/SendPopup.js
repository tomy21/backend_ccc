export let activePopUp = false ;
export let currentUser = null ;

export function sendPopup(wss, userLocation) {
    if(activePopUp){
        return { success: false, message: "Popup sedang aktif"}
    }

    activePopUp = true;
    currentUser = userLocation;

    wss.clients.forEach(client => {
        if (client.readyState === 1) { // 1 = OPEN
            client.send(JSON.stringify({ showPopup: true, userLocation }));
        }
    });

    return { success: true, message: "Popup dikirim!" };
}

export function closePopup() {
    activePopUp = false;
    currentUser = null;
    return { success: true, message: "Popup ditutup!" };
}