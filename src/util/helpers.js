export const getLocation = (success, error) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            success(position);
        }, function() {
            error();
            console.log('Error: The Geolocation service failed.');
        });
    }
    else {
        console.log('Error: Your browser doesn\'t support geolocation.');
    }
}

export const getCookie = (name) => {
    const re = new RegExp(name + "=([^;]+)");
    const value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
}
