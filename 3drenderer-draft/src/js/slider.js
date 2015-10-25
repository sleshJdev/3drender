"use strict";

/**
 * Created by slesh on 9/27/15.
 */

function Slider(slider, getInitialValue, minValue, maxValue, commonAction) {
    this.slider = slider;
    this.getInitialValue = getInitialValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.commonAction = commonAction;
}

Slider.prototype.notify = function () {
    this.changeListener(this.slider, this.getInitialValue());
    this.slider.style.left = this.getInitialPosition(this.getInitialValue());
};

Slider.prototype.setChangeListener = function (changeListener) {
    var self = this;
    var isDown = false;
    var parent = self.slider.parentNode;
    var sliderWidth = self.slider.clientWidth
    var parentWidth = parent.clientWidth - sliderWidth;
    var x, value, percent;

    this.changeListener = changeListener;
    this.getInitialPosition = function (initialValue) {
        return Math.round((initialValue / self.maxValue) * parentWidth) + "px";
    };

    self.notify();
    self.slider.style.left = self.getInitialPosition(self.getInitialValue());
    self.slider.addEventListener("mousedown", function () {
        isDown = true;
    });
    document.addEventListener("mouseup", function () {
        isDown = false;
    });
    self.slider.addEventListener("mousemove", function (event) {
        if (isDown) {
            x = parseInt(self.slider.style.left.slice(0, -2) || 0);
            x += event.clientX - (parent.offsetLeft + x + sliderWidth / 2);
            percent = x / parentWidth;
            value = percent * self.maxValue;
            if (x <= self.minValue) {
                x = 0;
                value = self.minValue;
            } else if (x >= parentWidth) {
                x = parentWidth;
                value = self.maxValue;
            }
            self.slider.style.left = x + "px";
            self.changeListener(self.slider, value);
            self.commonAction();
        }
    });

    return self;
};
