
# Check it out [here](https://nadinsoft-weatherdashboard.netlify.app/)

# Or if you wanna run it locally

1. Clone the repo:
```bash
git clone https://github.com/Arminmow/weather-dashboard-nadin-soft.git
cd weather-dashboard-nadin-soft
````

2. Install dependencies:

```bash
npm install
```

3. Get an API key from [weatherapi](https://www.weatherapi.com/) and create a .env file in the root of the project:

```env
VITE_WEATHER_API_KEY=your_api_key
```

4. Run the dev server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---
## 🧠 About the Design Pattern – Compound Components

This project uses the Compound Components pattern — where related components live together under a single parent (like `Login.Title`, `Login.Input`, `Login.Button`, etc). This keeps the API clean, flexible, and easy to understand.

Some files might get a bit long (400–500+ lines), but that’s fine as long as the logic stays cohesive and well organized. File length isn’t the problem but messy code and scattered logic is.

Compound components help by:

- Keeping related UI and logic together  
- Making reuse and composition easier  
- Avoiding prop-drilling or complicated prop setups  
- Providing a cleaner API for whoever uses the component  

This pattern is also used in popular libraries like **shadcn/ui** , my fav.

---

## State Management 

Since this project already rocks the Compound Components pattern with a provider parent, managing and sharing state across child components becomes straightforward through React Context.

The parent component holds the state and exposes it via context, so all related sub-components can access and update that state directly without passing props around endlessly. This approach avoids prop-drilling and keeps the data flow clear.

It also helps keep the components loosely coupled but still working together, making the code easier to maintain and reason about. Overall, using context inside compound components strikes a good balance between simplicity and scalability for state management.


### Why Not Redux?

This app is small-scale, and there’s no real need for a heavy global state management tool like Redux. Since all the components are already compound components and tightly connected, managing state with React Context fits perfectly.

Adding Redux here would just mean extra dependency, more boilerplate, and unnecessary complexity. It’s like bringing a chainsaw to cut your steak — overkill for the job.

Knowing your tools and using the right one for the scale and needs of your app is key. In this case, Redux would be more of a burden than a help.

---
### About the API

This app uses the WeatherAPI service to fetch location data, current weather, and forecasts. One important note: WeatherAPI doesn’t support searching locations in Persian, so even if the app is in Farsi, users can only search locations using English characters.

Also, since the API is free, the forecast length might vary — some locations may not have a full 14-day forecast available, and you might see fewer days of data depending on the location.

### Average Monthly Temperature Calculation

Since WeatherAPI don’t give us historical data, I’m pulling daily temps from `archive-api.open-meteo.com` for the past year. Then, I crunch those numbers to get average temps for each month.

Here’s how it goes down:

- Grab daily temps with their dates.
- Turn those dates into month names like "Jan", "Feb", etc.
- Group all temps by their month.
- Calculate the average for each month by adding up temps and dividing by the count.
- Round the averages to one decimal to keep it clean.

This way, even without WeatherAPI history, we still get solid monthly averages that make sense.


