/* ===========================================================================
    Javascript for the Geocode page
=========================================================================== */


/* global G */

const bounds = G.latLngBounds({
    sw: G.latLng(44, -68),
    ne: G.latLng(44.7, -70.8),
});
// console.log('Bounds: ', bounds.toJson());

G.loader({ apiKey: apiKey, }).load().then(() => {
    const geocoder = G.geocode({
        // componentRestrictions: {
        //     postalCode: '04938',
        // },
        // componentRestrictions: {
        //     country: 'US',
        // },
        // address: '04938',
        // address: '221 B Baker St, London, England',
        // address: '224 Broadway, Farmington, ME 04938',
        address: '224 Broadway, New York, NY',
        // address: 'Lieu-dit, France',
        // address: 'no match'
        // bounds: bounds,
        // location: {
        //     // lat: 44.7,
        //     // lng: -69.8,
        //     lat: -75.290330,
        //     lng: 38.653861
        // },
        // region: 'US',
    });
    geocoder.fetch().then((response) => {
        console.log('Response: ', response);
        if (response.hasResults()) {
            const result = response.getFirst();
            console.log('result: ', result);
            console.log('response objects: ', response.getResults());
            console.log('address Components: ', result.getAddressComponents());
            const addressComponents = result.getAddressComponents();
            addressComponents.forEach((component) => {
                console.log('Component: ', component.getLongName(), component.getShortName(), component.getTypesArray(), component.getTypes().isCountry());
            });
            console.log('Bounds: ', result.getBounds());
            console.log('Compound plus code: ', result.getCompoundPlusCode());
            console.log('Formatted Address: ', result.getFormattedAddress());
            console.log('Lat/Lng: ', result.getLatitude(), result.getLongitude());
            console.log('Location: ', result.getLocation());
            console.log('Location type: ', result.getLocationType());
            console.log('Location type approximate?: ', result.isLocationApproximate());
            console.log('Location type geometric center?: ', result.isLocationGeometricCenter());
            console.log('Location type range interpolated?: ', result.isLocationRangeInterpolated());
            console.log('Location type rooftop?: ', result.isLocationRooftop());
            console.log('Placeid: ', result.getPlaceId());
            console.log('Plus code: ', result.getPlusCode());
            console.log('Postal code localities: ', result.getPostalCodeLocalities());
            console.log('Types: ', result.getTypesArray());
            console.log('isPartialtMatch: ', result.isPartialMatch());
            console.log('Google result: ', result.toGoogle());
            response.getResults().forEach((result) => {
                console.log('Individual result: ', result.toGoogle());
            });
            // console.log('response[0].geometry.location: ', response[0].geometry.location.lat(), response[0].geometry.location.lng());
        } else {
            console.log('No results found');
            console.log('Test first result: ', response.getFirst());
            const result = response.getFirst();
            console.log('response objects: ', response.getResults());
            console.log('address Components: ', result.getAddressComponents());
            const addressComponents = result.getAddressComponents();
            addressComponents.forEach((component) => {
                console.log('Component: ', component.getLongName(), component.getShortName(), component.getTypesArray(), component.getTypes().isCountry());
            });
            console.log('Bounds: ', result.getBounds());
            console.log('Compound plus code: ', result.getCompoundPlusCode());
            console.log('Formatted Address: ', result.getFormattedAddress());
            console.log('Lat/Lng: ', result.getLatitude(), result.getLongitude());
            console.log('Location: ', result.getLocation());
            console.log('Location type: ', result.getLocationType());
            console.log('Location type approximate?: ', result.isLocationApproximate());
            console.log('Location type geometric center?: ', result.isLocationGeometricCenter());
            console.log('Location type range interpolated?: ', result.isLocationRangeInterpolated());
            console.log('Location type rooftop?: ', result.isLocationRooftop());
            console.log('Placeid: ', result.getPlaceId());
            console.log('Plus code: ', result.getPlusCode());
            console.log('Postal code localities: ', result.getPostalCodeLocalities());
            console.log('Types: ', result.getTypesArray());
            console.log('isPartialtMatch: ', result.isPartialMatch());
            console.log('Google result: ', result.toGoogle());
            response.getResults().forEach((result) => {
                console.log('Individual result: ', result.toGoogle());
            });
        }
    })
        .catch((error) => {
            console.error('Error: ', error);
        });

    // G.geocode().fetch({
    //     address: '04938',
    // }).then((response) => {
    //     console.log('Response 2: ', response);
    // });


    // (async () => {
    //     try {
    //         const result = await geocoder.fetch();
    //         console.log('Result: ', result);
    //     } catch (error) {
    //         console.error('Error: ', error);
    //     }
    // })();

});
