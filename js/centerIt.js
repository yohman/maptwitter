/* 
* CenterIt (v.1.1.5)
* by James Studdart (www.jamesstuddart.co.uk)
* james@studdart.co.uk
*
* Copyright (c) 2009-2010 James Studdart
* Licensed under the GPL license. 
*
*
* NOTE: Requires jQuery framework (www.jquery.com)
*	Developed for: jQuery 1.4.2
*
* Special Thanks to James Parker and Michael Collins
*
*/
/*
UPDATE: CenterIt (v.1.1.5) 
by Michael Collins - mike@intervalia.com (20/09/2010)
- Corrected the detection of IE Quirks mode to use position:absolute and not position:fixed.
- Fixed bug that was overwriting the object's width and height even if it was not calculating it.
- Return the 'this' pointer at the end of all functions to allow proper jQuery chainging.
*/
/*
UPDATE: CenterIt (v.1.1.4) 
by James Studdart (23/06/2010)
- Added property showPopup to ensure items are shown when using centerIt (if required, set to true by default)
*/
/*
UPDATE: CenterIt (v.1.1.3) 
by James Parker (09/06/2010)
- fix bug with calculating padding and margins
*/
/*
UPDATE: CenterIt (v.1.1.2) 
by James Studdart (25/02/2010)
- fix for IE6 and below centering, as IE6 and below do not support fixed positioning
*/
/*
UPDATE: CenterIt (v.1.1.1) 
by James Studdart (21/02/2010)
- Added control.show() to ensure chosen element that will be centred is shown, otherwise centreIt does nothing 
*/
/*
UPDATE:  CenterIt (v.1.1.0)
by James Studdart
- Added code to check for NaN on padding and margins
*/


(function($)
{
  $.fn.CenterIt = function(options)
  {
    var defaults = {
      ignorechildren: true,
      showPopup: true
    };
    var settings = $.extend({}, defaults, options);

    var control = $(this);

    if (settings.showPopup)
    {
      control.show();
    }

    $(document).ready(function() { CenterItem(); });
    $(window).resize(function() { CenterItem(); });

    function CenterItem()
    {
      var controlHeight = 0;
      var controlWidth = 0;

      if (settings.ignorechildren)
      {
        controlHeight = control.height();
        controlWidth = control.width();
      } else
      {

        var children = control.children();

        for (var i = 0; i < children.length; i++)
        {
          if (children[i].style.display != 'none')
          {
            controlHeight = children[i].clientHeight;
            controlWidth = children[i].clientWidth;
          }
        }
      }

      var controlMarginCSS = control.css("margin");
      var controlPaddingCSS = control.css("padding");


      if (controlMarginCSS != null)
      {
        //Work out Margins
        controlMarginCSS = controlMarginCSS.replace(/auto/gi, '0');
        controlMarginCSS = controlMarginCSS.replace(/px/gi, '');
        controlMarginCSS = controlMarginCSS.replace(/pt/gi, '');
      }

      var totalMargin = "";

      if (controlMarginCSS != "" && controlMarginCSS != null)
      {
        var totalMarginArray = controlPaddingCSS.split(' ');
        if (totalMarginArray.length == 1)
        {
          var margin = parseInt(totalMarginArray[0]);
          totalMargin = new Array(margin, margin, margin, margin);
        }
        else if (totalMarginArray.length == 2)
        {
          var verticalMargin = parseInt(totalMarginArray[0]);
          var horizontalMargin = parseInt(totalMarginArray[1]);
          totalMargin = new Array(verticalMargin, horizontalMargin, verticalMargin, horizontalMargin);
        }
        else if (totalMarginArray.length == 3)
        {
          var topMargin = parseInt(totalMarginArray[0]);
          var rightMargin = parseInt(totalMarginArray[1]);
          var bottomMargin = parseInt(totalMarginArray[2]);
          totalMargin = new Array(topMargin, rightMargin, bottomMargin, rightMargin);
        }
        else if (totalMarginArray.length == 4)
        {
          var topMargin = parseInt(totalMarginArray[0]);
          var rightMargin = parseInt(totalMarginArray[1]);
          var bottomPMargin = parseInt(totalMarginArray[2]);
          var leftMargin = parseInt(totalMarginArray[3]);
          totalMargin = new Array(topMargin, rightMargin, bottomMargin, leftMargin);
        }
      }

      var horizontalMargin = 0;
      var verticalMargin = 0;

      if (totalMargin != "NaN")
      {
        if (totalMargin.length > 0)
        {
          horizontalMargin = totalMargin[1] + totalMargin[3];
          verticalMargin = totalMargin[0] + totalMargin[2];
        }
      }


      if (controlPaddingCSS != null)
      {
        //Work out Padding
        controlPaddingCSS = controlPaddingCSS.replace(/auto/gi, '0');
        controlPaddingCSS = controlPaddingCSS.replace(/px/gi, '');
        controlPaddingCSS = controlPaddingCSS.replace(/pt/gi, '');
      }
      var totalPadding = "";

      if (controlPaddingCSS != "" && controlPaddingCSS != null)
      {
        var totalPaddingArray = controlPaddingCSS.split(' ');
        if (totalPaddingArray.length == 1)
        {
          var padding = parseInt(totalPaddingArray[0]);
          totalPadding = new Array(padding, padding, padding, padding);
        }
        else if (totalPaddingArray.length == 2)
        {
          var verticalPadding = parseInt(totalPaddingArray[0]);
          var horizontalPadding = parseInt(totalPaddingArray[1]);
          totalPadding = new Array(verticalPadding, horizontalPadding, verticalPadding, horizontalPadding);
        }
        else if (totalPaddingArray.length == 3)
        {
          var topPadding = parseInt(totalPaddingArray[0]);
          var rightPadding = parseInt(totalPaddingArray[1]);
          var bottomPadding = parseInt(totalPaddingArray[2]);

          totalPadding = new Array(topPadding, rightPadding, bottomPadding, rightPadding);
        }
        else if (totalPaddingArray.length == 4)
        {
          var topPadding = parseInt(totalPaddingArray[0]);
          var rightPadding = parseInt(totalPaddingArray[1]);
          var bottomPadding = parseInt(totalPaddingArray[2]);
          var leftPadding = parseInt(totalPaddingArray[3]);
          totalPadding = new Array(topPadding, rightPadding, bottomPadding, leftPadding);
        }
      }

      var horizontalPadding = 0;
      var verticalPadding = 0;

      if (totalPadding != "NaN")
      {
        if (totalPadding.length > 0)
        {
          horizontalPadding = totalPadding[1] + totalPadding[3];
          verticalPadding = totalPadding[0] + totalPadding[2];
        }
      }

      if (verticalMargin == "NaN" || isNaN(verticalMargin))
      { verticalMargin = 0; }
      if (verticalPadding == "NaN" || isNaN(verticalPadding))
      { verticalPadding = 0; }

      //Apply  CSS
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();

      if ($.browser.msie && document.documentMode < 7)
      {
        //IE Quirks Mode HACK as IE in Quirks Mode does not support fixed positioning
        control.css("position", "absolute");
      }
      else
      {
        control.css("position", "fixed");
      }

      if (!settings.ignorechildren)
      {
        control.css("height", controlHeight + "px");
        control.css("width", controlWidth + "px");
      }

      control.css("top", ((windowHeight - (controlHeight + verticalMargin + verticalPadding)) / 2) + "px");
      control.css("left", ((windowWidth - (controlWidth + horizontalMargin + horizontalPadding)) / 2) + "px");

      return this;
    }

    return this;
  }
})(jQuery);