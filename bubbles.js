(function () {
  'use strict';

  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body;

  var BUBBLE_COUNT = 8;
  var MIN_RADIUS = 54;  // 100px diameter
  var MAX_RADIUS = 66;  // 132px diameter
  var GRAVITY = 0.8;
  var RESTITUTION = 0.6;
  var FRICTION = 0.01;
  var FRICTION_AIR = 0.002;

  function initBubbles() {
    var container = document.getElementById('bubbleContainer');
    var phoneContainer = document.getElementById('phoneContainer');
    var header = phoneContainer ? phoneContainer.querySelector('.onboarding-header') : null;
    var titleEl = phoneContainer ? phoneContainer.querySelector('.onboarding-title') : null;
    if (!container) return;

    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w <= 0 || h <= 0) return;

    var bubbleEls = container.querySelectorAll('.bubble[data-bubble]');
    if (bubbleEls.length !== BUBBLE_COUNT) return;

    var engine = Engine.create({
      gravity: { x: 0, y: GRAVITY },
      enableSleeping: true
    });

    var world = engine.world;
    var bodies = [];
    var radii = [];

    // Floor (invisible static body)
    var floor = Bodies.rectangle(w / 2, h + 20, w + 100, 40, {
      isStatic: true,
      render: { visible: false }
    });
    Composite.add(world, floor);

    // Left and right walls
    var leftWall = Bodies.rectangle(-20, h / 2, 40, h + 100, {
      isStatic: true,
      render: { visible: false }
    });
    var rightWall = Bodies.rectangle(w + 20, h / 2, 40, h + 100, {
      isStatic: true,
      render: { visible: false }
    });
    Composite.add(world, [leftWall, rightWall]);

    // 8 bubbles – random size 100–132px, random starting x, spread from top
    for (var i = 0; i < BUBBLE_COUNT; i++) {
      var r = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
      radii.push(r);
      var x = r + Math.random() * (w - 2 * r);
      var y = -r * 2 - i * (MAX_RADIUS * 2.5);
      var bubble = Bodies.circle(x, y, r, {
        restitution: RESTITUTION,
        friction: FRICTION,
        frictionAir: FRICTION_AIR,
        density: 0.004
      });
      bodies.push(bubble);
      Composite.add(world, bubble);
    }

    // Set each bubble element size once (doesn't change)
    for (var j = 0; j < BUBBLE_COUNT; j++) {
      var d = 2 * radii[j];
      bubbleEls[j].style.width = d + 'px';
      bubbleEls[j].style.height = d + 'px';
    }

    // Click: toggle selected (opposite bg + text color); update Skip -> Next when any selected
    var skipLabel = header ? header.querySelector('.header-skip') : null;
    function updateSkipNextText() {
      if (!skipLabel) return;
      var hasSelected = false;
      for (var i = 0; i < BUBBLE_COUNT; i++) {
        if (bubbleEls[i].classList.contains('bubble-selected')) {
          hasSelected = true;
          break;
        }
      }
      skipLabel.textContent = hasSelected ? 'Next' : 'Skip';
    }
    for (var k = 0; k < BUBBLE_COUNT; k++) {
      bubbleEls[k].addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('bubble-selected');
        updateSkipNextText();
      });
    }

    var runner = Runner.create();
    Runner.run(runner, engine);

    var skipShown = false;
    var showScheduled = false;
    function showHeaderAndTitle() {
      if (skipShown) return;
      skipShown = true;
      if (header) header.classList.add('header-visible');
      if (titleEl) titleEl.classList.add('header-visible');
    }

    function syncBubbles() {
      for (var i = 0; i < BUBBLE_COUNT; i++) {
        var b = bodies[i];
        var el = bubbleEls[i];
        var r = radii[i];
        var x = b.position.x - r;
        var y = b.position.y - r;
        el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      }
      if (!skipShown) {
        var sleepingCount = 0;
        for (var s = 0; s < bodies.length; s++) {
          if (bodies[s].isSleeping) sleepingCount++;
        }
        if (sleepingCount === BUBBLE_COUNT) {
          showHeaderAndTitle();
        } else if (sleepingCount >= BUBBLE_COUNT - 1 && !showScheduled) {
          showScheduled = true;
          setTimeout(showHeaderAndTitle);
        }
      }
      requestAnimationFrame(syncBubbles);
    }
    requestAnimationFrame(syncBubbles);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbles);
  } else {
    initBubbles();
  }
})();
