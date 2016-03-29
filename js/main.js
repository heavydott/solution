/**
 * JSON
 */

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

var cars;
var drivers;

/**
 * LEAFLET
 */

// Map
var map = L.map('map').setView([53.8999, 27.5566], 11);

// Tile Layer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    foo: 'bar',
    minZoom: 1,
    maxZoom: 18
}).addTo(map);

// Markers
window.onload = function () {
    setTimeout(function () {
        fetchJSONFile('/resources/data.json', function (data) {
            cars = data.cars;
            drivers = data.drivers;
            console.log(cars);
            console.log(drivers);

            function newDate(date) {
                var y = date.getFullYear();
                var m;
                if (date.getMonth() < 9) {
                    m = '0' + (date.getMonth() + 1);
                } else {
                    m = date.getMonth() + 1;
                }
                var d;
                if (date.getDate() < 10) {
                    d = '0' + date.getDate();
                } else {
                    d = date.getDate();
                }
                var s;
                if (date.getSeconds() < 10) {
                    s = '0' + date.getSeconds();
                } else {
                    s = date.getSeconds();
                }
                var min;
                if (date.getMinutes() < 10) {
                    min = '0' + date.getMinutes();
                } else {
                    min = date.getMinutes();
                }
                var h;
                if (date.getHours() < 10) {
                    h = '0' + date.getHours();
                } else {
                    h = date.getHours();
                }
                var result = d + '.' + m + '.' + y + ' ' + h + ':' + min + ':' + s;
                return result;
            }

            function marker(param) {
                var marker1;

                if (cars[param].pos != undefined) {
                    marker1 = L.marker([cars[param].pos.lat, cars[param].pos.lng]).addTo(map);

                    marker1.bindPopup('');
                    var date = new Date(cars[param].pos.t);
                    var time = newDate(date);
                    console.log(time);

                    function driverInfo() {
                        if (cars[param].driverId != undefined) {
                            if (drivers[cars[param].driverId - 1].phone != undefined) {
                                return '<br>' + drivers[cars[param].driverId - 1].name + '<br>' + drivers[cars[param].driverId - 1].phone
                            }
                            return '<br>' + drivers[cars[param].driverId - 1].name;
                        } else {
                            return '';
                        }
                    }

                    marker1.on('click', function (e) {
                        marker1.getPopup().setContent('<b>' + cars[param].name + '<br>' + time + '<br>' + cars[param].pos.s + ' км/ч' + driverInfo() +
                            '</b>'
                        );
                        map.setView([cars[param].pos.lat, cars[param].pos.lng], 11);
                    })
                }
            }

            for (var i = 0; i < cars.length; i++) {
                marker(i);
                console.log(cars[i]);
            }
        });
    }, 3000);
}