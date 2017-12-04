/*
  Name: Michael Bertucci
  Email: Michael_Bertucci@student.uml.edu
  UMass Lowell, COMP.4610 GUI Programming I
  Created: Dec. 2, 2017
  Assignment 6
  
  www.w3schools.com HTML and CSS tutorials were
  used as a resource, as well as the jquery plugin
  documentation at https://jqueryvalidation.org/documentation.

  Also used the following page to help figure out how to 
  use the plugin with my dynamically generated inputs:
  http://javascript-coder.com/form-validation/jquery-form-validation-guide.phtml#dynamic_elements

  Also referenced the jQuery UI library docs at https://api.jqueryui.com/, the pdf provided by
  Prof. Jesse Heines (https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/jQueryUI1.8_Ch03_TabsWidget.pdf)
  and various posts on stackoverflow.com.
  */


var minPriceValues = 1;
var maxPriceValues = 20;
var minMpgValues = 1;
var maxMpgValues = 20;
var minMonths = 1;
var maxMonths = 500;
var minMiles = 1;
var maxMiles = 100000;
var minGalPrice = 1.00;
var maxGalPrice = 5.00;
var minPrice = 2000;
var maxPrice = 4000000;
var minMpg = 5.0;
var maxMpg = 100.0;


/* 
   This var is one long string representing the html content of a tab panel.
   It is essentially what was the entire page in the previous assignments, but
   this time a new copy of it will be given to each tab that is created.

   Before being assigned to a tab, any occurrences of [tabID] must be replaced
   with the actual id of that tab.
*/
var contentTemplate = `
    <form id="input-form" name="input-form" action="javascript:onSubmit([tabID])">
      <div class="form_head">
        <h2>General Data</h2>
        <div class="data">
          <label>Time period in months: </label>
          <input type="number" name="months" id="months" value="36" min="1"><br>
        </div>
        <div class="data">
          <span></span>
          <div name="months-slider" class="slide"></div><br>
        </div>
        
        <div class="data">
          <label>Miles driven per year: </label>
          <input type="number" name="miles" id="miles" value="15000" min="1"><br>
        </div>
        <div class="data">
          <span></span>
          <div name="miles-slider" class="slide"></div><br>
        </div>

        <div class="data">
          <label>Price per gallon of gas: $</label>
          <input type="number" name="cost_of_gal" id="cost_of_gal" value="3.00" min="1" step="0.01"><br>
        </div>
        <div class="data">
          <span></span>
          <div name="gas-slider" class="slide"></div><br>
        </div>
      </div>


      <div class="form_column">
        <h2>Vehicle Prices</h2>
        Number of values: 
        <input type="number" class="num_values" name="num_prices" id="num_price_values" value="1" min="1" onchange="onNumPricesChange([tabID])"><br>
        <div name="num-prices-slider" class="slide"></div><br>
        <h4>Enter dollar values below:</h4>
        <div id="price_values" name="price_values">
          <input type="number" class="price" name="price0" id="price0" value="10000" min="2000"><br>
          <div id="price-slider0" name="price-slider0" class="price-slider"></div><br>
        </div>
        <br><br>
      </div>

      <div class="form_column">
        <h2>Vehicle Fuel Usage</h2>
        Number of values: 
        <input type="number" class="num_values" name="num_mpgs" id="num_mpg_values" value="1" min="1" onchange="onNumMpgChange([tabID])"><br>
        <div name="num-mpg-slider" class="slide"></div><br>
        <h4>Enter MpG values below:</h4>
        <div id="mpg_values" name="mpg_values">
          <input type="number" class="mpg" name="mpg0" id="mpg0" value="20" min="5"><br>
          <div id="mpg-slider0" name="mpg-slider0" class="mpg-slider"></div><br>
        </div>
        <br><br>
      </div>

      <br>
      <input type="submit" value="Submit">
    </form>

    <!--
    Spot where table will be inserted.
    The table starts with a single header with placeholder text.
    The table body will be replaced with generated rows upon submitting the form.
    -->
    <div class="table_area">
      <table id="comparison_table" name="comparison_table">
        <tr>
          <th style="border:none">Enter values and click Submit to compare costs.</th>
        </tr>
      </table>
    </div>
`;

var tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>"

// Counter to keep track of next index to use for new tab
var tabCounter = 1;

// Reference to the tab widget
var tabs;

