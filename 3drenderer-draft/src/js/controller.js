/**
 * Created by slesh on 10/18/15.
 */


function Controller() {
    this.events = Object.create(null);
    this.afterAction = null;
    this.beforeAction = null;
    this.initializeHandler();
};

Controller.prototype.initializeHandler = function () {
    var self = this;

    function handleKey(event, isDown) {
        var id = "" + event.keyCode + event.shiftKey + event.ctrlKey;
        if (id in self.events) {
            self.events[id].isDown = isDown;
            if (!!self.beforeAction) {
                self.beforeAction();
            }
            for (var key in self.events) {
                var e = self.events[keyCode];
                if (e.isDown) {
                    if (event.shiftKey && e.hasShift) {
                        e.action(event);
                    } else if (event.ctrlKey && e.hasCtrl) {
                        e.action(event);
                    } else if (event.ctrlKey == e.hasCtrl && event.shiftKey == e.hasShift) {
                        e.action(event);
                    }
                }
            }
            if (!!self.afterAction) {
                self.afterAction();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }

    document.addEventListener("keydown", function (event) {
        handleKey(event, true);
    });
    document.addEventListener("keyup", function (event) {
        handleKey(event, false);
    });
};

Controller.prototype.addListenerForKey = function (key, hasShift, hasCtrl, action) {
    var event = Object.create(null);
    event.isDown = false;
    event.keyCode = keyCode;
    event.hasShift = hasShift || false;
    event.hasCtrl = hasCtrl || false;
    event.action = action;
    this.events["" + keyCode + hasShift + hasCtrl] = event;
};