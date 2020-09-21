var lastId;
var previousLastId;
var allPersons;
var updateInterval;
var geoData;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: {lng: -101.32580510203627, lat: 34.47081149128475}, // starting position [lng, lat]
    zoom: 3 // starting zoom
});

// add the data
map.on("load", function(e) {
    // load marker images
    map.loadImage("/static/images/user.png", function(error, image) {
        if(!map.hasImage("custom-marker")) {
            map.addImage("custom-marker", image);
        }
    });

    // data source
    map.addSource('persons',{
        type:'geojson',
        data:{
            "type": "FeatureCollection",
            "features":[]
        },
        cluster:true,
        clusterRadius:80,
    });

    map.addLayer({
        id:'persons-cluster',
        type:'circle',
        source:'persons',
        filter: ['has', 'point_count'],
        paint:{
            'circle-radius':20,
            'circle-color':"blue",
            "circle-opacity":0.8
        },
        layout:{

        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'persons',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
        },
        paint:{
            'text-color':"white"
        }
    });

    map.addLayer({
        id:'persons-layer',
        type:'symbol',
        source:'persons',
        filter: ['!', ['has', 'point_count']],
        layout:{
            'icon-image':'custom-marker',
            'icon-size':0.4
        }
    });

    // load the data
    loadDataFromDb();

    // click clustered point
    map.on("click", "persons-cluster",function(e) {
        // query the data
        var features = map.queryRenderedFeatures(e.point, {
            layer:['persons-cluster']
        });

        if(features[0]) {
            var clusterId = features[0].properties.cluster_id;
            map.getSource('persons').getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;
                    
                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        }
    });

    // click unclusterd cluster
    map.on("click", "persons-layer",function(e) {
        // query the data
        var features = e.features;

        if(features[0]) {
            // create the popup
            createMarker(features[0].properties);
        }
    });

    ['persons-cluster', "persons-layer"].forEach(layer => {
        map.on('mouseenter', layer, function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', layer, function () {
            map.getCanvas().style.cursor = '';
        });
    });
    
});

function loadDataFromDb() {
    fetch('persons')
    .then(res => res.json())
    .then(data => {
        allPersons = data;

        // create a geojson
        geoData = createGeojson(data);
        map.getSource('persons').setData(geoData);
        // createMarkers(data);

        updateInterval = setInterval(() => {
            updateData(allPersons);
        }, 1000);
        
    })
    .catch(error => {
        console.log(error);
    });
}

function updateData(data) {
    // start updating the data
    if(data[data.length -1]) {
        let person = data[data.length -1];
        lastId = person.ID_CAN;
    } else {
        lastId = 0;
    }

    // console.log(lastId);

    // compare the two id
    if(previousLastId == lastId) {
        // return;
    }

    // fetch the data
    fetch("/persons/new_persons?lastId="+lastId,{
        method:"GET"
    })
    .then(res => res.json())
    .then(data => {
        // console.log("new data");

        if(data[0]) {
            allPersons.push(...data);
            geoData = createGeojson(allPersons);

            map.getSource("persons").setData(geoData);
            // createMarkers(data);
        }
    })
    .catch(error => {
        console.log(error);
        clearInterval(updateInterval);
    });

    previousLastId = lastId;

}

function createMarkers(persons) {
    console.log(persons);

    persons.forEach(function(person) {
        createMarker(person);
    });

}

function createMarker(person) {
    person.PIC_PROFILE = person.PIC_PROFILE ? person.PIC_PROFILE : "/static/images/man.jpg";

    var popupContent = "<div class='popup-content'>"+
        "<img src='"+person.PIC_PROFILE+"' class='img-user' alt='"+person.ALIAS+"'>"+
        "<div class='description'>"+
        "<p class='text-description alias'>"+ person.ALIAS +"</p>"+
        "<p class='text-description'><span class='text-header'>Profession</span>"+ person.PROFESSION +"</p>"+
        "<p class='text-description'><span class='text-header'>City</span>"+ person.CITY +"</p>"+
        "<p class='text-description'><span class='text-header'>State</span>"+ person.STATE +"</p>"+
        "<p class='text-description'><span class='text-header'>Country</span>"+ person.COUNTRY +"</p>"+
        "</div>"+
        "</div>";
    
    // popup
    var popup = new mapboxgl.Popup({
        closeOnClick:true, 
        closeOnMove:true,
        offset:{bottom:[0, -10]}
    })
    .setLngLat([person.ALTITUDE, person.LONGITUDE])
    .setHTML(popupContent)
    .setMaxWidth("250px")
    .addTo(map);

    // marker
    // var element = document.createElement("div");
    // element.innerHTML = "<img src='/static/images/male.png' class='img' alt='marker'/>";


    // var marker = new mapboxgl.Marker({
    //     element:element
    // })
    // marker.setLngLat([person.ALTITUDE, person.LONGITUDE]);
    // marker.setPopup(popup);

    // marker.addTo(map);
}

function createGeojson(data) {
    var geoObj = {
        "type": "FeatureCollection",
        "name": "persons",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features":[]
    };

    data.forEach(person => {
        let feature = {
            "type": "Feature",
            "geometry":{
                "type": "Point",
                "coordinates":[person.ALTITUDE, person.LONGITUDE]
            },
            "properties":person
        }

        geoObj.features.push(feature);
    });

    console.log(geoObj);
    return geoObj;
}