$(function() {

  var handle = $( "#custom-handle" );
  $( "#tabs-slider" ).slider({
      min: 0,
      max: 1,
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        handle.text( ui.value );
      },
      change: function( event, ui ) {
        handle.text( ui.value );
      }
    });

  $("#delete-range").click(function() {
    var quantity = $("#tabs-slider").slider("value");
    deleteTabQuantity(quantity);
  });

  tabs = $("#tabs").tabs();

  addTab();  // Create initial tab

  // Add event handler to remove tab when close icon clicked
  tabs.on( "click", "span.ui-icon-close", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      $( "#" + panelId ).remove();
      tabs.tabs( "refresh" );
      updateTabsSlider(0, getNumTabs());
  });

});


/* Return number of tabs currently in tabs widget */
function getNumTabs() {
  var count = $(tabs).find("li").length;
  return count;
}


/* Update range of tabs slider when tabs are added/removed */
function updateTabsSlider(min, max) {
  if( $( "#tabs-slider" ).slider("value") > max ) {
    $( "#tabs-slider" ).slider("value", max);
  }
  $( "#tabs-slider" ).slider("option", "min", min);
  $( "#tabs-slider" ).slider("option", "max", max);

}


/* Delete specific number of tabs, starting from the first index */
function deleteTabQuantity(num) {
  var closeButtons = $("span.ui-icon-close");

  if(num > closeButtons.length) {
    return;
  }

  closeButtons.each(function(index, element) {
    if(index < num) {
      $(this).click();
    } else {
      return false;
    }
  });

  updateTabsSlider(0, getNumTabs());
}


/* Construct and append new tab to the tabs widget */
function addTab() {
  var label = "Table " + tabCounter;
  var id = "tabs-" + tabCounter;
  var tabTitle = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ));
  var tabContent = contentTemplate.replace( /\[tabID\]/g, "\'#" + id +"\'");
  console.log(tabContent);

  tabs.find(".ui-tabs-nav").append(tabTitle);
  tabs.append("<div id='" + id + "'>" + tabContent + "</div>");

  initSliders("#" + id);
  initValidator("#" + id);
  tabs.tabs("refresh");

  // Set to active tab by "clicking" it
  $("a[href=#" + id + "]").click();

  tabCounter++;
  updateTabsSlider(0, getNumTabs());
}


/* Create all sliders within a specific tab's form */
function initSliders(tab) {
  console.log(tab + " #months-slider");
  $(tab).find("[name=months-slider]").slider({
            range: "min",
            min: minMonths,
            max: maxMonths,
            value: 36,
            step: 1,
            slide: function(event, ui) {
              $(tab).find("[name=months]").val(ui.value);
            }
        });
  $(tab).find("[name=months]").change(function() {
    $(tab).find("[name=months-slider]").slider("option", "value", $(this).val());
  });

  $(tab).find("[name=miles-slider]").slider({
            range: "min",
            min: minMiles,
            max: maxMiles,
            value: 15000,
            step: 1,
            slide: function(event, ui) {
              $(tab).find("[name=miles]").val(ui.value);
            }
        });
  $(tab).find("[name=miles]").change(function() {
    $(tab).find("[name=miles-slider]").slider("option", "value", $(this).val());
  });

  $(tab).find("[name=gas-slider]").slider({
            range: "min",
            min: minGalPrice,
            max: maxGalPrice,
            value: 3.00,
            step: 0.01,
            slide: function(event, ui) {
              $(tab).find("[name=cost_of_gal]").val(ui.value);
            }
        });
  $(tab).find("[name=cost_of_gal]").change(function() {
    $(tab).find("[name=gas-slider]").slider("option", "value", $(this).val());
  });

  $(tab).find("[name=num-prices-slider]").slider({
            range: "min",
            min: minPriceValues,
            max: maxPriceValues,
            value: 1,
            step: 1,
            slide: function(event, ui) {
              $(tab).find("[name=num_prices]").val(ui.value);
              onNumPricesChange(tab);
            }
        });

  $(tab).find("[name=num-mpg-slider]").slider({
            range: "min",
            min: minMpgValues,
            max: maxMpgValues,
            value: 1,
            step: 1,
            slide: function(event, ui) {
              $(tab).find("[name=num_mpgs]").val(ui.value);
              onNumMpgChange(tab);
            }
        });

  createPriceSlider("price-slider0", "price0", tab);
  createMpgSlider("mpg-slider0", "mpg0", tab);

}


