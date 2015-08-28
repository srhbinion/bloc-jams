var pointsArray = document.getElementsByClassName('point');
    
               
var animatePoint = function(element) {
    var transformValue = "scaleX(1) translateY(0)";

    element.style.opacity = 1;
    element.style.transform = transformValue;
    element.style.msTransform = transformValue;
    element.style.WebkitTransform = transformValue;
};

var animatePoints = function(points) {
    forEach(points, animatePoint);
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