

export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbHMzIiwiYSI6ImNrYXk0YmFvbzBhYmEyd3BpaHk3am45cWQifQ.YDDvJdq-5oTjqwB_F-gbGw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/joels3/ckay4q703193z1io1rvby3937',
  //center: [ -118.489683, 34.011184],
  //zoom: 10,
  //interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker:
  const el = document.createElement('div');
  el.className = 'marker';
 
  // Add marker:
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(loc.coordinates).addTo(map);

  // Add pop-up:
  new mapboxgl.Popup({
    offset: 30
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Jour ${loc.day} : ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include location:
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds);
  
}


