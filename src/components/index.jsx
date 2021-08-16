import React, { Component, Fragment } from "react";
import cloudyLogo from '../static/png/cloudy.png';
import { getCitylistData, getCityDetailedData } from '../service/weatherService.js';
import { parse } from "commander";


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    toggleForms = (formElement) => {
        if (formElement === "showUserParamForm") {
            this.setState({
                showUserParamForm: true,
                showCustomFieldForm: false
            })
        }
        else {
            this.setState({
                showUserParamForm: false,
                showCustomFieldForm: true
            })
        }
    }

    componentDidMount = () => {
        this.loadCityListData();
    }

    loadCityListData = async () => {
        let response = await getCitylistData();
        console.log(response)

        let topCity = response.data.data[0].city;

        this.setState({
            cityListData: response.data.data,
            selectedCity: topCity
        })

        this.showDetailedData(topCity)
    }

    showDetailedData = async (city) => {
        let response = await getCityDetailedData(city)
        console.log(response)
        let dayWiseData = {};
        let todaysData = [];
        let currentParsedDate = "";
        let listOftimes = [];
        for (const item of response.data.data.list) {
            let parsedDate = new Date(item.dt * 1000).toLocaleDateString();
            let parsedTime = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (currentParsedDate !== "" && currentParsedDate !== parsedDate) {
                if (currentParsedDate === new Date().toLocaleDateString()) {
                    todaysData = listOftimes;
                    currentParsedDate = "";
                    listOftimes = [];
                }
                else {
                    dayWiseData[currentParsedDate] = listOftimes
                    currentParsedDate = "";
                    listOftimes = [];
                }
            }
            currentParsedDate = parsedDate;
            item.parsedDate = parsedDate;
            item.parsedTime = parsedTime;
            listOftimes.push(item)
        }

        this.setState({
            cityDetailedData: response.data.data,
            dayWiseData: dayWiseData,
            todaysData: todaysData,
            selectedCity: city
        })
    }


    render() {
        const { cityListData, cityDetailedData, dayWiseData, todaysData, selectedCity } = this.state;
        console.log(cityListData, dayWiseData, todaysData)
        return (
            <Fragment>
                <div className="header">
                    <div className="header-logo">
                        <img src={cloudyLogo} alt="Weather-logo" className="header-logo" />
                    </div>
                    <div className="header-text">
                        <h5 className="m-0">Weather.io</h5>
                    </div>
                </div>
                <div className="main-container">
                    <Fragment>
                        <div className="data-container fadeup-effect">
                            <div className="list-container">
                                <div className="weather-list-form fadeup-effect">
                                    {cityListData && cityListData.map((item, count) =>
                                        <div className={`weather-list-item ${item.city === selectedCity ? 'active-item' : ''}`} onClick={() => this.showDetailedData(item.city)} key={count}>
                                            <h4>{item.city}</h4>
                                            <h6>Temp - {Math.round(item.temp - 273.15)}&#8451;</h6>
                                            <div className="d-sub-title">
                                                <span><p>Min - {Math.round(item.minTemp - 273.15)}&#8451;</p></span>
                                                <span><p>Max - {Math.round(item.maxTemp - 273.15)}&#8451;</p></span>
                                            </div>
                                            <p>Weather - {item.weather}</p>
                                        </div>)}
                                </div>
                            </div>
                            <div className="preview-container">
                                <Fragment>
                                    {cityDetailedData &&
                                        <div className="detailed-weather-data">
                                            <h3>{cityDetailedData.city.name.toUpperCase()} ({cityDetailedData.city.country})</h3>
                                            <div className="d-sub-title">
                                                <span><p>lat - {cityDetailedData.city.coord.lat}</p></span>
                                                <span><p>lon - {cityDetailedData.city.coord.lon}</p></span>
                                            </div>
                                            {todaysData &&
                                                <div className="today-weather">
                                                    <h5>Todays' Weather</h5>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                {todaysData.map((data) => <th>{data.parsedTime}</th>)}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                {todaysData.map((data) => <td>{Math.round(data.main.temp - 273.15)}&#8451;</td>)}
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>}
                                            {dayWiseData &&
                                                <div className="next-days-weather">
                                                    <h5>Next 4 Days Weather</h5>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th><i>Day</i></th>
                                                                {dayWiseData && dayWiseData[Object.keys(dayWiseData)[0]].map((item) =>
                                                                    <th>{item.parsedTime}</th>)}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dayWiseData && Object.keys(dayWiseData).map((key) => <tr key={key}>
                                                                <td><i><b>{key}</b></i></td>
                                                                {
                                                                    dayWiseData[key].map((item) => <td>{Math.round(item.main.temp - 273.15)}&#8451;</td>)
                                                                }
                                                            </tr>)}
                                                        </tbody>
                                                    </table>
                                                </div>}
                                        </div>}
                                </Fragment>
                            </div>
                        </div>
                    </Fragment>
                </div>
            </Fragment>
        )
    }
} export default Home;