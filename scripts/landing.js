var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
    var transformValue = "scaleX(1) translateY(0)";
                
    var revealPoints = function() {
        for (i = 0; points.length > i; i++) {
            points[i].style.opacity = 1;
            points[i].style.transform = transformValue
            points[i].style.msTransform = transformValue
            points[i].style.WebkitTransform = transformValue
        };
    };
    
    revealPoints();
};

window.onload = function() {
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    
    window.addEventListener('scroll', function(event) {
        if (pointsArray[0].getBoundingClientRect().top <= 500) {
            animatePoints(pointsArray);
        }   
    });   
};