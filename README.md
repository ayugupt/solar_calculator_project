# Solar 

#Note

This website fully functions only on Google chrome. Please use google chrome to use this website. If any content is going out of the screen, make sure to change the zoom level of your browser.

#About this project

The core idea of the project is to solve the problem of hesitancy to adopt solar power by middle-class families or small businesses for their 
home/organisation which usually arises due to the high initial investment of solar. This is a website where users can
select an area on the map of Delhi-NCR where they could get solar panels installed and input details like their electricity rates,
solar panel installation costs, etc and the website would generate a report telling the user
everything they would want to know such as power generated using solar, money saved over the years, carbon dioxide mitigated etc using graphs and charts to compare with standard electricity. 
The project also involves using machine learning to predict solar irradiance for Delhi to predict how much power the solar panels can generate.
This project will show users through easily readable graphs and charts how solar will compare over the years against standard electricity in terms of cost,
power generated, money saved which can push the users to take the jump and convert to solar.

This repository contains both the website code and the python code for training and deploying the Global Horizontal Irradiance model.

#Some Points to use the website

Use the first button on the purple bar to get the selection toolbar. 

![Home screen](https://raw.githubusercontent.com/ayugupt/solar_calculator_project/master/images/basic.png)

The first button on the selection toolbar allows one to select rectangular areas on the map and the second button allows one to click points on the map to make a 
polygon. The polygon should be closed polygon with no intersections. 

![toolbar](https://raw.githubusercontent.com/ayugupt/solar_calculator_project/master/images/toolbar.png)

Then after making selection, click on the tick button at the bottom of the map to confirm selection.

![selection](https://raw.githubusercontent.com/ayugupt/solar_calculator_project/master/images/polygon.png)


After selection, the inputs will be automatically filled. One can edit those to their liking. The "Generate report" button also becomes visible. Click that followed by the down button to view 
the charts and graphs.