/* Install validator on form */
function initValidator(tab) {

  $(tab).find("[name=input-form]").validate({

    rules: {

      months: {
        required: true,
        number: true,
        step: 1,
        min: minMonths,
        max: maxMonths
      },
      miles: {
        required: true,
        number: true,
        step: 1,
        min: minMiles,
        max: maxMiles
      },
      cost_of_gal: {
        required: true,
        number: true,
        step: 0.01,
        min: minGalPrice,
        max: maxGalPrice
      },
      num_prices: {
        required: true,
        number: true,
        step: 1,
        min: minPriceValues,
        max: maxPriceValues
      },
      num_mpgs: {
        required: true,
        number: true,
        step: 1,
        min: minMpgValues,
        max: maxMpgValues
      },
      price0: {
        required: true,
        number: true,
        step: 1,
        min: minPrice,
        max: maxPrice
      },
      mpg0: {
        required: true,
        number: true,
        step: 0.1,
        min: minMpg,
        max: maxMpg
      }

    },

    messages: {

      months: {
        required: "Please enter the number of months.",
        number: "Please enter an integer value.",
        step: "Number of months must be a whole number.",
        min: $.validator.format("Number of months must be at least {0}."),
        max: $.validator.format("Maximum number of months is {0}.")
      },
      miles: {
        required: "Please enter the number of miles.",
        number: "Please enter an integer value.",
        step: "Number of miles must be a whole number.",
        min: $.validator.format("Number of miles must be at least {0}."),
        max: $.validator.format("Maximum number of miles is {0}.")
      },
      cost_of_gal: {
        required: "Please enter the gas price.",
        number: "Please enter a numeric value for the price.",
        step: "Price must be accurate to two decimal places.",
        min: "The minimum valid price is $1.00.",
        max: "The maximum valid price is $5.00."
      },
      num_prices: {
        required: "Please enter the number of price values.",
        number: "Please enter an integer value.",
        step: "Number of values must be a whole number.",
        min: $.validator.format("Minimum number of values is {0}."),
        max: $.validator.format("Maximum number of values is {0}.")
      },
      num_mpgs: {
        required: "Please enter the number of MpG values.",
        number: "Please enter an integer value.",
        step: "Number of values must be a whole number.",
        min: $.validator.format("Minimum number of values is {0}."),
        max: $.validator.format("Maximum number of values is {0}.")
      },
      price0: {
        required: "Please enter a price value.",
        number: "Price value must be a number.",
        step: "Price must be a whole number.",
        min: $.validator.format("Minimum valid price is ${0}."),
        max: $.validator.format("Maximum valid price is ${0}.")
      },
      mpg0: {
        required: "Please enter a MpG value.",
        number: "MpG value must be a number.",
        step: "MpG must be accurate to one decimal place.",
        min: $.validator.format("Minimum valid value is {0}."),
        max: $.validator.format("Maximum valid value is {0}.")
      }

    }

  });

}


/* Re-create the list of price inputs based on number of
   values chosen by user */
function onNumPricesChange(tab) {
  // Save any values currently in the inputs
  var currentValues = getValues("price", tab);

  var num = parseInt($(tab).find("[name=num_prices]").val(), 10);
  if(isNaN(num) || num > maxPriceValues || num < 1) {
    return;  // Leave without changes if the input is invalid
  }

  // Construct new sequence of input fields in html and insert them
  var values = $(tab).find("[name=price_values]");
  var singleInput = "<input type=\"number\" class=\"price\" name=\"price[i]\" id=\"price[i]\" value=\"10000\" min=\"2000\"><br>" +
                    "<div id=\"price-slider[i]\" name=\"price-slider[i]\" class=\"price-slider\"></div><br>";
  
  var inputs = "";
  for(var i = 0; i < num; i++) {
    inputs = inputs + singleInput.replace(/\[i\]/g, i);  // make name unique by substituing index number
  }
  
  values.html( inputs );

  // Add validation rules to the newly-created input elements
  $(tab).find("input.price").each(function() {
    $(this).rules("add", {
      required: true,
      number: true,
      step: 1,
      min: minPrice,
      max: maxPrice,
      messages: {
        required: "Please enter a price value.",
        number: "Price value must be a number.",
        step: "Price must be a whole number.",
        min: $.validator.format("Minimum valid price is ${0}."),
        max: $.validator.format("Maximum valid price is ${0}.")
      }
    });
  });

  // Construct sliders from divs
  for(var i = 0; i < num; i++) {
    var sliderDiv = "price-slider" + i;
    var inputId = "price" + i;
    createPriceSlider(sliderDiv, inputId, tab);
  } 
  
  // Restore as many old values as the new number of inputs allows
  var newInputs = $(tab).find(".price");
  for(var i = 0; i < newInputs.length && i < currentValues.length; i++) {
    newInputs.get(i).value = currentValues[i];
  }

  // Set slider to match number of inputs
  $(tab).find("[name=num-prices-slider]").slider("option", "value", num);
}


