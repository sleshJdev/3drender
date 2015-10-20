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

    function handleHelper(event, value) {
        console.log("shiftKey: " + event.shiftKey + ", ctrlKey: " + event.ctrlKey + "key: " + event.key + ", keyCode: " + event.keyCode);
        var id = "" + event.keyCode + event.shiftKey + event.ctrlKey;
        if (id in self.events) {
            self.events[id].isDown = value;
            if (!!self.beforeAction) {
                self.beforeAction();
            }
            for (var key in self.events) {
                var e = self.events[key];
                if (e.isDown) {
                    if (event.shiftKey && e.withShift) {
                        e.action(event);
                        console.log("sfiftKey: " + event.shiftKey + ", hasShift: " + e.withShift + ", ctrlKey: " + event.ctrlKey + ", hasCtrl: " + e.withCtrl + ", key: " + event.key + ", code" + event.keyCode + ", action code: " + e.key + ", id: " + key);
                    } else if (event.ctrlKey && e.withCtrl) {
                        e.action(event);
                        console.log("sfiftKey: " + event.shiftKey + ", hasShift: " + e.withShift + ", ctrlKey: " + event.ctrlKey + ", hasCtrl: " + e.withCtrl + ", key: " + event.key + ", code" + event.keyCode + ", action code: " + e.key + ", id: " + key);
                    } else if (event.ctrlKey == e.withCtrl && event.shiftKey == e.withShift) {
                        e.action(event);
                        console.log("sfiftKey: " + event.shiftKey + ", hasShift: " + e.withShift + ", ctrlKey: " + event.ctrlKey + ", hasCtrl: " + e.withCtrl + ", key: " + event.key + ", code" + event.keyCode + ", action code: " + e.key + ", id: " + key);
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
        handleHelper(event, true);
    });
    document.addEventListener("keyup", function (event) {
        handleHelper(event, false);
    });
};

Controller.prototype.addListenerForKey = function (key, withShift, withCtrl, action) {
    var event = Object.create(null);
    event.isDown = false;
    event.withShift = withShift || false;
    event.withCtrl = withCtrl || false;
    event.action = action;
    event.key = key;
    this.events["" + key + withShift + withCtrl] = event;
};