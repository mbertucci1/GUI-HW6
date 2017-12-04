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

$(function() {

  $("#months-slider").slider({
            range: "min",
            min: minMonths,
            max: maxMonths,
            value: 36,
            step: 1,
            slide: function(event, ui) {
              $("#months").val(ui.value);
            }
        });
  $("#months").change(function() {
    $("#months-slider").slider("option", "value", $(this).val());
  });

  $("#miles-slider").slider({
            range: "min",
            min: minMiles,
            max: maxMiles,
            value: 15000,
            step: 1,
            slide: function(event, ui) {
              $("#miles").val(ui.value);
            }
        });
  $("#miles").change(function() {
    $("#miles-slider").slider("option", "value", $(this).val());
  });

  $("#gas-slider").slider({
            range: "min",
            min: minGalPrice,
            max: maxGalPrice,
            value: 3.00,
            step: 0.01,
            slide: function(event, ui) {
              $("#cost_of_gal").val(ui.value);
            }
        });
  $("#cost_of_gal").change(function() {
    $("#gas-slider").slider("option", "value", $(this).val());
  });

  $("#num-prices-slider").slider({
            range: "min",
            min: minPriceValues,
            max: maxPriceValues,
            value: 1,
            step: 1,
            slide: function(event, ui) {
              $("#num_price_values").val(ui.value);
              onNumPricesChange();
            }
        });

  $("#num-mpg-slider").slider({
            range: "min",
            min: minMpgValues,
            max: maxMpgValues,
            value: 1,
            step: 1,
            slide: function(event, ui) {
              $("#num_mpg_values").val(ui.value);
              onNumMpgChange();
            }
        });

  createPriceSlider("#price-slider0", "#price0");
  createMpgSlider("#mpg-slider0", "#mpg0");


  $("#input-form").validate({

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
});

function createPriceSliders() {
  
}

/* Re-create the list of price inputs based on number of
   values chosen by user */
function onNumPricesChange() {
  // Save any values currently in the inputs
  var currentValues = getValues("price");

  var num = parseInt(document.getElementById("num_price_values").value, 10);
  if(isNaN(num) || num > maxPriceValues || num < 1) {
    return;  // Leave without changes if the input is invalid
  }

  // Construct new sequence of input fields in html and insert them
  var values = document.getElementById("price_values");
  var singleInput = "<input type=\"number\" class=\"price\" name=\"price[i]\" id=\"price[i]\" value=\"10000\" min=\"2000\"><br>" +
                    "<div id=\"price-slider[i]\" name=\"[i]\" class=\"price-slider\"></div><br>";
  
  var inputs = "";
  for(var i = 0; i < num; i++) {
    inputs = inputs + singleInput.replace(/\[i\]/g, i);  // make name unique by substituing index number
  }
  
  values.innerHTML = inputs;

  // Add validation rules to the newly-created input elements
  $("input.price").each(function() {
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
    var sliderDiv = "#price-slider" + i;
    var inputId = "#price" + i;
    createPriceSlider(sliderDiv, inputId);
  } 
  
  // Restore as many old values as the new number of inputs allows
  var newInputs = document.getElementsByClassName("price");
  for(var i = 0; i < newInputs.length && i < currentValues.length; i++) {
    newInputs[i].value = currentValues[i];
  }

  // Set slider to match number of inputs
  $("#num-prices-slider").slider("option", "value", num);
}

/* Re-create the list of mpg inputs based on number of
   values chosen by user */
function onNumMpgChange() {
  // Save any values currently in the inputs
  var currentValues = getValues("mpg");

  var num = parseInt(document.getElementById("num_mpg_values").value, 10);
  if(isNaN(num) || num > maxMpgValues || num < 1) {
    return;  // Leave without changes if the input is invalid
  }

  // Construct new sequence of input fields in html and insert them
  var values = document.getElementById("mpg_values");
  var singleInput = "<input type=\"number\" class=\"mpg\" name=\"mpg[i]\" id=\"mpg[i]\" value=\"20\" min=\"5\"><br>" +
                    "<div id=\"mpg-slider[i]\" name=\"[i]\" class=\"mpg-slider\"></div><br>";
  
  var inputs = "";
  for(var i = 0; i < num; i++) {
    inputs = inputs + singleInput.replace(/\[i\]/g, i);  // make name unique by substituing index number
  }
  
  values.innerHTML = inputs;

  // Add validation rules to the newly-created input elements
  $("input.mpg").each(function() {
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
    var sliderDiv = "#mpg-slider" + i;
    var inputId = "#mpg" + i;
    createMpgSlider(sliderDiv, inputId);
  } 
  
  // Restore as many old values as the new number of inputs allows
  var newInputs = document.getElementsByClassName("mpg");
  for(var i = 0; i < newInputs.length && i < currentValues.length; i++) {
    newInputs[i].value = currentValues[i];
  }

  // Set slider to match number of inputs
  $("#num-mpg-slider").slider("option", "value", num);
}


/* Create slider from specified div and bind 
   it to input field */
function createPriceSlider(sliderDiv, inputId) {
  $(sliderDiv).slider({
            range: "min",
            min: minPrice,
            max: maxPrice,
            value: 10000,
            step: 1,
            slide: function(event, ui) {
              console.log(inputId);
              $(inputId).val(ui.value);
            }
        });

  $(inputId).change(function() {
    $(sliderDiv).slider("option", "value", $(this).val());
  });
}


/* Create slider from specified div and bind 
   it to input field */
function createMpgSlider(sliderDiv, inputId) {
  $(sliderDiv).slider({
            range: "min",
            min: minMpg,
            max: maxMpg,
            value: 20,
            step: 0.1,
            slide: function(event, ui) {
              console.log(inputId);
              $(inputId).val(ui.value);
            }
        });

  $(inputId).change(function() {
    $(sliderDiv).slider("option", "value", $(this).val());
  });
}


/* Return array of values from list of input fields with
   the specified class name */
function getValues(name) {
  var inputs = document.getElementsByClassName(name);
  var values = [];
  
  for(var i = 0; i < inputs.length; i++) {
    values.push(parseFloat(inputs[i].value));
  }
  
  return values;
}


/* Use form values to build an html table and insert
   it into the page */
function createTable() {
  var prices = getValues("price");
  console.log("Prices: " + prices);
  
  var mpgs = getValues("mpg");
  console.log("MpG: " + mpgs);
  
  var table = document.getElementById("comparison_table");
  
  var html_string = "<caption><h2>Cost Comparison</h2></caption>\n";
  
  // Set up header row
  html_string += "<tr>\n<th>Price/\nMpG</th>\n";
  for(var i = 0; i < prices.length; i++) {
    html_string += "<th>$" + prices[i] + "</th>\n";
  }
  html_string += "</tr>\n";
  
  // Prepare values for calculating inner table data
  var total, per_month, per_mile;
  var months = parseInt(document.getElementById("months").value, 10);
  var miles = parseInt(document.getElementById("miles").value, 10);
  var cost_gallon = parseFloat(document.getElementById("cost_of_gal").value);
  var total_miles = (months / 12) * miles;
  
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
  
  table.innerHTML = html_string;
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
function onSubmit() {
  var valid = validateInput();
  
  if(valid) {
    createTable();
    document.getElementById("comparison_table").scrollIntoView({behavior: "smooth"});
  }
}