/* Re-create the list of mpg inputs based on number of
   values chosen by user */
function onNumMpgChange(tab) {
  // Save any values currently in the inputs
  var currentValues = getValues("mpg", tab);

  var num = parseInt($(tab).find("[name=num_mpgs]").val(), 10);
  if(isNaN(num) || num > maxMpgValues || num < 1) {
    return;  // Leave without changes if the input is invalid
  }

  // Construct new sequence of input fields in html and insert them
  var values = $(tab).find("[name=mpg_values]");
  var singleInput = "<input type=\"number\" class=\"mpg\" name=\"mpg[i]\" id=\"mpg[i]\" value=\"20\" min=\"5\"><br>" +
                    "<div id=\"mpg-slider[i]\" name=\"mpg-slider[i]\" class=\"mpg-slider\"></div><br>";
  
  var inputs = "";
  for(var i = 0; i < num; i++) {
    inputs = inputs + singleInput.replace(/\[i\]/g, i);  // make name unique by substituing index number
  }
  
  values.html( inputs );

  // Add validation rules to the newly-created input elements
  $(tab).find("input.mpg").each(function() {
    $(this).rules("add", {
      required: true,
      number: true,
      step: 0.1,
      min: minMpg,
      max: maxMpg,
      messages: {
        required: "Please enter a MpG value.",
        number: "MpG value must be a number.",
        step: "MpG must be accurate to one decimal place.",
        min: $.validator.format("Minimum valid value is {0}."),
        max: $.validator.format("Maximum valid value is {0}.")
      }
    });
  });

  // Construct sliders from divs
  for(var i = 0; i < num; i++) {
    var sliderDiv = "mpg-slider" + i;
    var inputId = "mpg" + i;
    createMpgSlider(sliderDiv, inputId, tab);
  } 
  
  // Restore as many old values as the new number of inputs allows
  var newInputs = $(tab).find(".mpg");
  for(var i = 0; i < newInputs.length && i < currentValues.length; i++) {
    newInputs.get(i).value = currentValues[i];
  }

  // Set slider to match number of inputs
  $(tab).find("[name=num-mpg-slider]").slider("option", "value", num);
}


/* Create slider from specified div and bind 
   it to input field */
function createPriceSlider(sliderDiv, inputId, tab) {
  $(tab).find("[name=" + sliderDiv + "]").slider({
            range: "min",
            min: minPrice,
            max: maxPrice,
            value: 10000,
            step: 1,
            slide: function(event, ui) {
              console.log(inputId);
              $(tab).find("[name=" + inputId + "]").val(ui.value);
            }
        });

  $(tab).find("[name=" + inputId + "]").change(function() {
    $(tab).find("[name=" + sliderDiv + "]").slider("option", "value", $(this).val());
  });
}


/* Create slider from specified div and bind 
   it to input field */
function createMpgSlider(sliderDiv, inputId, tab) {
  $(tab).find("[name=" + sliderDiv + "]").slider({
            range: "min",
            min: minMpg,
            max: maxMpg,
            value: 20,
            step: 0.1,
            slide: function(event, ui) {
              console.log(inputId);
              $(tab).find("[name=" + inputId + "]").val(ui.value);
            }
        });

  $(tab).find("[name=" + inputId + "]").change(function() {
    $(tab).find("[name=" + sliderDiv + "]").slider("option", "value", $(this).val());
  });
}


/* Return array of values from list of input fields with
   the specified class name */
function getValues(name, tab) {
  var inputs = $(tab).find("."+name);
  var values = [];
  
  for(var i = 0; i < inputs.length; i++) {
    values.push(parseFloat(inputs.get(i).value));
  }
  
  return values;
}


/* Use form values to build an html table and insert
   it into the page */
