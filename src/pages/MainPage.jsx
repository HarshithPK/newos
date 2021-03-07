import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import addDays from "date-fns/addDays";

//React Datepicker CSS
import "react-datepicker/dist/react-datepicker.css";

function MainPage() {
    const [searchAstroid, setSearchAstroid] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {}, 3000);
        return () => clearTimeout(delayDebounceFn);
    }, [searchAstroid]);

    function formatDate(date) {
        const preformattedDate = new Date(date);

        const day = preformattedDate.getDate();
        const month = preformattedDate.getMonth() + 1;

        const year = preformattedDate.getFullYear();

        const formattedDate = year + "-" + month + "-" + day;

        return formattedDate;
    }

    return (
        <div>
            <div className="title-section mt-2">
                <h1 className="title">NEOWS</h1>
            </div>

            <p className="discription-text ml-4 mr-4 mt-4 mb-4">
                <strong> NeoWs</strong> (Near Earth Object Web Service) is a
                RESTful web service for near earth Asteroid information. All the
                data is from the NASA JPL Asteroid team. JPL manages NASA's
                Center for Near-Earth Object Studies, which tracks comets and
                asteroids that drift close to Earth's orbital neighborhood.
            </p>

            <p className="discription-text ml-4 mr-4 mb-4">
                A Near-Earth Object (NEO) is generally defined as an asteroid or
                comet that approaches our planet less than 1.3 times the
                distance from Earth to the Sun (the Earth-Sun distance is about
                93 million miles). Most NEOs pose no peril at all. It’s the
                small percentage of Potentially Hazardous Asteroids that draws
                extra scrutiny. These objects are defined as those that approach
                Earth at less than half the Earth-Sun distance.
            </p>

            <div className="content-tab-1 mt-3">
                <h2>Hello 1</h2>

                <p className="ml-2 mr-2">Hello 1</p>

                <label>Pick Start Date:</label>

                <DatePicker
                    className="date-picker mb-2 "
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    title="Select Start Date"
                    dateFormat="yyyy-MM-dd"
                    selected={startDate}
                    startDate={startDate}
                    selectsStart
                    showMonthDropdown
                    showYearDropdown
                    endDate={endDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Select Start Date"
                    withPortal
                />

                <label>Pick End Date:</label>

                <DatePicker
                    className="date-picker"
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    title="Select End Date"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="yyyy-MM-dd"
                    minDate={startDate}
                    maxDate={addDays(startDate, 7)}
                    placeholderText="Select Start Date"
                    withPortal
                />

                <Link
                    to={`/search-astroid-dates/${formatDate(
                        startDate
                    )}&${formatDate(endDate)}`}>
                    <button
                        type="button"
                        className="btn btn-success btn-sm mt-1">
                        {" "}
                        Search{" "}
                    </button>
                </Link>
            </div>

            <div className="content-tab-2 mt-4">
                <h2>Hello 2</h2>
                <p className="ml-2 mr-2">Hello 2</p>
                <label>Enter Astroid Id:</label> <br></br>
                <input
                    className="astroid-id-text mt-1 mr-2"
                    id="astroid"
                    data-bs-toggle="popover"
                    data-bs-trigger="focus"
                    title="Enter Astroid Id"
                    onChange={(e) => setSearchAstroid(e.target.value)}
                    type="text"
                    placeholder="Enter Astroid Id"
                />
                <br></br>
                <Link
                    to={`/search-astroid-id/${searchAstroid}`}
                    className="btn btn-success btn-sm mt-1 mb-2">
                    Search
                </Link>
            </div>
        </div>
    );
}

export default MainPage;
