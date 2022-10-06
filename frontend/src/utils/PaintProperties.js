export const layerPainter = {
    paintPropertyColor: function(property, minutes) {
        var intervals;
        switch (minutes) {
            case 10:
                intervals = [200, 400, 600, 800, 1000]
                break;
            case 15: 
                intervals = [300, 600, 900, 1200, 1500]
                break;
            case 20:
                intervals = [400, 800, 1200, 1600, 2000]
                break;
            default:
                break;
        }
        return [
            'interpolate',
            ['linear'],
            ['get', property],
            0,
            '#F2F12D',
            intervals[0],
            '#EED322',
            intervals[1],
            '#E6B71E',
            intervals[2],
            '#DA9C20',
            intervals[3],
            '#CA8323',
            intervals[4],
            '#723122',
        ]
    },





}