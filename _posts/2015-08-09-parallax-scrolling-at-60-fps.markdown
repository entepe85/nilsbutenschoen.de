---
layout: post
title: "Parallax Scrolling bei 60 fps"
date: 2015-08-09T16:00:50+02:00
author: Nils
---

[Parallax-Effekte](https://vimeo.com/28709243) auf Websites sind ein [anhaltender Trend](http://t3n.de/news/parallax-scrolling-beispiele-423046/) und ein toller Eyecatcher. Daher sollte die Option eines Parallax-Effekts auch in die unlängst durch mich entwickelten Inhaltselemente für das Open Source CMS [Contao](http://www.contao.org) einfließen.

## Was ist ein Parallax-Effekt?
Die sogenannte Bewegungsparallaxe entsteht, wenn sich zwei hintereinander positionierte Objekte relativ zum Betrachter unterschiedlich schnell bewegen und so der räumliche Eindruck entsteht, dass eines der Objekte weiter vom Betrachter entfernt ist.

## Wie kann man diesen Effekt auf einer Webseite einsetzen?
Im Kopfbereich von Websites sind aktuell häufig sogenannte "featured images", also optisch ansprechende Bilder, zu finden. Wenn diese zusätzlich mit einer Bewegungsparallaxe versehen werden, so wird die Website optisch noch abwechslungsreicher.

Darüber hinaus kann die Bewegungsparallaxe überall - sparsam und subtil - als Auflockerung verwendet werden.

## Technische Betrachtung
Um einen Parallax-Effekt für Hintergrundgrafiken zu implementieren, gibt es nun verschiedene Ansätze:

1. Das Element absolut positionieren und das `top` Attribut in Abhängigkeit des Scrolling verändern
2. Die Hintergrundposition des Elements in Abhängigkeit des Scrollings verändern

Bei diesen beiden Ansätzen entstehen Performance-Probleme in Form von Ruckeln, also einer [Bildrate unter 60 Bildern pro Sekunde (fps)](http://nilsbutenschoen.de/#/blog/posts/60-fps-and-the-web), weil die CPU in Verbindung mit dem Browser die Berechnung zur Darstellung der Webseite übernimmt, diese ist aufgrund ihrer Architektur aber nicht auf das Berechnen von Bildschirmgrafik optimiert. Generell ist zu beachten, dass bei der Darstellung von animierten Inhalten möglichst wenig Neuberechnungen des Layouts vorgenommen werden.

Die Seite [CSS Triggers](http://www.csstriggers.com) gibt in diesem Zusammenhang einen sehr guten Überblick, indem sie darstellt welche Rendervorgänge durch die Veränderung der CSS-Eigenschaften angestoßen werden. Dort ist etwa zu sehen, dass die Veränderung der Eigenschaft `top` alle drei Berechnungsdurchgänge benötigt, eine Verwendung von `transform` jedoch nur das sog. Compositing - also das Zusammensetzen der Bildschirminhalte durch den Grafikprozessor.

### Die Lösung: GPU-Berechnung
Anstatt nun die eher schlecht geeignete CPU des Endgeräts für die Berechnung heranzuziehen, sollten die Rechenoperationen eher mit Hilfe des Grafikprozessors (GPU) durchgeführt werden, dieser ist durch seine Architektur zur notwendigen Berechnung von Fließkommazahlen bestens geeignet.

Und JavaScript bringt uns prinzipiell schon eine Möglichkeit zur GPU-Berechnung - im Idealfall bei 60 fps - frei Haus: `requestAnimationFrame`. Wie der Name der Funktion schon verrät, wird quasi ein Animationsbild pro Durchgang angefragt (request), wodurch die Darstellung der 60 Bilder / Sekunden mit der Animation synchron ablaufen sollte.

Wird das in Verbindung mit `transform3d` benutzt, so erfolgt die Berechnung des Parallax-Effekt unter Zuhilfenahme der GPU, wodurch ein flüssiger Scroll-Eindruck erzeugt werden kann.

Hier ein sehr einfaches Pseudo-Beispiel:
{% highlight html %}
...
<div class="parallax-wrap">
    <img src="parallax.jpg" class="parallax-image">
</div>
...
{% endhighlight %}

Und in (S)CSS:

{% highlight scss %}
.parallax-wrap {
    min-height: 400px;
    position: relative;
    .parallax-image {
        left: 0;
        position: absolute;
        top: 0;
        transform: translate(-50%,-50%);
    }
}
{% endhighlight %}

Damit sollte zunächst das Gröbste erledigt sein.
Nun zum JavaScript:

{% highlight js linenos %}
// Use Array forEach for object collections
var forEach = Array.prototype.forEach,
    scrollTop,
    parallaxImages = document.querySelectorAll('.parallax-image');

// Cross browser requestAnimationFrame
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) {
        setTimeout(f, 1000 / 60);
};

// Parallax scrolling function
function parallax() {
    forEach.call(parallaxImages, function (image) {
        image.style.transform = "translate3d(0," + (scrollTop * 0.5) + ",0)";
    }
});

// Scroll handling
window.addEventListener('scroll', function () { // on page scroll
    scrollTop = window.pageYOffset;
    requestAnimationFrame(parallax);
}, false);
{% endhighlight %}

Idealerweise ist natürlich noch zu überprüfen, ob sich das Element, dessen Position sich verändert auch im Viewport - also für den Benutzer zu sehen - ist, um alternativ gar nicht erst (Neu)Berechnungen durchführen zu müssen.

Viel Spaß beim Testen!
