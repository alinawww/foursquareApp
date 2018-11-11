export function getLocation(success, error) {
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
