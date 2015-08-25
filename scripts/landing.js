var animatePoints = function() {
    var points = document.getElementsByClassName('point');
    
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