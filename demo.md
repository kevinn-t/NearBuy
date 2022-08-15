Rough Outline:
1. Team introduction
2. Background of application:
  -tried making roadtrip planner->find stores near a center for roadtrips/your neighborhood
  -finding api journey
4. Demo
5. What was challenging / exciting to get your application working.

DEMO OUTLINE

/**Team introduction**/


/**Background of application**/
  - wanted to make a road trip planner where attractions near your route will be shown
  - realized that would take a lot of work
  - found the arcgis api that had a similar feature that shows nearby shops in the map view, so it can still be used on roadtrips/your neighborhood


/**DEMO**/
/**How the store search and navigation are supposed to be used together**/
- you can find nearby stores within the map view. 
- after clicking on the stores to look at store name and figuring out where you want to go, you can click start navigation to click your starting point and the ending point which is the store. 
- directions will display
- after you are at the store you can click end navigation to return to browsing different types of stores through the dropdown


-**main features and how the code works**-
*Finding Nearby Stores*
- select store type from dropdown menu
- we will pass this attribute name to the arcgis api and get returned a list of stores with the same "category" attribute as chosen
- we limit how many will show up (10)
- then, using a function, we create a new object for the API to translate into an element to display on the map

*Nav guide*
1) find your store of choice
3) start navigating-> enables the api functions that allow the user to select a starting and end point
4) click on your store after "start" has been pressed (this will be your end location)
5) click on your starting location
6) the argis api will draw a route connecting the two as well as display directions using built in functions

/**Challenges**/
- finding the right api for free
- understanding how to use the api and the functions used to set up the map view and display store searches
- implementing the end navigation button: it functionally works but we wanted to end the navigation mode without refreshing the screen

/**Exciting accomplishment**/
- getting category dropdown selectors
- getting the store search working

 /**Next Steps**/
 - having the store search results stay on screen when in navigation mode
 - 

