"use strict";

/**
 * Created by slesh on 9/27/15.
 */

function Slider(slider, initialValue, minValue, maxValue, commonAction) {
    this.slider = slider;
    this.initialValue = initialValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.commonAction = commonAction;
}

Slider.prototype.setChangeListener = function (changeListener) {
    var self = this;
    var isDown = false;
    var parent = self.slider.parentNode;
    var sliderWidth = self.slider.clientWidth
    var parentWidth = parent.clientWidth - sliderWidth;
    var x, value, percent;
    changeListener(self.slider, self.initialValue);
    self.slider.style.left = Math.round((self.initialValue / self.maxValue) * parentWidth) + "px";
    self.slider.addEventListener("mousedown", function () {
        isDown = true;
    });
    self.slider.addEventListener("mouseup", function () {
        isDown = false;
    });
    parent.addEventListener("mouseup", function () {
        isDown = false;
    });
    self.slider.addEventListener("mousemove", function (event) {
        if (isDown) {
            x = parseInt(self.slider.style.left.slice(0, -2) || 0);
            x += event.clientX - (parent.offsetLeft + x + sliderWidth / 2);
            percent = x / parentWidth;
            value = percent * self.maxValue;
            if (x < self.minValue) {
                x = 0;
                value = self.minValue;
            } else if (x > parentWidth) {
                x = parentWidth;
                value = self.maxValue;
            }
            self.slider.style.left = x + "px";
            changeListener(self.slider, value);
            self.commonAction();
        }
    });
};