function createTable(tab) {
  var prices = getValues("price", tab);
  console.log("Prices: " + prices);
  
  var mpgs = getValues("mpg", tab);
  console.log("MpG: " + mpgs);
  
  var table = $(tab).find("[name=comparison_table]");
  
  var html_string = "<caption><h2>Cost Comparison</h2></caption>\n";
  
  // Set up header row
  html_string += "<tr>\n<th>Price/\nMpG</th>\n";
  for(var i = 0; i < prices.length; i++) {
    html_string += "<th>$" + prices[i] + "</th>\n";
  }
  html_string += "</tr>\n";
  
  // Prepare values for calculating inner table data
  var total, per_month, per_mile;
  var months = parseInt($(tab).find("[name=months]").val(), 10);
  var miles = parseInt($(tab).find("[name=miles]").val(), 10);
  var cost_gallon = parseFloat($(tab).find("[name=cost_of_gal]").val());
  var total_miles = (months / 12) * miles;

  console.log("Months: " + months + "  Miles: " + miles + "  Cost/Gal: " + cost_gallon);
  
  // Add data rows for each mpg value
  for(i = 0; i < mpgs.length; i++) {
    html_string += "<tr>\n<th>" + mpgs[i].toFixed(2) + "</th>\n";
    for (var j = 0; j < prices.length; j++) {
      // Calculate the total cost as initial price + cost of gallons consumed
      total = prices[j] + (total_miles / mpgs[i]) * cost_gallon;
      per_month = (total/months).toFixed(2);
      per_mile = (total/total_miles).toFixed(2);
      html_string += "<td>$" + per_month + "/month\n$" + per_mile + "/mile</td>\n";
    }
    html_string += "</tr>\n";
  }
  
  console.log(html_string);
  
  table.html(html_string);
}

/* Check validity (type and range) of user inputs */
function validateInput() {

  /* Validate number of months given */
  var field = document.getElementById("months");
  var value = parseInt(field.value, 10);
  
  // Check if value is integer and not less than 1
  if (isNaN(value) || (value % 1) !== 0 || value < 1) {
    alert("INVALID INPUT:\nnumber of months must be an integer greater than or equal to 1");
    return false;
  }
  
  /* Validate number of miles given */
  field = document.getElementById("miles");
  value = parseInt(field.value, 10);
  if (isNaN(value) || (value % 1) !== 0 || value < 1) {
    alert("INVALID INPUT:\nnumber of miles must be an integer greater than or equal to 1");
    return false;
  }
  
  /* Validate price of gallon given */
  field = document.getElementById("cost_of_gal");
  value = parseFloat(field.value);
  // Check if value is a number not less than 1
  if (isNaN(value) || value < 1) {
    alert("INVALID INPUT:\nprice per gallon must be a number greater than or equal to 1.00");
    return false;
  }
  
  /* Validate number of price inputs given */
  field = document.getElementById("num_price_values");
  value = parseInt(field.value, 10);
  if (isNaN(value) || (value % 1) !== 0 || value < 1) {
    alert("INVALID INPUT:\nnumber of price values must be an integer greater than or equal to 1");
    return false;
  }
  
  /* Validate each of the price values given */
  field = document.getElementsByClassName("price");
  for(var i = 0; i < field.length; i++) {
    value = parseInt(field[i].value, 10);
    if (isNaN(value) || (value % 1) !== 0 
        || value < 2000 || value > 4000000) {
      alert("INVALID INPUT:\nprice value must be an integer between 2000 and 4000000");
      return false;
    }
  }
  
  /* Validate number of mpg inputs given */
  field = document.getElementById("num_mpg_values");
  value = parseInt(field.value, 10);
  if (isNaN(value) || (value % 1) !== 0 || value < 1) {
    alert("INVALID INPUT:\nnumber of mpg values must be an integer greater than or equal to 1");
    return false;
  }
  
  /* Validate each of the mpg values given */
  field = document.getElementsByClassName("mpg");
  for(var i = 0; i < field.length; i++) {
    value = parseInt(field[i].value, 10);
    if (isNaN(value) || (value % 1) !== 0 
        || value < 5 || value > 100) {
      alert("INVALID INPUT:\nmpg value must be an integer between 5 and 100");
      return false;
    }
  }
  
  return true;
  
}

/* Function to call when user clicks Submit button */
function onSubmit(tab) {
  var valid = true; //validateInput();
  
  if(valid) {
    createTable(tab);
    $(tab).find("[name=comparison_table]").get(0).scrollIntoView({behavior: "smooth"});
  }
}
