/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

// Make sure the "FileThis" namespace exists
window.FileThis = window.FileThis || {};

/**
 * `<ft-scrolling-behavior>`
 *
 * This behavior works around two very vexing browser scrolling problems.
 *
 * @demo
 * @polymerBehavior FileThis.ScrollingBehavior
 */
FileThis.ScrollingBehavior = {

    listeners: {
        'iron-resize': '_onIronResize'
    },

    properties: {

        /** Used internally to track which elements are managed by this behavior. */
        _managedScrollers: {
            type: Array,
            value: function() { return []; }
        }

    },

    _manageScroller: function(scroller)
    {
        if (this._scrollerIsManaged(scroller))
            return;

        // Add scroller to our list
        this._managedScrollers.push(scroller);

        // Start listening for mouse wheel events on the scroller
        scroller.addEventListener("wheel", this._onWheel);
    },

    _unmanageScroller: function(scroller)
    {
        if (!this._scrollerIsManaged(scroller))
            return;

        // Stop listening for mouse wheel events on the scroller
        scroller.removeEventListener("wheel", this._onWheel);

        // Remove scroller from our list
        var index = this._managedScrollers.indexOf(scroller);
        this._managedScrollers.splice(index, 1);
    },

    _scrollerIsManaged: function(scroller)
    {
        var index = this._managedScrollers.indexOf(scroller);
        return (index >= 0);
    },

    _onIronResize: function()
    {
        // For each managed scroller
        this._managedScrollers.forEach(function(scroller)
        {
            // Calculate and set the scroller's width
            if (this.clientWidth !== 0)  // Is this necessary? Why?
            {
                var newWidth = this._calculateScrollerWidth(scroller);
                var adjustWidth = (newWidth >= 0);
                if (adjustWidth)
                    scroller.style.width = newWidth + "px";
            }

            // Calculate and set the scroller's height
            if (this.clientHeight !== 0)  // Is this necessary? Why?
            {
                var newHeight = this._calculateScrollerHeight(scroller);
                var adjustHeight = (newHeight >= 0);
                if (adjustHeight)
                    scroller.style.height = newHeight + "px";
            }
        }.bind(this));
    },

    _calculateScrollerWidth: function(scroller)
    {
        // Default to full width. This makes sense when the element has no siblings,
        // or it and its siblings are laid out vertically. Override in the class that mixes in this behavior.
        return this.clientWidth;
    },

    _calculateScrollerHeight: function(scroller)
    {
        // Default to full height. This makes sense when the element has no siblings,
        // or it and its siblings are laid out horizontally. Override in the class that mixes in this behavior.
        return this.clientHeight;
    },

    _onWheel: function(event)
    {
        // If vertical scroll
        var deltaY = event.deltaY;
        var vertical = (deltaY !== 0);
        if (vertical)
        {
            var up = (deltaY < 0);
            if (up)
            {
                var viewportTop = this.scrollTop;
                var alreadyAtTop = (viewportTop === 0);
                if (alreadyAtTop)
                    event.preventDefault();
                return;
            }

            var down = (deltaY > 0);
            if (down)
            {
                var viewportBottom = this.scrollTop + this.offsetHeight;
                var alreadyAtBottom = (viewportBottom >= this.scrollHeight);
                if (alreadyAtBottom)
                    event.preventDefault();
                return;
            }
            return;
        }

        // If horizontal scroll
        var deltaX = event.deltaX;
        var horizontal = (deltaX !== 0);
        if (horizontal)
        {
            var left = (deltaX < 0);
            if (left)
            {
                var viewportLeft = this.scrollLeft;
                var alreadyAtLeft = (viewportLeft === 0);
                if (alreadyAtLeft)
                    event.preventDefault();
                return;
            }

            var right = (deltaX > 0);
            if (right)
            {
                var viewportRight = this.scrollLeft + this.offsetWidth;
                var alreadyAtRight = (viewportRight >= this.scrollWidth);
                if (alreadyAtRight)
                    event.preventDefault();
                return;
            }
            return;
        }
    }

}
